"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import {
  FaRobot,
  FaPlay,
  FaPaperPlane,
  FaTimes,
  FaCode,
  FaLightbulb,
  FaInfoCircle,
} from "react-icons/fa";
import { BiTime, BiTrendingUp } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi";
import ReactMarkdown from "react-markdown";

const ProblemDetail = () => {
  const [showAI, setShowAI] = useState(false);
  const [aiResponse, setAIResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python");
  const [customInput, setCustomInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // ✅ Correct API URLs for microservices architecture
  const MAIN_API_URL = "http://localhost:4000"; // Main backend (auth, problems, submissions)
  const COMPILER_API_URL = "http://localhost:5001"; // Compiler microservice (run, ai-review)

  // 🎨 Professional VS Code-like Monaco themes (Light & Dark)
  useEffect(() => {
    // Dark Theme (VS Code Dark+)
    monaco.editor.defineTheme("vscode-dark-professional", {
      base: "vs-dark",
      inherit: true,
      rules: [
        // Keywords (if, for, while, def, class, etc.)
        { token: "keyword", foreground: "569cd6", fontStyle: "bold" },
        { token: "keyword.control", foreground: "c586c0", fontStyle: "bold" },
        { token: "keyword.operator", foreground: "569cd6" },

        // Strings
        { token: "string", foreground: "ce9178", fontStyle: "italic" },
        { token: "string.escape", foreground: "d7ba7d" },

        // Numbers
        { token: "number", foreground: "b5cea8" },
        { token: "number.hex", foreground: "b5cea8" },
        { token: "number.float", foreground: "b5cea8" },

        // Comments
        { token: "comment", foreground: "6a9955", fontStyle: "italic" },
        { token: "comment.block", foreground: "6a9955", fontStyle: "italic" },
        { token: "comment.line", foreground: "6a9955", fontStyle: "italic" },

        // Variables and identifiers
        { token: "variable", foreground: "9cdcfe" },
        { token: "variable.parameter", foreground: "9cdcfe" },
        { token: "identifier", foreground: "d4d4d4" },

        // Functions
        { token: "function", foreground: "dcdcaa", fontStyle: "bold" },
        { token: "function.call", foreground: "dcdcaa" },

        // Types and classes
        { token: "type", foreground: "4ec9b0", fontStyle: "bold" },
        { token: "type.identifier", foreground: "4ec9b0" },
        { token: "class", foreground: "4ec9b0", fontStyle: "bold" },

        // Operators
        { token: "operator", foreground: "d4d4d4" },
        { token: "delimiter", foreground: "d4d4d4" },

        // Special tokens
        { token: "tag", foreground: "569cd6" },
        { token: "attribute.name", foreground: "92c5f8" },
        { token: "attribute.value", foreground: "ce9178" },

        // Python specific
        { token: "decorator", foreground: "dcdcaa" },
        { token: "support.function", foreground: "dcdcaa" },

        // C++ specific
        { token: "keyword.directive", foreground: "c586c0" },
        { token: "support.type", foreground: "4ec9b0" },

        // Java specific
        { token: "storage.modifier", foreground: "569cd6" },
        { token: "storage.type", foreground: "569cd6" },
      ],
      colors: {
        // Editor background and foreground
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",

        // Line highlighting
        "editor.lineHighlightBackground": "#2d2d30",
        "editor.lineHighlightBorder": "#00000000",

        // Selection
        "editor.selectionBackground": "#264f78",
        "editor.selectionHighlightBackground": "#add6ff26",
        "editor.inactiveSelectionBackground": "#3a3d41",

        // Find/search
        "editor.findMatchBackground": "#515c6a",
        "editor.findMatchHighlightBackground": "#ea5c0055",
        "editor.findRangeHighlightBackground": "#3a3d4166",

        // Word highlighting
        "editor.wordHighlightBackground": "#575757b8",
        "editor.wordHighlightStrongBackground": "#004972b8",

        // Line numbers
        "editorLineNumber.foreground": "#858585",
        "editorLineNumber.activeForeground": "#c6c6c6",

        // Cursor
        "editorCursor.foreground": "#aeafad",

        // Indentation guides
        "editorIndentGuide.background": "#404040",
        "editorIndentGuide.activeBackground": "#707070",

        // Gutter (line number area)
        "editorGutter.background": "#1e1e1e",
        "editorGutter.modifiedBackground": "#1b81a8",
        "editorGutter.addedBackground": "#487e02",
        "editorGutter.deletedBackground": "#f85149",

        // Scrollbars
        "scrollbar.shadow": "#000000",
        "scrollbarSlider.background": "#79797966",
        "scrollbarSlider.hoverBackground": "#646464b3",
        "scrollbarSlider.activeBackground": "#bfbfbf66",

        // Brackets
        "editorBracketMatch.background": "#0064001a",
        "editorBracketMatch.border": "#888888",

        // Hover
        "editorHoverWidget.background": "#252526",
        "editorHoverWidget.border": "#454545",

        // Suggest widget (autocomplete)
        "editorSuggestWidget.background": "#252526",
        "editorSuggestWidget.border": "#454545",
        "editorSuggestWidget.selectedBackground": "#094771",

        // Error/warning squiggles
        "editorError.foreground": "#f85149",
        "editorWarning.foreground": "#ff8c00",
        "editorInfo.foreground": "#75beff",

        // Minimap
        "minimap.background": "#1e1e1e",
        "minimap.selectionHighlight": "#264f78",
        "minimap.errorHighlight": "#f85149",
        "minimap.warningHighlight": "#ff8c00",
      },
    });

    // Light Theme (VS Code Light+)
    monaco.editor.defineTheme("vscode-light-professional", {
      base: "vs",
      inherit: true,
      rules: [
        // Keywords (if, for, while, def, class, etc.)
        { token: "keyword", foreground: "0000ff", fontStyle: "bold" },
        { token: "keyword.control", foreground: "af00db", fontStyle: "bold" },
        { token: "keyword.operator", foreground: "0000ff" },

        // Strings
        { token: "string", foreground: "a31515", fontStyle: "italic" },
        { token: "string.escape", foreground: "ff0000" },

        // Numbers
        { token: "number", foreground: "098658" },
        { token: "number.hex", foreground: "098658" },
        { token: "number.float", foreground: "098658" },

        // Comments
        { token: "comment", foreground: "008000", fontStyle: "italic" },
        { token: "comment.block", foreground: "008000", fontStyle: "italic" },
        { token: "comment.line", foreground: "008000", fontStyle: "italic" },

        // Variables and identifiers
        { token: "variable", foreground: "001080" },
        { token: "variable.parameter", foreground: "001080" },
        { token: "identifier", foreground: "000000" },

        // Functions
        { token: "function", foreground: "795e26", fontStyle: "bold" },
        { token: "function.call", foreground: "795e26" },

        // Types and classes
        { token: "type", foreground: "267f99", fontStyle: "bold" },
        { token: "type.identifier", foreground: "267f99" },
        { token: "class", foreground: "267f99", fontStyle: "bold" },

        // Operators
        { token: "operator", foreground: "000000" },
        { token: "delimiter", foreground: "000000" },

        // Special tokens
        { token: "tag", foreground: "800000" },
        { token: "attribute.name", foreground: "ff0000" },
        { token: "attribute.value", foreground: "0451a5" },

        // Python specific
        { token: "decorator", foreground: "795e26" },
        { token: "support.function", foreground: "795e26" },

        // C++ specific
        { token: "keyword.directive", foreground: "af00db" },
        { token: "support.type", foreground: "267f99" },

        // Java specific
        { token: "storage.modifier", foreground: "0000ff" },
        { token: "storage.type", foreground: "0000ff" },
      ],
      colors: {
        // Editor background and foreground
        "editor.background": "#ffffff",
        "editor.foreground": "#000000",

        // Line highlighting
        "editor.lineHighlightBackground": "#f0f0f0",
        "editor.lineHighlightBorder": "#00000000",

        // Selection
        "editor.selectionBackground": "#add6ff",
        "editor.selectionHighlightBackground": "#add6ff4d",
        "editor.inactiveSelectionBackground": "#e5ebf1",

        // Find/search
        "editor.findMatchBackground": "#a8ac94",
        "editor.findMatchHighlightBackground": "#ea5c0055",
        "editor.findRangeHighlightBackground": "#b4b4b44d",

        // Word highlighting
        "editor.wordHighlightBackground": "#57575740",
        "editor.wordHighlightStrongBackground": "#004972b8",

        // Line numbers
        "editorLineNumber.foreground": "#237893",
        "editorLineNumber.activeForeground": "#0b216f",

        // Cursor
        "editorCursor.foreground": "#000000",

        // Indentation guides
        "editorIndentGuide.background": "#d3d3d3",
        "editorIndentGuide.activeBackground": "#939393",

        // Gutter (line number area)
        "editorGutter.background": "#ffffff",
        "editorGutter.modifiedBackground": "#1b81a8",
        "editorGutter.addedBackground": "#487e02",
        "editorGutter.deletedBackground": "#f85149",

        // Scrollbars
        "scrollbar.shadow": "#dddddd",
        "scrollbarSlider.background": "#79797966",
        "scrollbarSlider.hoverBackground": "#646464b3",
        "scrollbarSlider.activeBackground": "#00000066",

        // Brackets
        "editorBracketMatch.background": "#0064001a",
        "editorBracketMatch.border": "#b9b9b9",

        // Hover
        "editorHoverWidget.background": "#f3f3f3",
        "editorHoverWidget.border": "#c8c8c8",

        // Suggest widget (autocomplete)
        "editorSuggestWidget.background": "#f3f3f3",
        "editorSuggestWidget.border": "#c8c8c8",
        "editorSuggestWidget.selectedBackground": "#0060c0",

        // Error/warning squiggles
        "editorError.foreground": "#e51400",
        "editorWarning.foreground": "#bf8803",
        "editorInfo.foreground": "#1a85ff",

        // Minimap
        "minimap.background": "#ffffff",
        "minimap.selectionHighlight": "#add6ff",
        "minimap.errorHighlight": "#e51400",
        "minimap.warningHighlight": "#bf8803",
      },
    });
  }, []);

  // Update Monaco theme when isDarkTheme changes
  useEffect(() => {
    if (window.monacoEditorInstance && window.monacoInstance) {
      const newTheme = isDarkTheme
        ? "vscode-dark-professional"
        : "vscode-light-professional";
      window.monacoInstance.editor.setTheme(newTheme);
    }
  }, [isDarkTheme]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axios.get(`${MAIN_API_URL}/api/problems/${id}`);
        setProblem(data);

        // Set professional starter code based on language
        const starterCodes = {
          python: `# Read input
n = int(input())

# Your solution here
def solve():
    pass

# Call your solution
solve()`,

          cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Read input
    int n;
    cin >> n;
    
    // Your solution here
    
    return 0;
}`,

          java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Read input
        int n = sc.nextInt();
        
        // Your solution here
        
        sc.close();
    }
}`,
        };

        setUserCode(starterCodes[language] || starterCodes.python);

        // Set default custom input based on first example
        if (data.examples && data.examples.length > 0) {
          const firstExample = data.examples[0];
          if (firstExample.input) {
            const exampleInput = firstExample.input;
            if (
              exampleInput.includes("nums = [") &&
              exampleInput.includes("target =")
            ) {
              const numsMatch = exampleInput.match(/nums = \[([^\]]+)\]/);
              const targetMatch = exampleInput.match(/target = (\d+)/);
              if (numsMatch && targetMatch) {
                const nums = numsMatch[1].split(",").map((n) => n.trim());
                const target = targetMatch[1];
                setCustomInput(`${nums.length}\n${nums.join(" ")}\n${target}`);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id, language]);

  const handleAIReview = async () => {
    if (!userCode.trim()) {
      alert("Please write some code first.");
      return;
    }
    setAiLoading(true);
    setAIResponse("🤖 Analyzing your code...");

    try {
      const res = await axios.post(`${COMPILER_API_URL}/ai-review`, {
        code: userCode,
        language,
      });
      setAIResponse(res.data?.aiReview || "// No feedback found.");
    } catch (err) {
      console.error(err);
      setAIResponse("❌ Error fetching AI review.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleRun = async () => {
    if (!userCode.trim()) {
      setOutput("⚠️ Please enter some code before running.");
      return;
    }

    setIsRunning(true);
    try {
      setOutput("🚀 Executing your code...");
      const { data } = await axios.post(`${COMPILER_API_URL}/run`, {
        language,
        code: userCode,
        input: customInput,
      });

      const finalOutput =
        typeof data.output === "object" && data.output.output
          ? data.output.output
          : data.output || "⚠️ No output returned.";
      setOutput(finalOutput);
    } catch (err) {
      console.error("Run error:", err);
      const errorMsg =
        err.response?.data?.error || "❌ Error during execution.";
      setOutput(errorMsg);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!userCode.trim()) {
      setOutput("⚠️ Please enter some code before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      setOutput("📤 Submitting your solution...");

      const submissionResponse = await axios.post(
        `${MAIN_API_URL}/api/submissions`,
        {
          problemId: problem._id,
          problemTitle: problem.title,
          language,
          code: userCode,
        },
        {
          withCredentials: true,
        }
      );

      const submissionId = submissionResponse.data.submission._id;
      setOutput("⚖️ Judging your solution...");

      const judgeResponse = await axios.post(
        `${MAIN_API_URL}/api/submissions/${submissionId}/judge`,
        {},
        {
          withCredentials: true,
        }
      );

      const result = judgeResponse.data.result;

      if (result.status === "SUCCESS") {
        setOutput(`🎉 Accepted! 
✅ All ${result.total} test cases passed
⏱️ Execution Time: ${result.executionTime}
💾 Memory Usage: ${result.memoryUsage}`);
      } else if (result.status === "WRONG_ANSWER") {
        setOutput(`❌ Wrong Answer
📊 Passed: ${result.passed}/${result.total} test cases
❗ ${result.detail}`);
      } else if (result.status === "COMPILE_ERROR") {
        setOutput(`🔨 Compilation Error:
${result.detail}`);
      } else if (result.status === "RUNTIME_ERROR") {
        setOutput(`💥 Runtime Error:
${result.detail}`);
      } else if (result.status === "TIME_LIMIT") {
        setOutput(`⏰ Time Limit Exceeded
Your solution took too long to execute.`);
      } else {
        setOutput(`❓ ${result.status}: ${result.detail}`);
      }
    } catch (err) {
      console.error("Submit failed:", err);
      const errorMsg =
        err.response?.data?.error || err.message || "Submission failed";
      setOutput(`❌ Submission Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0f0f1a] via-[#1a0f2e] to-[#0f0f1a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-indigo-300 text-lg">Loading Problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0f0f1a] via-[#1a0f2e] to-[#0f0f1a]">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <p className="text-red-400 text-xl">Problem not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a0f2e] to-[#0f0f1a] text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main content area */}
      <div className="pt-[80px] flex h-[calc(100vh-80px)]">
        {/* LEFT PANEL - Problem Description */}
        <div className="w-1/2 flex flex-col flex-1">
          <div className="m-4 flex-1 bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl overflow-hidden">
            <div className="p-6 h-full overflow-y-auto">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {problem.title}
                  </h1>
                  <span className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <BiTime className="w-4 h-4" />
                    <span>30 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BiTrendingUp className="w-4 h-4" />
                    <span>85% Success Rate</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-400" />
                  Description
                </h3>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {problem.description}
                  </p>
                </div>
              </div>

              {/* Input/Output Format */}
              {(problem.inputFormat || problem.outputFormat) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-400" />
                    Input/Output Format
                  </h3>
                  <div className="space-y-3">
                    {problem.inputFormat && (
                      <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                        <h4 className="text-blue-300 font-semibold mb-2">
                          Input Format:
                        </h4>
                        <p className="text-gray-300 text-sm font-mono whitespace-pre-line">
                          {problem.inputFormat}
                        </p>
                      </div>
                    )}
                    {problem.outputFormat && (
                      <div className="bg-green-500/10 backdrop-blur-sm rounded-lg p-4 border border-green-500/20">
                        <h4 className="text-green-300 font-semibold mb-2">
                          Output Format:
                        </h4>
                        <p className="text-gray-300 text-sm font-mono whitespace-pre-line">
                          {problem.outputFormat}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Examples */}
              {problem.examples?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <HiSparkles className="text-purple-400" />
                    Examples
                  </h3>
                  <div className="space-y-4">
                    {problem.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg p-4 border border-indigo-500/20"
                      >
                        <div className="font-mono text-sm">
                          <div className="mb-2">
                            <span className="text-indigo-400 font-semibold">
                              Input:
                            </span>
                            <span className="text-gray-300 ml-2">
                              {ex.input}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="text-purple-400 font-semibold">
                              Output:
                            </span>
                            <span className="text-gray-300 ml-2">
                              {ex.output}
                            </span>
                          </div>
                          {ex.explanation && (
                            <div>
                              <span className="text-yellow-400 font-semibold">
                                Explanation:
                              </span>
                              <span className="text-gray-300 ml-2">
                                {ex.explanation}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Constraints */}
              {problem.constraints?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Constraints
                  </h3>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <ul className="text-gray-300 space-y-1">
                      {problem.constraints.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-indigo-400 mt-1">•</span>
                          <span className="font-mono text-sm">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 transition-colors px-3 py-1 rounded-full text-xs font-medium cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Custom Input
                </h3>
                <textarea
                  placeholder="Enter your test input here..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full bg-black/30 backdrop-blur-sm text-white text-sm p-4 rounded-lg border border-indigo-400/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all placeholder-gray-500 resize-none font-mono"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Code Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="m-4 flex-1 bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl overflow-hidden flex flex-col">
            {/* Editor Header */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border-b border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaCode className="text-indigo-400" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-black/50 backdrop-blur-sm border border-indigo-400/30 text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                  </select>

                  {/* Theme Toggle Button */}
                  <button
                    onClick={toggleTheme}
                    className="bg-black/50 backdrop-blur-sm border border-indigo-400/30 text-white p-2 rounded-lg hover:bg-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all group"
                    title={
                      isDarkTheme
                        ? "Switch to Light Theme"
                        : "Switch to Dark Theme"
                    }
                  >
                    {isDarkTheme ? (
                      <svg
                        className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleRun}
                    disabled={isRunning}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isRunning ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Running...
                      </>
                    ) : (
                      <>
                        <FaPlay />
                        Run
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Submit
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                language={language === "cpp" ? "cpp" : language}
                value={userCode}
                onChange={(value) => setUserCode(value || "")}
                theme={
                  isDarkTheme
                    ? "vscode-dark-professional"
                    : "vscode-light-professional"
                }
                onMount={(editor, monaco) => {
                  // Set the initial theme
                  monaco.editor.setTheme(
                    isDarkTheme
                      ? "vscode-dark-professional"
                      : "vscode-light-professional"
                  );

                  // Add custom keybindings like VS Code
                  editor.addCommand(
                    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                    () => {
                      console.log("Save triggered");
                    }
                  );

                  // Enable bracket pair colorization
                  editor.updateOptions({
                    bracketPairColorization: { enabled: true },
                  });

                  // Store editor instance for theme updates
                  window.monacoEditorInstance = editor;
                  window.monacoInstance = monaco;
                }}
                options={{
                  // Font and appearance
                  fontSize: 15,
                  fontFamily:
                    "'Fira Code', 'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
                  fontLigatures: true,
                  fontWeight: "400",
                  letterSpacing: 0.5,
                  lineHeight: 1.6,

                  // Editor behavior
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorSmoothCaretAnimation: "on",
                  cursorBlinking: "smooth",
                  cursorStyle: "line",
                  cursorWidth: 2,

                  // Line numbers and folding
                  lineNumbers: "on",
                  lineNumbersMinChars: 3,
                  glyphMargin: true,
                  folding: true,
                  foldingStrategy: "indentation",
                  showFoldingControls: "mouseover",

                  // Indentation and formatting
                  tabSize: 4,
                  insertSpaces: true,
                  detectIndentation: true,
                  trimAutoWhitespace: true,
                  autoIndent: "full",

                  // Selection and highlighting
                  selectionHighlight: true,
                  occurrencesHighlight: true,
                  renderLineHighlight: "all",
                  renderLineHighlightOnlyWhenFocus: false,
                  highlightActiveIndentGuide: true,

                  // Bracket matching
                  matchBrackets: "always",
                  bracketPairColorization: { enabled: true },

                  // Word wrapping
                  wordWrap: "on",
                  wordWrapColumn: 120,
                  wrappingIndent: "indent",

                  // Scrollbars
                  scrollbar: {
                    vertical: "visible",
                    horizontal: "visible",
                    verticalScrollbarSize: 14,
                    horizontalScrollbarSize: 14,
                    useShadows: true,
                  },

                  // Minimap
                  minimap: {
                    enabled: true,
                    side: "right",
                    showSlider: "mouseover",
                    renderCharacters: false,
                    maxColumn: 120,
                    scale: 1,
                  },

                  // Suggestions and IntelliSense
                  suggestOnTriggerCharacters: true,
                  acceptSuggestionOnCommitCharacter: true,
                  acceptSuggestionOnEnter: "on",
                  tabCompletion: "on",
                  suggest: {
                    showKeywords: true,
                    showSnippets: true,
                    showFunctions: true,
                    showConstructors: true,
                    showFields: true,
                    showVariables: true,
                    showClasses: true,
                    showModules: true,
                    showProperties: true,
                    showValues: true,
                    showMethods: true,
                    showColors: true,
                    showFiles: true,
                    showReferences: true,
                  },

                  // Advanced features
                  formatOnPaste: true,
                  formatOnType: true,
                  autoClosingBrackets: "always",
                  autoClosingQuotes: "always",
                  autoSurround: "languageDefined",
                  codeLens: true,
                  colorDecorators: true,
                  contextmenu: true,
                  copyWithSyntaxHighlighting: true,

                  // Performance
                  disableLayerHinting: false,
                  disableMonospaceOptimizations: false,

                  // Accessibility
                  accessibilitySupport: "auto",

                  // Padding
                  padding: {
                    top: 20,
                    bottom: 20,
                    left: 0,
                    right: 0,
                  },
                }}
              />
            </div>

            {/* Output Panel */}
            <div className="flex-1 border-t border-white/10 bg-black/30 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-3 border-b border-white/10">
                <h3 className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Console Output
                </h3>
              </div>
              <div className="p-4 h-full overflow-y-auto">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {output ||
                    "// Output will appear here after running your code"}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat Overlay */}
        {showAI && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl h-5/6 bg-black/40 backdrop-blur-xl border border-indigo-500/30 shadow-2xl rounded-xl">
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
                    <FaRobot className="text-indigo-400" />
                    AI Code Review
                  </h2>
                  <button
                    onClick={() => setShowAI(false)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto mb-6 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 p-4">
                  <ReactMarkdown
                    children={aiResponse}
                    components={{
                      p: ({ node, ...props }) => (
                        <p
                          className="mb-3 text-gray-200 leading-relaxed"
                          {...props}
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong
                          className="text-white font-semibold"
                          {...props}
                        />
                      ),
                      code: ({ node, ...props }) => (
                        <code
                          className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-sm font-mono"
                          {...props}
                        />
                      ),
                      pre: ({ node, ...props }) => (
                        <pre
                          className="bg-black/50 p-4 rounded-lg overflow-x-auto mb-4 border border-indigo-500/20"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li
                          className="list-disc ml-6 text-gray-200 mb-1"
                          {...props}
                        />
                      ),
                    }}
                  />
                </div>

                <button
                  onClick={handleAIReview}
                  disabled={aiLoading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2 justify-center disabled:opacity-50"
                >
                  {aiLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FaRobot />
                      Get AI Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating AI Button */}
        <button
          onClick={() => setShowAI(!showAI)}
          className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/25 transition-all transform hover:scale-110 flex items-center justify-center"
          title="Get AI Code Review"
        >
          <FaRobot size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProblemDetail;
