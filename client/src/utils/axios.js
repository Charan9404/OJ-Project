import axios from "axios"

// Create a single axios instance used everywhere
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Log full request URL for debugging
api.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL?.replace(/\/$/, "")}${config.url || ""}`
  console.log("Request URL:", fullUrl)
  return config
})

// Centralized error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    })
    return Promise.reject(error)
  },
)

export default api
