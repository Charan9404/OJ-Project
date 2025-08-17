import axios from "axios";

// Build a safe baseURL that always ends with a single trailing slash.
const rawBase =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const baseURL = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

const api = axios.create({
  baseURL,
  withCredentials: true, // keep cookies/session
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // optional: avoid hanging forever
});

// Normalize paths + log
api.interceptors.request.use((config) => {
  // Accept both "path" and "/path" from callers — normalize to "path"
  if (typeof config.url === "string" && config.url.startsWith("/")) {
    config.url = config.url.slice(1);
  }
  console.log("Request URL:", config.baseURL + (config.url || ""));
  return config;
});

// Basic error logging
api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API Error:", {
      url: error.config?.baseURL + (error.config?.url || ""),
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default api;
