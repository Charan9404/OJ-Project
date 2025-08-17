// src/utils/api-shim.js
// Normalizes all fetch/axios calls to the right base, and strips duplicate /api

import axios from "axios";

const DEV = import.meta.env.DEV;
const BACKEND_BASE =
  DEV ? "/api" : `${import.meta.env.VITE_API_BASE_URL}/api`; // e.g. https://codelabx.onrender.com/api

// Full URLs we want to rewrite to BACKEND_BASE (add more if you used others)
const KNOWN_FULLS = [
  "http://localhost:4000/api",
  import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : null,
  "https://codelabx.onrender.com/api",
].filter(Boolean);

/** Replace hard-coded full URLs with BACKEND_BASE, and remove leading /api if duplicated */
function normalizePath(url) {
  if (typeof url !== "string") return url;

  // 1) Rewrite known full URLs -> BACKEND_BASE + path
  for (const full of KNOWN_FULLS) {
    if (url.startsWith(full)) {
      return BACKEND_BASE + url.slice(full.length);
    }
  }

  // 2) If someone wrote "/api/xyz", collapse to "/xyz" (because BACKEND_BASE already has /api in prod)
  if (url.startsWith("/api/")) {
    return url.replace(/^\/api\//, "/");
  }

  return url; // leave as-is (relative URLs are fine)
}

/* ------------ Patch axios globally ------------- */
axios.defaults.baseURL = BACKEND_BASE;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((cfg) => {
  if (cfg?.url) {
    const u = cfg.url.toString();
    const fixed = normalizePath(u);
    if (fixed !== u) cfg.url = fixed;
  }
  return cfg;
});

/* ------------ Patch window.fetch (string URLs only) ------------- */
if (typeof window !== "undefined" && typeof window.fetch === "function") {
  const _fetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === "string") {
      return _fetch(normalizePath(input), init);
    }
    // If it's a Request object, leave it as-is (rare in your codebase)
    return _fetch(input, init);
  };
}

export { BACKEND_BASE };
