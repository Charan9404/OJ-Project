"use client";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import { FaArrowLeft } from "react-icons/fa";

const CodeEditorSpecial = () => {
  // ✅ Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a0f2e] to-[#0f0f1a] text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-[80px] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors group"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
              </Link>
              <div className="w-px h-6 bg-white/20"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Code Editor
              </h1>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online Compiler</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Multi-Language Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="relative z-10 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl overflow-hidden">
            <CodeEditor
              showAIReview={true}
              height="calc(100vh - 200px)"
              className="text-white"
            />
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="relative z-10 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              💡 Quick Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                <span>
                  Use the <strong>Custom Input</strong> panel to provide input
                  to your program
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>
                  Click <strong>AI Review</strong> to get intelligent feedback
                  on your code
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>
                  Switch between <strong>Python, C++, and Java</strong>{" "}
                  seamlessly
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorSpecial;
