"use client";

import { useContext, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import assets from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { FaArrowLeft, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import api from "../utils/axios"; // ✅ use shared axios client (base has /api)

const Emailverify = () => {
  const { getUserData, userData, isLoggedin } = useContext(AppContext); // ❌ no backendUrl needed here
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Redirect if already verified
  useEffect(() => {
    if (isLoggedin && userData && userData.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedin, userData, navigate]);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6);
    paste.split("").forEach((char, index) => {
      if (inputRefs.current[index] && /^\d$/.test(char)) {
        inputRefs.current[index].value = char;
        if (index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1].focus();
        }
      }
    });
  };

  const onsubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const otp = inputRefs.current
        .map((ref) => ref.value)
        .join("")
        .trim();
      if (otp.length !== 6) {
        toast.error("Please enter all 6 digits");
        setIsLoading(false);
        return;
      }

      // ✅ path only (no leading slash) — hits /api/auth/verify-account
      const { data } = await api.post("auth/verify-account", { otp });

      if (data.success) {
        toast.success("Email verified successfully! 🎉");
        await getUserData?.();
        navigate("/");
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setResendLoading(true);
    try {
      // ✅ path only — hits /api/auth/send-verify-otp
      const { data } = await api.post("auth/send-verify-otp");
      if (data.success) {
        toast.success("New OTP sent to your email!");
        // Clear existing inputs
        inputRefs.current.forEach((ref) => {
          if (ref) ref.value = "";
        });
        inputRefs.current[0]?.focus();
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[url('/grid.png')] bg-repeat [background-size:20px_20px] opacity-5"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-all duration-300 group z-10"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:block font-medium">Back to Home</span>
      </button>

      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
      >
        <div className="flex items-center gap-3 group">
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

      {/* Main Verification Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-8 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-indigo-200">
              <FaEnvelope className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We've sent a 6-digit verification code to your email address.
              Please enter it below to verify your account.
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={onsubmitHandler} className="space-y-8">
            {/* OTP Input Fields */}
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    required
                    className="w-12 h-12 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl text-gray-800 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-300 hover:border-indigo-300"
                    ref={(el) => (inputRefs.current[index] = el)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onChange={(e) => {
                      // Only allow numbers
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                  />
                ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  <span>Verify Email</span>
                </>
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500">
                  Didn't receive the code?
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={resendOTP}
              disabled={resendLoading}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium transition-colors hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {resendLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <span>Resend Code</span>
              )}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Check your spam folder if you don't see the email. The code expires
            in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Emailverify;
