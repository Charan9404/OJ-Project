## Online Judge (OJ-AUTH)

An online judge web application with authentication, problem browsing, code submission, judging, and AI code review. The system is split into three parts:

- Client: React + Vite UI
- Server: Node/Express API with MongoDB, Auth (JWT + Google OAuth), submissions and judging orchestration
- Compiler: Isolated microservice that runs code (C++/Python/Java) and provides AI review

### Architecture

- Client (default: http://localhost:5173) talks to Server (default: http://localhost:4000) via REST
- Server connects to MongoDB and exposes routes under `/api/**` and `/ai-review`
- Compiler microservice (default: http://localhost:5001) exposes `/run` and `/ai-review`

### Tech Stack

- Frontend: React 19, Vite, React Router, Axios, Tailwind, React Toastify, CodeMirror/Monaco
- Backend: Node 18+, Express, Mongoose (MongoDB), JWT, Passport (Google OAuth), Nodemailer, Helmet, Rate Limiting, Morgan
- Judge: Node, child_process, g++, Python3, OpenJDK 17 (via Dockerfile for isolation)
- AI Review: Google Generative AI (Gemini) SDK

---

## Project Structure

```text
OJ-AUTH/
  client/           # React frontend
  server/           # Express API and data layer
  compiler/         # Code runner + AI review microservice
```

Notable server routes and models:
- `server/routes/authRoutes.js` (register, login, logout, OTP flows, Google OAuth, `is-auth`)
- `server/routes/userRoutes.js` (get user data)
- `server/routes/problemRoutes.js` (list problems, get problem)
- `server/routes/submissionRoutes.js` (create submission, list mine, judge, update status)
- `server/routes/aiReview.js` (Gemini-based AI review)
- `server/models/{User,Problem,Submission}.js`

Compiler service:
- `compiler/index.js` exposes `POST /run` for code execution and `POST /ai-review`
- `compiler/Dockerfile` installs `g++`, `python3`, `openjdk-17-jdk`

---

## Prerequisites

- Node.js 18+
- npm
- MongoDB instance (local or hosted)
- For AI review: a Google Generative AI API key
- Optional: Docker (to containerize the compiler microservice)

---

## Environment Variables

Create `.env` files per service as needed.

### Client (`client/.env`)

```bash
VITE_BACKEND_URL=http://localhost:4000
```

### Server (`server/.env`)

```bash
PORT=4000
MONGODB_URI=mongodb://localhost:27017

# Auth
JWT_SECRET=replace-with-strong-secret
SESSION_SECRET=replace-with-strong-session-secret
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Brevo example)
SMTP_USER=apikey
SMTP_PASS=your-brevo-smtp-key
SENDER_EMAIL=you@example.com

# AI Review (Gemini)
GEMINI_API_KEY=your-gemini-api-key
```

Notes:
- Cookies are used for JWT; ensure the client origin matches CORS config (`http://localhost:5173` by default) and requests send credentials.
- `MONGODB_URI` is used as `${MONGODB_URI}/oj-auth`.

### Compiler (`compiler/.env`)

```bash
PORT=5001
GEMINI_API_KEY=your-gemini-api-key
```

---

## Install & Run (Local Development)

Run services in separate terminals.

### 1) Server (API)

```bash
cd server
npm install
npm run server    # or: npm start
```

Server defaults:
- URL: `http://localhost:4000`
- CORS: `http://localhost:5173`
- Routes: `/api/**`, `/ai-review`


### 2) Compiler (Microservice)

```bash
cd compiler
npm install
npm run dev       # or: npm start
```

Compiler defaults:
- URL: `http://localhost:5001`
- Routes: `POST /run`, `POST /ai-review`

Optional: build and run via Docker (recommended for isolation):

```bash
cd compiler
docker build -t oj-compiler .
docker run -p 5001:5001 --env-file .env --name oj-compiler oj-compiler
```

### 3) Client (Frontend)

```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173`.

---

## Database Seeding (Problems)

There is a seeding script under `server/seed/seedProblems.js`. You can run it manually after setting up the server `.env` and MongoDB:

```bash
cd server
node seed/seedProblems.js
```

---

## API Overview (Server)

Base URL: `http://localhost:4000`

### Auth (`/api/auth`)
- `POST /register` { name, email, password }
- `POST /login` { email, password }
- `POST /logout`
- `GET /is-auth` (cookie-based JWT)
- `POST /send-verify-otp` (auth required)
- `POST /verify-account` (auth required)
- `POST /send-reset-otp` { email }
- `POST /reset-password` { email, otp, newPassword }
- `GET /google` (Google OAuth)
- `GET /google/callback` (internal)

### User (`/api/user`)
- `GET /data` (auth required)

### Problems (`/api/problems`)
- `GET /` (auth required) — list
- `GET /:id` (auth required) — details

### Submissions (`/api/submissions`)
- `GET /mine` (auth required)
- `POST /` (auth required) — create submission row
- `PATCH /:id` (auth required) — update verdict/metrics
- `POST /:id/judge` (auth required) — run against configured test cases

### AI Review (`/ai-review`)
- `POST /` { code, language } — Gemini-powered review

---

## API Overview (Compiler)

Base URL: `http://localhost:5001`

### Run Code
- `POST /run`

Request body:
```json
{ "language": "cpp|python|java", "code": "...", "input": "..." }
```

### AI Review
- `POST /ai-review` { code, language }

---

## Frontend Notes

- Configure `client/.env` with `VITE_BACKEND_URL`
- Axios instance (`client/src/utils/axios.js`) sets `withCredentials: true` and points to backend URL
- App routes include `/`, `/login`, `/email-verify`, `/reset-password`, `/problems`, `/problems/:id`, `/submissions`, `/codeeditor-special`

---

## Demo

Add your demo video via one of these options:

- Host on YouTube and embed a link with a thumbnail
  
  ```md
  ### Demo Video
  [![Watch the demo](https://img.youtube.com/vi/R874o9HHhK4/maxresdefault.jpg)](https://youtu.be/R874o9HHhK4)
  ```

- Store the video in the repo using Git LFS (recommended for large files)
  
  ```bash
  # one-time per machine
  brew install git-lfs            # or: apt-get install git-lfs
  git lfs install
  
  # in repo
  git lfs track "demo/*.mp4"
  git add .gitattributes demo/your-demo.mp4
  git commit -m "Add demo video via LFS"
  git push origin <branch>
  ```

- Store the video in `client/public/` and link to it (keeps video accessible by the dev server)
  
  ```md
  [Watch demo](client/public/your-demo.mp4)
  ```

Notes:
- Prefer YouTube or LFS to avoid bloating the repo with large binaries.
- If using GitHub, LFS bandwidth/storage limits apply.

---

## Authentication

- Cookie-based JWT using `token` cookie
- Google OAuth 2.0 via Passport; on success, server redirects to `FRONTEND_URL` with `?auth=success`
- Protected routes enforced by `server/middleware/userAuth.js`

---

## Judging Flow (High Level)

1. User selects a problem and writes code in the editor
2. Client creates a submission via `POST /api/submissions`
3. Client triggers judge via `POST /api/submissions/:id/judge`
4. Server runs code per test cases (currently configured in `submissionRoutes.js`) and updates submission with status/metrics
5. Client displays results; AI review can be requested separately

---

## Production Tips

- Set `NODE_ENV=production` and use secure cookies; update CORS origins accordingly
- Put the compiler service behind a private network/VPC and expose only via API gateway if needed
- Consider real sandboxing (e.g., per-run Docker) for untrusted code execution
- Replace SMTP creds with production provider and sender domain with proper DKIM/SPF
- Harden rate limits and request body size limits

---

## Scripts

### Server
```json
"scripts": {
  "start": "node server.js",
  "server": "nodemon server.js"
}
```

### Client
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### Compiler
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

---

## License

MIT or as specified by the project owner.


