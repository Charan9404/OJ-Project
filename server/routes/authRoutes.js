import express from "express"
import passport from "../config/passport.js"
import {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
  googleAuthSuccess,
  googleAuthFailure,
} from "../controllers/authController.js" // Fix: Changed from ./controllers to ../controllers
import userAuth from "../middleware/userAuth.js" // Fix: Changed from ./middleware to ../middleware

const authRouter = express.Router()

// Regular auth routes
authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp)
authRouter.post("/verify-account", userAuth, verifyEmail)
authRouter.get("/is-auth", userAuth, isAuthenticated) // Changed from "is-authenticated" to "is-auth"
authRouter.post("/send-reset-otp", sendResetOtp)
authRouter.post("/reset-password", resetPassword)

// ✅ Google OAuth routes
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/google/failure" }),
  googleAuthSuccess,
)

authRouter.get("/google/failure", googleAuthFailure)

export default authRouter
