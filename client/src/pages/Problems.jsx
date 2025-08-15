"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { BiTime } from "react-icons/bi";
import { checkAuth } from "../utils/authUtils";
import { toast } from "react-toastify";

const Problems = () => {
  const [selectedTopic, setSelectedTopic] = useState("Algorithms");
  const [allProblems, setAllProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuthAndFetchProblems = async () => {
      try {
        // Check authentication first
        const authStatus = await checkAuth();
        if (!authStatus) {
          toast.error("Please login to access problems");
          navigate("/login");
          return;
        }

        setIsAuthenticated(true);

        // Fetch problems if authenticated
        const { data } = await axios.get("/api/problems", {
          withCredentials: true,
        });
        console.log("🧪 All Problems from API:", data);
        setAllProblems(data);
      } catch (err) {
        console.error("Error:", err);
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        } else {
          toast.error("Failed to load problems");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuthAndFetchProblems();
  }, [navigate]);

  const filteredProblems = allProblems.filter((problem) =>
    problem.tags?.includes(selectedTopic)
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-medium";
      case "Medium":
        return "text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-medium";
      case "Hard":
        return "text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-xs font-medium";
      default:
        return "text-gray-400 bg-gray-500/10 border border-gray-500/20 px-3 py-1 rounded-full text-xs font-medium";
    }
  };

  if (!isAuthenticated && !loading) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a0f2e] to-[#0f0f1a] text-white relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Sidebar
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
      />

      <div className="ml-64 pt-[80px] px-8 pb-8 h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {selectedTopic} Problems
          </h1>
          {isAuthenticated && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-medium">
              ✅ Authenticated User
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center text-indigo-300 text-lg flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mb-4"></div>
            Loading Problems...
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-gray-400 text-center text-lg h-[calc(100vh-200px)] flex items-center justify-center">
            No problems found for this topic.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProblems.map((problem) => (
              <Link to={`/problems/${problem._id}`} key={problem._id}>
                <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/10 hover:border-indigo-500/50 hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent mb-3">
                    {problem.title}
                  </h2>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-300">
                      Difficulty:{" "}
                      <span className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <BiTime className="w-4 h-4" />
                      <span>~30 min</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;
