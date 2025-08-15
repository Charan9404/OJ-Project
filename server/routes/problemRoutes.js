import express from "express"
import userAuth from "../middleware/userAuth.js" // Your existing middleware
import Problem from "../models/Problem.js"

const router = express.Router()

// ✅ Protected route - requires authentication
router.get("/", userAuth, async (req, res) => {
  try {
    const problems = await Problem.find({}).sort({ createdAt: -1 })
    res.json(problems)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ✅ Protected route - get single problem
router.get("/:id", userAuth, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" })
    }
    res.json(problem)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
