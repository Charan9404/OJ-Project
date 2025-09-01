// utils/axios.js
import axios from "axios";

// Must already include `/api`
const rawBase =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

// ensure single trailing slash
const baseURL = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

const api = axios.create({
  baseURL,
  withCredentials:
    (import.meta.env.VITE_WITH_CREDENTIALS ?? "true") === "true", // default true
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Log the final URL (after normalization)
api.interceptors.request.use((config) => {
  // if caller passes absolute URL, leave it
  if (!/^https?:\/\//i.test(config.url || "")) {
    // strip leading slash to avoid double slashes
    if (config.url?.startsWith("/")) config.url = config.url.slice(1);
  }
  console.log("Request URL:", (config.baseURL || "") + (config.url || ""));
  return config;
});

// Centralized error logging
api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default api;
