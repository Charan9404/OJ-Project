"use client";

import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import assets from "../assets/assets";

const Header = () => {
  const { userData } = useContext(AppContext);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 pb-10 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Text Content */}
        <div className="text-center lg:text-left">
          {/* Greeting */}
          <div className="mb-6">
            <span className="inline-block bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              👋 Welcome to the future of coding
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gray-800">Hey </span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {userData ? userData.name : "Developer"}
            </span>
            <span className="text-gray-800">!</span>
            <img
              className="inline-block w-12 md:w-16 lg:w-20 ml-4"
              src={assets.hand_wave || "/placeholder.svg"}
              alt="wave"
            />
          </h1>

          {/* Subheading */}
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-8 text-gray-700">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CodeLabX
            </span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
            Master the art of programming with our comprehensive platform. From
            beginner-friendly tutorials to advanced algorithmic challenges, we
            provide the structure and guidance you need to excel in your coding
            journey.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => scrollToSection("features")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:from-indigo-700 hover:to-purple-700"
            >
              Start Your Journey
            </button>
            <button
              onClick={() => scrollToSection("why-choose")}
              className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-600 hover:text-white transition-all duration-300"
            >
              Explore Features
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>50K+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>1000+ Problems</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>95% Success Rate</span>
            </div>
          </div>
        </div>

        {/* Right Side - Robot and Visual Elements */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            {/* Robot Image with Enhanced Styling */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-2xl scale-110"></div>
              <img
                src={assets.header_img || "/placeholder.svg"}
                alt="CodeLabX mascot"
                className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full shadow-2xl border-8 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-full shadow-lg animate-bounce">
              <span className="text-2xl">🚀</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-teal-500 text-white p-3 rounded-full shadow-lg animate-bounce delay-1000">
              <span className="text-2xl">💡</span>
            </div>
            <div className="absolute top-1/2 -left-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-2 rounded-full shadow-lg animate-pulse">
              <span className="text-xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={() => scrollToSection("stats")}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center hover:border-indigo-500 transition-colors">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Header;
