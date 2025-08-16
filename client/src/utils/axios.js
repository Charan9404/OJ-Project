import axios from "axios";

// src/lib/api.js (or api.ts)
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  withCredentials: true,  // ✅ force true, never from env
  headers: {
    "Content-Type": "application/json",
  },
});




// Add request interceptor to log URLs
api.interceptors.request.use((config) => {
  console.log("Request URL:", config.baseURL + config.url);
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  },
);

export default api; // ✅ only once
