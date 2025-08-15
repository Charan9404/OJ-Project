import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
import transporter from "../config/nodemailer.js"

// ✅ Password validation function
const validatePassword = (password) => {
  const errors = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/[a-zA-Z]/.test(password)) {
    errors.push("Password must contain at least one letter")
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  }
}

// ✅ Generate JWT Token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })

// ✅ Register User - Updated with password validation
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing Details" })
    }

    // ✅ Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Password validation failed",
        errors: passwordValidation.errors,
      })
    }

    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new userModel({ name, email, password: hashedPassword })
    await user.save()

    const token = generateToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to CodeLabX",
      text: `Hello ${name}, your account has been successfully created!`,
    })

    return res.status(201).json({ success: true, message: "User registered successfully" })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and Password are required" })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Password" })
    }

    const token = generateToken(user._id)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({ success: true, message: "Login successful" })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Google OAuth Success Handler
export const googleAuthSuccess = async (req, res) => {
  try {
    const user = req.user
    const token = generateToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}?auth=success`)
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}?auth=error`)
  }
}

// ✅ Google OAuth Failure Handler
export const googleAuthFailure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}?auth=error`)
}

// ✅ Logout User
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  })
  return res.json({ success: true, message: "Logged Out" })
}

// ✅ Send Verification OTP
export const sendVerifyOtp = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))
    user.verifyOtp = otp
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000
    await user.save()

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification - CodeLabX",
      text: `Your OTP is ${otp}. It is valid for 24 hours.`,
    })

    return res.json({ success: true, message: "OTP sent successfully" })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body
    const user = await userModel.findById(req.userId)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    if (user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" })
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" })
    }

    user.isAccountVerified = true
    user.verifyOtp = ""
    user.verifyOtpExpireAt = 0
    await user.save()

    return res.json({ success: true, message: "Email verified successfully" })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Check if user is authenticated - NEW FUNCTION
export const isAuthenticated = async (req, res) => {
  try {
    // If we reach here, the userAuth middleware has already verified the token
    const user = await userModel.findById(req.userId).select("-password")
    return res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Send Reset OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" })
  }

  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))
    user.resetOtp = otp
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000
    await user.save()

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP - CodeLabX",
      text: `Your OTP for resetting your password is ${otp}. It will expire in 15 minutes.`,
    })

    return res.status(200).json({ success: true, message: "OTP sent to your email" })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Reset Password - Updated with password validation
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "Email, OTP, and new password are required" })
  }

  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" })
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" })
    }

    // ✅ Validate new password strength
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Password validation failed",
        errors: passwordValidation.errors,
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    user.resetOtp = ""
    user.resetOtpExpireAt = 0
    await user.save()

    return res.status(200).json({ success: true, message: "Password has been reset successfully" })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
