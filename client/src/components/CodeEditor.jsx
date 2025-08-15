"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { FaRobot, FaPlay, FaTimes, FaCode } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import axios from "axios";

const CodeEditor = ({
  showAIReview = true,
  initialCode = "",
  initialLanguage = "python",
  height = "calc(100vh - 80px)",
  className = "",
}) => {
  const [userCode, setUserCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState(initialLanguage);
  const [customInput, setCustomInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // AI Review states
  const [showAI, setShowAI] = useState(false);
  const [aiResponse, setAIResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Theme state
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Set default code based on language with professional templates
  useEffect(() => {
    if (!userCode) {
      const defaultCodes = {
        python: `# CodeLabX - Professional Python Editor
# Write your solution here

def solve():
    """
    Main solution function
    """
    # Read input
    n = int(input())
    
    # Your code here
    print("Hello, World!")

if __name__ == "__main__":
    solve()`,

        cpp: `// CodeLabX - Professional C++ Editor
// Write your solution here

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Read input
    int n;
    cin >> n;
    
    // Your code here
    cout << "Hello, World!" << endl;
    
    return 0;
}`,

        java: `// CodeLabX - Professional Java Editor
// Write your solution here

import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Read input
        int n = scanner.nextInt();
        
        // Your code here
        System.out.println("Hello, World!");
        
        scanner.close();
    }
}`,
      };
      setUserCode(defaultCodes[language] || defaultCodes.python);
    }
  }, [language, userCode]);

  const handleRun = async () => {
    if (!userCode.trim()) {
      setOutput("⚠️ Please enter some code before running.");
      return;
    }

    setIsRunning(true);
    try {
      setOutput("🚀 Executing your code...");
      const { data } = await axios.post("http://localhost:5001/run", {
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

  const handleAIReview = async () => {
    if (!userCode.trim()) {
      alert("Please write some code first.");
      return;
    }
    setAiLoading(true);
    setAIResponse("🤖 Analyzing your code...");

    try {
      const res = await axios.post("http://localhost:5001/ai-review", {
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

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`flex flex-col ${className}`} style={{ height }}>
      {/* Editor Header */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border-b border-white/10 p-4 flex-shrink-0">
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
                isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"
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
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
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

            {showAIReview && (
              <button
                onClick={() => setShowAI(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
              >
                <FaRobot />
                AI Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex flex-1 min-h-0">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={userCode}
              onChange={(value) => setUserCode(value || "")}
              theme={isDarkTheme ? "vs-dark" : "light"}
              options={{
                fontSize: 14,
                fontFamily:
                  "'Fira Code', 'JetBrains Mono', 'Monaco', 'Menlo', monospace",
                fontLigatures: true,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                minimap: { enabled: false },
                lineNumbers: "on",
                glyphMargin: true,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                renderLineHighlight: "all",
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                  useShadows: false,
                  verticalScrollbarSize: 17,
                  horizontalScrollbarSize: 17,
                },
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
                wordWrap: "on",
                contextmenu: true,
                mouseWheelZoom: true,
                smoothScrolling: true,
                cursorBlinking: "blink",
                cursorSmoothCaretAnimation: true,
                renderWhitespace: "selection",
                renderControlCharacters: false,
                fontWeight: "normal",
                letterSpacing: 0,
                lineHeight: 1.5,
                roundedSelection: false,
                scrollBeyondLastColumn: 5,
                smoothScrolling: true,
                autoIndent: "full",
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: "on",
                tabCompletion: "on",
                wordBasedSuggestions: true,
                parameterHints: { enabled: true },
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                autoSurround: "languageDefined",
                codeLens: false,
                colorDecorators: true,
                lightbulb: { enabled: true },
                matchBrackets: "always",
                selectionHighlight: true,
                occurrencesHighlight: true,
                folding: true,
                foldingStrategy: "auto",
                showFoldingControls: "mouseover",
                unfoldOnClickAfterEndOfLine: false,
                disableLayerHinting: false,
                disableMonospaceOptimizations: false,
                hover: { enabled: true },
                links: true,
                multiCursorModifier: "alt",
                multiCursorMergeOverlapping: true,
                quickSuggestions: {
                  other: true,
                  comments: false,
                  strings: false,
                },
                quickSuggestionsDelay: 10,
                readOnly: false,
                rulers: [],
                wordSeparators: "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?",
                wordWrap: "off",
                wordWrapBreakAfterCharacters: "\t})]?|/&.,;¢°′″‰℃、。｡､￠",
                wordWrapBreakBeforeCharacters:
                  "([{'" + "〈《「『【〔（［｛｢£¥＄￡￥+＋",
                wordWrapColumn: 80,
                wrappingIndent: "none",
              }}
            />
          </div>
        </div>

        {/* Right Panel - Input & Output */}
        <div className="w-80 flex flex-col border-l border-white/10">
          {/* Custom Input */}
          <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-white mb-3">
              Custom Input
            </h3>
            <textarea
              placeholder="Enter input for your program..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full bg-black/30 backdrop-blur-sm text-white text-sm p-3 rounded-lg border border-indigo-400/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all placeholder-gray-500 resize-none font-mono"
              rows={4}
            />
          </div>

          {/* Output Panel */}
          <div className="flex-1 bg-black/30 backdrop-blur-sm flex flex-col">
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Console Output
              </h3>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
                {output || "// Output will appear here after running your code"}
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
                      <strong className="text-white font-semibold" {...props} />
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
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2 justify-center disabled:opacity-50"
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
    </div>
  );
};

export default CodeEditor;
