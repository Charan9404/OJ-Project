"use client";

import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import api from "../utils/axios";
import { FaBrain, FaSignOutAlt, FaEnvelope, FaHome } from "react-icons/fa";
import { MdOutlineHistoryEdu, MdVerified } from "react-icons/md";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, setIsLoggedin, setUserData } = useContext(AppContext);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowNavbar(currentY < lastScrollY || currentY < 10);
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const sendVerificationOtp = async () => {
    try {
      const { data } = await api.post("/api/auth/send-verify-otp");
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
    setIsDropdownOpen(false);
  };

  const logout = async () => {
    try {
      const { data } = await api.post("/api/auth/logout");
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate("/");
        toast.success("Logged out successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
    setIsDropdownOpen(false);
  };

  const isHome = location.pathname === "/";
  const isDarkTheme =
    location.pathname === "/problems" ||
    location.pathname === "/submissions" ||
    location.pathname === "/codeeditor-special" ||
    location.pathname.includes("/problems/");

  const getNavbarClasses = () => {
    const baseClasses = `w-full flex justify-between items-center px-6 sm:px-10 py-4 transition-all duration-500 z-50 fixed top-0 left-0 ${
      showNavbar ? "translate-y-0" : "-translate-y-full"
    }`;

    if (isHome) {
      return `${baseClasses} bg-white/95 backdrop-blur-xl text-gray-800 shadow-lg border-b border-gray-200/50`;
    } else if (isDarkTheme) {
      return `${baseClasses} !bg-[#0f0f1a] !bg-opacity-90 backdrop-blur-xl text-white border-b border-white/10 shadow-2xl`;
    } else {
      return `${baseClasses} bg-white/90 backdrop-blur-xl text-gray-800 shadow-lg border-b border-gray-200/30`;
    }
  };

  const Logo = () => (
    <div
      className="flex items-center gap-3 cursor-pointer group transition-all duration-300 hover:scale-105"
      onClick={() => navigate("/")}
    >
      <div className="relative" />
      <span
        className={`font-bold text-xl transition-all duration-300 ${
          isDarkTheme
            ? "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            : "text-gray-800 hover:text-indigo-600"
        }`}
      >
        CodeLabX
      </span>
    </div>
  );

  const NavLinks = () => {
    if (!userData) return null;

    const getLinkClasses = (isActive) => {
      const baseClasses =
        "flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition-all duration-300 relative overflow-hidden";

      if (isDarkTheme) {
        return `${baseClasses} ${
          isActive
            ? "!text-white !bg-gradient-to-r !from-indigo-500/30 !to-purple-500/30 border border-indigo-500/50 shadow-lg shadow-indigo-500/20"
            : "!text-gray-300 hover:!text-white hover:!bg-white/10 hover:backdrop-blur-sm"
        }`;
      } else {
        return `${baseClasses} ${
          isActive
            ? "text-indigo-600 bg-indigo-50 border border-indigo-200"
            : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
        }`;
      }
    };

    return (
      <div className="flex items-center gap-2">
        <NavLink
          to="/problems"
          className={({ isActive }) => getLinkClasses(isActive)}
        >
          <FaBrain className="text-lg" />
          <span className="hidden sm:block">Problems</span>
        </NavLink>

        <NavLink
          to="/submissions"
          className={({ isActive }) => getLinkClasses(isActive)}
        >
          <MdOutlineHistoryEdu className="text-xl" />
          <span className="hidden sm:block">Submissions</span>
        </NavLink>
      </div>
    );
  };

  const UserDropdown = () => {
    if (!userData) {
      return (
        <button
          onClick={() => navigate("/login")}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all duration-300 ${
            isDarkTheme
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-indigo-500/25"
              : "border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          <span>Login</span>
          <img
            src={assets.arrow_icon || "/placeholder.svg"}
            alt="→"
            className="w-4 h-4 object-contain"
          />
        </button>
      );
    }

    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-10 h-10 flex justify-center items-center rounded-full cursor-pointer transition-all duration-300 relative overflow-hidden ${
            isDarkTheme
              ? "!bg-gradient-to-r !from-indigo-500/20 !to-purple-500/20 border border-indigo-500/30 !text-white hover:!from-indigo-500/30 hover:!to-purple-500/30 shadow-lg shadow-indigo-500/20"
              : "bg-gray-100 border-2 border-gray-200 text-gray-800 hover:border-indigo-300 hover:bg-indigo-50"
          }`}
        >
          <span className="font-semibold text-lg">
            {userData.name[0].toUpperCase()}
          </span>
          {userData.isAccountVerified && (
            <div className="absolute -top-1 -right-1">
              <MdVerified className="text-green-400 text-sm bg-white rounded-full" />
            </div>
          )}
        </button>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            ></div>

            <div
              className={`absolute right-0 top-12 z-20 min-w-[200px] rounded-xl shadow-2xl border transition-all duration-300 ${
                isDarkTheme
                  ? "!bg-[#0f0f1a] !bg-opacity-95 backdrop-blur-xl border-white/10 !text-white"
                  : "bg-white/95 backdrop-blur-xl border-gray-200 text-gray-800"
              }`}
            >
              <div className="p-2">
                <div
                  className={`px-4 py-3 border-b ${
                    isDarkTheme ? "border-white/10" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        isDarkTheme
                          ? "bg-indigo-500/20 text-indigo-300"
                          : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      {userData.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{userData.name}</p>
                      <p
                        className={`text-xs ${
                          isDarkTheme ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {userData.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  {!userData.isAccountVerified && (
                    <button
                      onClick={sendVerificationOtp}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors ${
                        isDarkTheme
                          ? "hover:bg-white/10 text-yellow-400"
                          : "hover:bg-gray-100 text-yellow-600"
                      }`}
                    >
                      <FaEnvelope />
                      Verify Email
                    </button>
                  )}

                  <button
                    onClick={() => {
                      navigate("/");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors ${
                      isDarkTheme
                        ? "hover:bg-white/10 !text-gray-300"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <FaHome />
                    Home
                  </button>

                  <button
                    onClick={logout}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors ${
                      isDarkTheme
                        ? "hover:bg-red-500/20 text-red-400"
                        : "hover:bg-red-50 text-red-600"
                    }`}
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <nav className={getNavbarClasses()}>
        <Logo />
        <NavLinks />
        <UserDropdown />
      </nav>
    </>
  );
};

export default Navbar;
