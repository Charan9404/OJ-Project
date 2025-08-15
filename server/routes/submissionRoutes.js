import express from "express"
import Submission from "../models/Submission.js"
import userAuth from "../middleware/userAuth.js"
import fs from "fs"
import path from "path"
import { exec, spawn } from "child_process"

const router = express.Router()
const TMP_SUBMIT = path.resolve("tmp-submit")

// Better normalization function
const norm = (s) => {
  return s
    .toString()
    .replace(/\r\n/g, "\n") // Convert Windows line endings
    .replace(/\r/g, "\n") // Convert Mac line endings
    .split("\n") // Split into lines
    .map((line) => line.trim()) // Trim each line
    .filter((line) => line.length > 0) // Remove empty lines
    .join(" ") // Join with single spaces
    .trim() // Final trim
}

// ---- Hardcoded test cases per problemId (MVP) ----
const PROBLEM_ID_MAP = {
  // Algorithms
  "two-sum": "two-sum",
  "binary-search": "binary-search",
  "merge-sort": "merge-sort",
  "quick-sort": "quick-sort",
  dijkstra: "dijkstra",
  bfs: "bfs",
  dfs: "dfs",
  kmp: "kmp",
  "longest-common-subsequence": "longest-common-subsequence",
  knapsack: "knapsack",
  "coin-change": "coin-change",
  "edit-distance": "edit-distance",
  "maximum-subarray": "maximum-subarray",
  "palindrome-check": "palindrome-check",
  fibonacci: "fibonacci",
  "prime-check": "prime-check",
  gcd: "gcd",
  power: "power",
  "reverse-string": "reverse-string",
  "anagram-check": "anagram-check",
  "valid-parentheses": "valid-parentheses",
  "merge-intervals": "merge-intervals",
  "three-sum": "three-sum",
  "container-water": "container-water",
  "rotate-array": "rotate-array",
}

const TESTS = {
  // ===== ALGORITHMS =====
  "two-sum": [
    { in: "4\n2 7 11 15\n9\n", out: "0 1" },
    { in: "5\n3 2 4 8 10\n6\n", out: "1 2" },
    { in: "3\n3 3 3\n6\n", out: "0 1" },
    { in: "2\n1 2\n4\n", out: "-1" }, // No solution case
  ],

  "binary-search": [
    { in: "5\n1 3 5 7 9\n5\n", out: "2" },
    { in: "6\n2 4 6 8 10 12\n8\n", out: "3" },
    { in: "4\n1 2 3 4\n5\n", out: "-1" },
    { in: "1\n42\n42\n", out: "0" },
  ],

  "merge-sort": [
    { in: "5\n64 34 25 12 22\n", out: "12 22 25 34 64" },
    { in: "6\n5 2 4 6 1 3\n", out: "1 2 3 4 5 6" },
    { in: "3\n3 1 2\n", out: "1 2 3" },
    { in: "1\n42\n", out: "42" },
  ],
}

// ---- Runner (python/java/cpp) — no external judge ----
function runOnce({ language, code, inputFile, workdir }) {
  return new Promise((resolve) => {
    fs.mkdirSync(workdir, { recursive: true })

    let codeFile = ""
    let compileCmd = ""
    let runCmd = ""

    if (language === "python") {
      codeFile = path.join(workdir, "main.py")
      runCmd = ["python3", codeFile]
    } else if (language === "java") {
      codeFile = path.join(workdir, "Main.java")
      compileCmd = `javac ${codeFile}`
      runCmd = ["java", "Main"]
    } else if (language === "cpp" || language === "c++") {
      codeFile = path.join(workdir, "main.cpp")
      const execFile = path.join(workdir, "main")
      compileCmd = `g++ -o ${execFile} ${codeFile}`
      runCmd = [execFile]
    } else {
      return resolve({ compileErr: "Unsupported language" })
    }

    fs.writeFileSync(codeFile, code, "utf8")

    const pipe = (p) => {
      const stdin = fs.createReadStream(inputFile)
      let out = "",
        err = ""
      let killed = false
      const killer = setTimeout(() => {
        killed = true
        p.kill("SIGKILL")
      }, 6000)

      stdin.pipe(p.stdin)
      p.stdout.on("data", (d) => (out += d))
      p.stderr.on("data", (d) => (err += d))
      p.on("close", (code) => {
        clearTimeout(killer)
        if (killed) return resolve({ tl: true, out, err })
        resolve({ code, out, err })
      })
    }

    if (compileCmd) {
      exec(compileCmd, { cwd: workdir, timeout: 8000 }, (e, _so, se) => {
        if (e) return resolve({ compileErr: se || e.message })
        pipe(spawn(runCmd[0], runCmd.slice(1), { cwd: workdir }))
      })
    } else {
      pipe(spawn(runCmd[0], runCmd.slice(1), { cwd: workdir }))
    }
  })
}

/**
 * All routes require a logged-in user.
 * userAuth must set req.user.id (ObjectId string)
 */

// GET /api/submissions/mine  -> list my submissions (newest first)
router.get("/mine", userAuth, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.userId }).sort({ createdAt: -1 }).lean()

    res.json({ submissions })
  } catch (e) {
    console.error("GET /mine error:", e)
    res.status(500).json({ error: "Failed to load submissions" })
  }
})

// POST /api/submissions -> create a PENDING row immediately
router.post("/", userAuth, async (req, res) => {
  try {
    const { problemId, problemTitle, language, code } = req.body

    if (!problemId || !language || !code) {
      return res.status(400).json({ error: "problemId, language and code are required" })
    }

    console.log(req.user)

    const submission = await Submission.create({
      userId: req.userId,
      problemId,
      problemTitle,
      language,
      code,
      status: "PENDING",
    })

    res.status(201).json({ submission })
  } catch (e) {
    console.error("POST / error:", e)
    res.status(500).json({ error: "Failed to create submission" })
  }
})

// PATCH /api/submissions/:id -> update verdict after compiler run
router.patch("/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params

    // whitelist fields allowed to be updated
    const { status, metrics, stdout, stderr, compileError } = req.body
    const update = {}
    if (status) update.status = status
    if (metrics) update.metrics = metrics
    if (stdout !== undefined) update.stdout = stdout
    if (stderr !== undefined) update.stderr = stderr
    if (compileError !== undefined) update.compileError = compileError

    const submission = await Submission.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $set: update },
      { new: true },
    )

    if (!submission) return res.status(404).json({ error: "Submission not found" })
    res.json({ submission })
  } catch (e) {
    console.error("PATCH /:id error:", e)
    res.status(500).json({ error: "Failed to update submission" })
  }
})

/**
 * POST /api/submissions/:id/judge
 * Runs the user's code against hardcoded TESTS for the problemId,
 * updates the submission with final verdict, and returns the result.
 */
router.post("/:id/judge", userAuth, async (req, res) => {
  try {
    const { id } = req.params

    // load submission (must belong to the user)
    const sub = await Submission.findOne({ _id: id, userId: req.userId })
    if (!sub) return res.status(404).json({ error: "Submission not found" })

    // Try to find test cases by problemId first, then by problemTitle as fallback
    let testKey = PROBLEM_ID_MAP[sub.problemId]
    if (!testKey && sub.problemTitle) {
      // Convert problem title to kebab-case for lookup
      testKey = sub.problemTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
    }

    if (!testKey) return res.status(400).json({ error: "No problem mapping found" })

    const cases = TESTS[testKey] || []
    if (!cases.length) return res.status(400).json({ error: `No tests configured for problem: ${testKey}` })

    let final = "SUCCESS"
    let detail = ""
    let passed = 0
    let executionTime = 0

    for (let i = 0; i < cases.length; i++) {
      const startTime = Date.now()
      const base = String(i + 1).padStart(2, "0")
      const workdir = path.join(TMP_SUBMIT, `${sub._id}-${base}`)
      fs.mkdirSync(workdir, { recursive: true })

      const inputPath = path.join(workdir, "stdin.txt")
      fs.writeFileSync(inputPath, cases[i].in, "utf8")

      const result = await runOnce({
        language: sub.language,
        code: sub.code,
        inputFile: inputPath,
        workdir,
      })

      const testTime = Date.now() - startTime
      executionTime += testTime

      if (result.compileErr) {
        final = "COMPILE_ERROR"
        detail = result.compileErr
        break
      }
      if (result.tl) {
        final = "TIME_LIMIT"
        detail = "Time limit exceeded"
        break
      }
      if (result.code !== 0) {
        final = "RUNTIME_ERROR"
        detail = result.err || `Exit code: ${result.code}`
        break
      }

      const expectedNorm = norm(cases[i].out)
      const actualNorm = norm(result.out)

      console.log(`Test case ${i + 1}:`)
      console.log(`Expected (raw): "${cases[i].out}"`)
      console.log(`Expected (norm): "${expectedNorm}"`)
      console.log(`Actual (raw): "${result.out}"`)
      console.log(`Actual (norm): "${actualNorm}"`)
      console.log(`Match: ${expectedNorm === actualNorm}`)

      if (expectedNorm !== actualNorm) {
        final = "WRONG_ANSWER"
        detail = `Test case ${i + 1} failed\nExpected: "${cases[i].out}"\nGot: "${result.out}"\nExpected (normalized): "${expectedNorm}"\nGot (normalized): "${actualNorm}"`
        break
      }

      passed++
    }

    // Mock memory usage (in practice, you'd measure actual memory)
    const mockMemoryUsage = Math.floor(Math.random() * 50) + 10 // 10-60 MB

    const updated = await Submission.findOneAndUpdate(
      { _id: id, userId: req.userId },
      {
        $set: {
          status: final,
          stdout: final === "SUCCESS" ? "All test cases passed!" : detail,
          stderr: final === "RUNTIME_ERROR" ? detail || "" : "",
          compileError: final === "COMPILE_ERROR" ? detail || "" : "",
          metrics: {
            time: `${executionTime}ms`,
            memory: `${mockMemoryUsage}MB`,
          },
        },
      },
      { new: true },
    )

    return res.json({
      submission: updated,
      result: {
        status: final,
        passed,
        total: cases.length,
        detail,
        executionTime: `${executionTime}ms`,
        memoryUsage: `${mockMemoryUsage}MB`,
      },
    })
  } catch (e) {
    console.error("POST /:id/judge error:", e)
    res.status(500).json({ error: "Judge failed" })
  }
})

export default router
