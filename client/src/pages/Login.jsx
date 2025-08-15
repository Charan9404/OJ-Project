"use client";

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaCode,
  FaRocket,
  FaStar,
} from "react-icons/fa";
import GoogleSignInButton from "../components/GoogleSignInButton";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Add these new state variables after the existing ones
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  // Add password validation function
  const validatePasswordRealTime = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("At least 8 characters");
    }

    if (!/[a-zA-Z]/.test(password)) {
      errors.push("At least one letter");
    }

    if (!/\d/.test(password)) {
      errors.push("At least one number");
    }

    return errors;
  };

  // Add password change handler
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (state === "Sign Up") {
      const errors = validatePasswordRealTime(newPassword);
      setPasswordErrors(errors);
      setShowPasswordRequirements(newPassword.length > 0);
    }
  };

  // Update the onsubitHandler to handle detailed password validation errors
  const onsubitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios.defaults.withCredentials = true;

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
          toast.success("Account created successfully!");
        } else {
          // Handle detailed password validation errors
          if (data.errors && data.errors.length > 0) {
            data.errors.forEach((error) => toast.error(error));
          } else {
            toast.error(data.message);
          }
        }
      } else {
        // Login logic remains the same
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
          toast.success("Welcome back!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err));
      } else {
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex relative overflow-hidden">
      {/* Complex Background Pattern */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.png')] bg-repeat [background-size:40px_40px] opacity-[0.02]"></div>

        {/* Enhanced Animated Gradient Orbs with Purplish Tints */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-300/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-300/25 to-cyan-300/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>

        {/* Additional Purplish Glow Effects */}
        <div className="absolute top-20 right-1/3 w-48 h-48 bg-gradient-to-br from-indigo-200/20 to-purple-300/25 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-gradient-to-tl from-purple-200/15 to-indigo-300/20 rounded-full blur-3xl animate-pulse delay-300"></div>

        {/* Floating Elements with Purple Tints */}
        <div className="absolute top-20 right-20 w-3 h-3 bg-indigo-400/40 rounded-full animate-bounce delay-300 shadow-lg shadow-indigo-400/20"></div>
        <div className="absolute top-40 right-40 w-2 h-2 bg-purple-400/50 rounded-full animate-bounce delay-700 shadow-lg shadow-purple-400/30"></div>
        <div className="absolute bottom-32 left-20 w-4 h-4 bg-blue-400/35 rounded-full animate-bounce delay-1000 shadow-lg shadow-blue-400/25"></div>
      </div>

      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12 xl:px-16">
        {/* Logo - ✅ Removed assets.logo, keeping only CodeLabX text */}
        <div
          onClick={() => navigate("/")}
          className="absolute top-8 left-12 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CodeLabX
            </span>
          </div>
        </div>

        {/* Main Content - More Compact */}
        <div className="max-w-lg">
          <div className="mb-6">
            <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {state === "Sign Up" ? (
                <>
                  Start Your
                  <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Coding Journey
                  </span>
                </>
              ) : (
                <>
                  Welcome
                  <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Back, Coder
                  </span>
                </>
              )}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {state === "Sign Up"
                ? "Join thousands of developers mastering algorithms and problem-solving."
                : "Continue building your programming expertise with us."}
            </p>
          </div>

          {/* Compact Feature Highlights */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-300 shadow-sm shadow-indigo-200/50">
                <FaCode className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  1000+ Coding Problems
                </h3>
                <p className="text-gray-600 text-xs">
                  From beginner to expert level
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300 shadow-sm shadow-purple-200/50">
                <FaRocket className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  AI-Powered Learning
                </h3>
                <p className="text-gray-600 text-xs">
                  Intelligent code feedback
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 shadow-sm shadow-green-200/50">
                <FaStar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Track Progress
                </h3>
                <p className="text-gray-600 text-xs">Detailed analytics</p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
              <span className="font-medium">50K+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300 shadow-sm shadow-blue-500/50"></div>
              <span className="font-medium">95% Success</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Compact Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12 relative z-10">
        {/* Mobile Logo - ✅ Also removed assets.logo here */}
        <div
          onClick={() => navigate("/")}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 cursor-pointer lg:hidden"
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CodeLabX
            </span>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-all duration-300 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* Compact Auth Card */}
        <div className="w-full max-w-sm">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-2xl p-6 transform transition-all duration-500 hover:shadow-3xl relative overflow-hidden">
            {/* Enhanced Card Background with Purplish Tints */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-indigo-50/30 rounded-2xl"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-100/40 to-purple-100/30 rounded-2xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-100/25 to-transparent rounded-2xl"></div>

            <div className="relative z-10">
              {/* Compact Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mb-4 shadow-lg shadow-indigo-500/25">
                  <FaCode className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {state === "Sign Up" ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-gray-600 text-sm">
                  {state === "Sign Up"
                    ? "Join the community of passionate developers"
                    : "Continue your coding journey"}
                </p>
              </div>

              {/* Compact Form */}
              <form onSubmit={onsubitHandler} className="space-y-4">
                {/* Full Name - Only for Sign Up */}
                {state === "Sign Up" && (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-4 w-4 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      type="text"
                      placeholder="Full Name"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-300 hover:border-indigo-300 hover:bg-white/90 text-sm"
                    />
                  </div>
                )}

                {/* Email */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-4 w-4 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-300 hover:border-indigo-300 hover:bg-white/90 text-sm"
                  />
                </div>

                {/* Password */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    onChange={handlePasswordChange}
                    value={password}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    className={`w-full pl-10 pr-10 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-300 hover:border-indigo-300 hover:bg-white/90 text-sm ${
                      state === "Sign Up" && passwordErrors.length > 0
                        ? "border-red-300"
                        : "border-gray-200/80"
                    }`}
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

                {/* Password Requirements - Show only for Sign Up */}
                {state === "Sign Up" && showPasswordRequirements && (
                  <div className="mt-2 p-3 bg-gray-50/80 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Password Requirements:
                    </p>
                    <div className="space-y-1">
                      <div
                        className={`flex items-center gap-2 text-xs ${
                          password.length >= 8
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            password.length >= 8 ? "bg-green-500" : "bg-red-400"
                          }`}
                        ></div>
                        <span>At least 8 characters</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 text-xs ${
                          /[a-zA-Z]/.test(password)
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            /[a-zA-Z]/.test(password)
                              ? "bg-green-500"
                              : "bg-red-400"
                          }`}
                        ></div>
                        <span>At least one letter</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 text-xs ${
                          /\d/.test(password)
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            /\d/.test(password) ? "bg-green-500" : "bg-red-400"
                          }`}
                        ></div>
                        <span>At least one number</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Forgot Password - Only for Login */}
                {state === "Login" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => navigate("/reset-password")}
                      className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors hover:underline font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>
                        {state === "Sign Up" ? "Creating..." : "Signing In..."}
                      </span>
                    </>
                  ) : (
                    <span>
                      {state === "Sign Up" ? "Create Account" : "Sign In"}
                    </span>
                  )}
                </button>
              </form>

              {/* Compact Divider */}
              <div className="my-5">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white/80 text-gray-500 font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>
              </div>

              {/* Google Sign In */}
              <GoogleSignInButton
                isLoading={googleLoading}
                setIsLoading={setGoogleLoading}
              />

              {/* Toggle Login/Signup */}
              <div className="mt-5 text-center">
                <p className="text-gray-600 text-xs mb-1">
                  {state === "Sign Up"
                    ? "Already have an account?"
                    : "Don't have an account?"}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setState(state === "Sign Up" ? "Login" : "Sign Up")
                  }
                  className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors hover:underline text-sm"
                >
                  {state === "Sign Up"
                    ? "Sign In Instead"
                    : "Create New Account"}
                </button>
              </div>
            </div>
          </div>

          {/* Compact Terms */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs leading-relaxed">
              By {state === "Sign Up" ? "creating an account" : "signing in"},
              you agree to our{" "}
              <a
                href="#"
                className="text-indigo-600 hover:text-indigo-800 transition-colors font-semibold"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-indigo-600 hover:text-indigo-800 transition-colors font-semibold"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
