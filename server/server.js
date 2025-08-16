import express from "express"
import cors from "cors"
import "dotenv/config"
import cookieParser from "cookie-parser"
import session from "express-session"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import morgan from "morgan"
import passport from "./config/passport.js"
import connectDB from "./config/mongodb.js"
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js"
import problemRoutes from "./routes/problemRoutes.js"
import aiReviewRoute from "./routes/aiReview.js"
import submissionRoutes from "./routes/submissionRoutes.js"

const app = express()
const port = process.env.PORT || 4000

// Connect DB
connectDB().catch(err => console.error("Database connection error:", err))

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})
app.use(limiter)

// Request logging
app.use(morgan("dev"))

// Middlewares
app.use(express.json())
app.use(cookieParser())

app.set("trust proxy", 1); // behind Render/Cloudflare

// ✅ FIXED CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://codelabx.in",
]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))

// Session middleware for Passport
const isProd = process.env.NODE_ENV === "production";
app.use(session({
  secret: process.env.SESSION_SECRET || "your-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProd,                     // HTTPS only in prod
    sameSite: isProd ? "none" : "lax",  // needed for cross-site cookies (Vercel ↔ Render)
    maxAge: 24 * 60 * 60 * 1000,
  },
}));


// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

// Debug middleware
app.use((req, res, next) => {
  console.log("Session:", req.session)
  console.log("User:", req.user)
  next()
})

// Test Route
app.get("/", (req, res) => res.send("API Working"))

// Routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/problems", problemRoutes)
app.use("/api/submissions", submissionRoutes)
app.use("/ai-review", aiReviewRoute)

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  })
})

// Start server
app.listen(port, () => console.log(`Server started on PORT: ${port}`))
