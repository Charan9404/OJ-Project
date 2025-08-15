"use client";

import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCode,
  FaCheckCircle,
  FaKey,
} from "react-icons/fa";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  // Multi-step state management
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // OTP input refs
  const inputRefs = useRef([]);

  axios.defaults.withCredentials = true;

  // Step 1: Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );

      if (data.success) {
        toast.success("OTP sent to your email! 📧");
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and set new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Get OTP from input fields
    const otpValue = inputRefs.current.map((ref) => ref?.value || "").join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter all 6 digits");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email,
          otp: otpValue,
          newPassword,
        }
      );

      if (data.success) {
        toast.success("Password reset successfully! 🎉");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP input handlers
  const handleOTPInput = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6);
    paste.split("").forEach((char, index) => {
      if (inputRefs.current[index] && /^\d$/.test(char)) {
        inputRefs.current[index].value = char;
        if (index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      }
    });
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );
      if (data.success) {
        toast.success("New OTP sent! 📧");
        // Clear OTP inputs
        inputRefs.current.forEach((ref) => {
          if (ref) ref.value = "";
        });
        inputRefs.current[0]?.focus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex relative overflow-hidden">
      {/* Complex Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.png')] bg-repeat [background-size:40px_40px] opacity-[0.02]"></div>

        {/* Enhanced Animated Gradient Orbs with Purplish Tints */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-300/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-300/25 to-cyan-300/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>

        {/* Additional Purplish Glow Effects */}
        <div className="absolute top-20 right-1/3 w-48 h-48 bg-gradient-to-br from-indigo-200/20 to-purple-300/25 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-gradient-to-tl from-purple-200/15 to-indigo-300/20 rounded-full blur-3xl animate-pulse delay-300"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12 xl:px-16">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="absolute top-8 left-12 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <img
              src={assets.logo || "/placeholder.svg"}
              alt="CodeLabX"
              className="h-10 object-contain"
            />
            <span className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CodeLabX
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-lg">
          <div className="mb-6">
            <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Reset Your
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Password
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {step === 1 &&
                "Enter your email address and we'll send you a verification code."}
              {step === 2 &&
                "Enter the 6-digit code sent to your email and create a new password."}
            </p>
          </div>

          {/* Security Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 shadow-sm shadow-green-200/50">
                <FaKey className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Secure Reset
                </h3>
                <p className="text-gray-600 text-xs">
                  OTP expires in 15 minutes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 shadow-sm shadow-blue-200/50">
                <FaCheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Email Verification
                </h3>
                <p className="text-gray-600 text-xs">
                  Sent to your registered email
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12 relative z-10">
        {/* Mobile Logo */}
        <div
          onClick={() => navigate("/")}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 cursor-pointer lg:hidden"
        >
          <div className="flex items-center gap-3">
            <img
              src={assets.logo || "/placeholder.svg"}
              alt="CodeLabX"
              className="h-8 object-contain"
            />
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CodeLabX
            </span>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/login")}
          className="absolute top-6 left-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-all duration-300 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:block font-medium">Back to Login</span>
        </button>

        {/* Reset Password Card */}
        <div className="w-full max-w-sm">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-2xl p-6 transform transition-all duration-500 hover:shadow-3xl relative overflow-hidden">
            {/* Enhanced Card Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-indigo-50/30 rounded-2xl"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-100/40 to-purple-100/30 rounded-2xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-100/25 to-transparent rounded-2xl"></div>

            <div className="relative z-10">
              {/* Step 1: Email Input */}
              {step === 1 && (
                <>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mb-4 shadow-lg shadow-indigo-500/25">
                      <FaEnvelope className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Reset Password
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Enter your email to receive a verification code
                    </p>
                  </div>

                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-4 w-4 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        placeholder="Enter your email address"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-300 hover:border-indigo-300 hover:bg-white/90 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <FaEnvelope />
                          <span>Send Verification Code</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* Step 2: OTP + New Password */}
              {step === 2 && (
                <>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl mb-4 shadow-lg shadow-green-500/25">
                      <FaCode className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Verify & Reset
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Enter the code sent to <strong>{email}</strong>
                    </p>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    {/* OTP Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Code
                      </label>
                      <div
                        className="flex justify-center gap-2"
                        onPaste={handleOTPPaste}
                      >
                        {Array(6)
                          .fill(0)
                          .map((_, index) => (
                            <input
                              key={index}
                              type="text"
                              maxLength="1"
                              required
                              className="w-10 h-10 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-lg text-gray-800 text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-300 hover:border-indigo-300"
                              ref={(el) => (inputRefs.current[index] = el)}
                              onInput={(e) => handleOTPInput(e, index)}
                              onKeyDown={(e) => handleOTPKeyDown(e, index)}
                              onChange={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                            />
                          ))}
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-4 w-4 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        onChange={(e) => setNewPassword(e.target.value)}
                        value={newPassword}
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        required
                        className="w-full pl-10 pr-10 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-300 hover:border-indigo-300 hover:bg-white/90 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-4 w-4" />
                        ) : (
                          <FaEye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-4 w-4 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        required
                        className="w-full pl-10 pr-10 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-300 hover:border-indigo-300 hover:bg-white/90 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="h-4 w-4" />
                        ) : (
                          <FaEye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Resetting...</span>
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          <span>Reset Password</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Resend OTP */}
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors hover:underline disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Didn't receive the code? Resend
                    </button>
                  </div>
                </>
              )}

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors hover:underline text-sm"
                >
                  Remember your password? Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
