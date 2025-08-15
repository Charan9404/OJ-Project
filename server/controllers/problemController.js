import Problem from "../models/Problem.js";

export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select("title difficulty tags");
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch problems" });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Not found" });
    res.status(200).json(problem);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch problem" });
  }
};
