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
connectDB().catch(err => console.error('Database connection error:', err))

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Request logging
app.use(morgan('dev'))

// Middlewares
app.use(express.json())
app.use(cookieParser())

// Updated CORS and cookie settings
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))

// Session middleware for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
    },
  }),
)

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

// Add this middleware to log auth state
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message 
  })
})

// Start server
app.listen(port, () => console.log(`Server started on PORT: ${port}`))
