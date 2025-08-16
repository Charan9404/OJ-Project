import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import session from "express-session";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import passport from "./config/passport.js";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import aiReviewRoute from "./routes/aiReview.js";
import submissionRoutes from "./routes/submissionRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

/* ---------- Security & logging ---------- */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

/* ---------- Parsers ---------- */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------- CORS (Vercel prod + previews + localhost) ---------- */
app.set("trust proxy", 1); // required on Render for secure cookies

const PROD_FRONTEND = process.env.FRONTEND_URL || "https://oj-project-swart.vercel.app";

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // server-to-server / curl
      try {
        const { hostname } = new URL(origin);
        if (
          origin === PROD_FRONTEND ||
          hostname.endsWith(".vercel.app") || // allow all Vercel previews + prod
          origin === "http://localhost:5173"
        ) {
          return cb(null, true);
        }
      } catch {}
      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ---------- Sessions (cross-site) ---------- */
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "change_me",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true,       // Render is HTTPS
      sameSite: "none",   // needed for Vercel <-> Render
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

/* ---------- Passport ---------- */
app.use(passport.initialize());
app.use(passport.session());

/* ---------- Debug (keep while deploying) ---------- */
app.get("/health", (_req, res) => res.status(200).send("API Working"));
app.get("/debug/headers", (req, res) => {
  res.json({
    origin: req.get("origin") || null,
    cookieHeaderPresent: Boolean(req.headers.cookie),
    sessionReady: Boolean(req.session),
    userPresent: Boolean(req.user),
  });
});

/* ---------- Routes (all under /api) ---------- */
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);         
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/ai-review", aiReviewRoute); 

/* ---------- Start ---------- */
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server started on :${PORT}`);
      console.log(`✅ Allowing frontend: ${PROD_FRONTEND} + *.vercel.app`);
    });
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
};

start();
