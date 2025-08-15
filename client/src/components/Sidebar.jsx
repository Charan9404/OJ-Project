"use client";
import { useNavigate } from "react-router-dom";
import {
  FaCodeBranch,
  FaDatabase,
  FaLaptopCode,
  FaBrain,
  FaCogs,
  FaCube,
  FaServer,
  FaChartLine,
} from "react-icons/fa"; // Added more icons

const topics = [
  { name: "Algorithms", icon: FaBrain },
  { name: "Data Structures", icon: FaCube },
  { name: "DBMS", icon: FaDatabase },
  { name: "OOPS", icon: FaCodeBranch },
  { name: "Operating Systems", icon: FaLaptopCode },
  { name: "Machine Learning", icon: FaCogs },
  { name: "SQL", icon: FaServer },
  { name: "System Design", icon: FaChartLine },
];

const Sidebar = ({ selectedTopic, setSelectedTopic }) => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-[calc(100vh-80px)] bg-black/20 text-white shadow-2xl fixed top-[80px] left-0 pt-6 px-4 z-40 backdrop-blur-xl border-r border-white/10 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        Topics
      </h2>
      <ul className="space-y-3">
        {topics.map((topic, idx) => {
          const Icon = topic.icon;
          return (
            <li
              key={idx}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 text-lg font-medium relative overflow-hidden group
                ${
                  selectedTopic === topic.name
                    ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/50 text-white shadow-lg"
                    : "hover:bg-white/10 hover:border-white/10 text-gray-300 hover:text-white"
                }`}
              onClick={() => setSelectedTopic(topic.name)}
            >
              <Icon
                className={`text-xl ${
                  selectedTopic === topic.name
                    ? "text-white"
                    : "text-indigo-300 group-hover:text-white"
                }`}
              />
              <span>{topic.name}</span>
              {selectedTopic === topic.name && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
