"use client";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { checkAuth } from "../utils/authUtils";
import { toast } from "react-toastify";
import {
  FaCode,
  FaBrain,
  FaHistory,
  FaRocket,
  FaUsers,
  FaTrophy,
  FaChartLine,
  FaLightbulb,
  FaGraduationCap,
  FaStar,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

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

  // Handle protected route navigation
  const handleProtectedNavigation = async (route) => {
    setIsCheckingAuth(true);
    try {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        navigate(route);
      } else {
        toast.error("Please login to access problems and submissions");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Authentication check failed. Please login.");
      navigate("/login");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Removed min-h-screen to allow natural scrolling */}
      <Navbar />
      <Header />

      {/* Stats Section */}
      <section
        id="stats"
        className="py-16 px-6 sm:px-10 bg-white/70 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform">
                1000+
              </div>
              <div className="text-gray-600 font-medium">Problems Solved</div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                50K+
              </div>
              <div className="text-gray-600 font-medium">Active Users</div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform">
                95%
              </div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                24/7
              </div>
              <div className="text-gray-600 font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section
        id="features"
        className="py-20 px-6 sm:px-10 bg-gradient-to-r from-indigo-50 to-purple-50"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Start Your Coding Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose your path and begin mastering the art of programming with
              our comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Option 1: Compile Something - PUBLIC ACCESS */}
            <Link to="/codeeditor-special" className="group">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 transform hover:-translate-y-3 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <div className="p-6 rounded-full bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-600 mb-6 group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  <FaCode className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-indigo-600 transition-colors">
                  Compile & Run
                </h3>
                <p className="text-gray-600 leading-relaxed text-center mb-6">
                  Test your code snippets instantly in our powerful online
                  editor with real-time compilation and execution.
                </p>
                <div className="flex items-center text-indigo-600 font-semibold group-hover:text-purple-600 transition-colors">
                  <span>Try Now</span>
                  <FaRocket className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Free
                </div>
              </div>
            </Link>

            {/* Option 2: Explore Problems - REQUIRES LOGIN */}
            <div
              onClick={() => handleProtectedNavigation("/problems")}
              className="group cursor-pointer"
            >
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl hover:border-purple-200 transition-all duration-500 transform hover:-translate-y-3 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <div className="p-6 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 text-purple-600 mb-6 group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  <FaBrain className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-purple-600 transition-colors">
                  Solve Problems
                </h3>
                <p className="text-gray-600 leading-relaxed text-center mb-6">
                  Challenge yourself with thousands of coding problems across
                  various topics and difficulty levels.
                </p>
                <div className="flex items-center text-purple-600 font-semibold group-hover:text-pink-600 transition-colors">
                  <span>{isCheckingAuth ? "Checking..." : "Explore"}</span>
                  <FaLightbulb className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Login Required
                </div>
              </div>
            </div>

            {/* Option 3: View Submissions - REQUIRES LOGIN */}
            <div
              onClick={() => handleProtectedNavigation("/submissions")}
              className="group cursor-pointer"
            >
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl hover:border-green-200 transition-all duration-500 transform hover:-translate-y-3 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-500"></div>
                <div className="p-6 rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-600 mb-6 group-hover:from-green-500 group-hover:to-teal-500 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  <FaHistory className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-green-600 transition-colors">
                  Track Progress
                </h3>
                <p className="text-gray-600 leading-relaxed text-center mb-6">
                  Monitor your coding journey with detailed submission history
                  and performance analytics.
                </p>
                <div className="flex items-center text-green-600 font-semibold group-hover:text-teal-600 transition-colors">
                  <span>{isCheckingAuth ? "Checking..." : "View Stats"}</span>
                  <FaChartLine className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Login Required
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="why-choose" className="py-20 px-6 sm:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Why Choose CodeLabX?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to excel in your programming journey, all in
              one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FaGraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Learn by Doing
              </h3>
              <p className="text-gray-600">
                Practice with real coding challenges and build your skills
                through hands-on experience.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FaUsers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Community Driven
              </h3>
              <p className="text-gray-600">
                Join thousands of developers sharing knowledge and helping each
                other grow.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FaTrophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Track Progress
              </h3>
              <p className="text-gray-600">
                Monitor your improvement with detailed analytics and achievement
                badges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-20 px-6 sm:px-10 bg-gradient-to-r from-gray-50 to-blue-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              User Ratings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  A
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Alex Chen</div>
                  <div className="text-gray-500 text-sm">
                    Software Engineer at Google
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  S
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    Sarah Johnson
                  </div>
                  <div className="text-gray-500 text-sm">
                    Full Stack Developer
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  M
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    Mike Rodriguez
                  </div>
                  <div className="text-gray-500 text-sm">CS Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        className="py-20 px-6 sm:px-10 bg-gradient-to-r from-indigo-600 to-purple-600"
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Level Up Your Coding Skills?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who are already improving their
            programming skills with CodeLabX
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection("features")}
              className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Coding Now
            </button>
            <button
              onClick={() => scrollToSection("why-choose")}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Use the new Footer component */}
      <Footer />
    </div>
  );
};

export default Home;
