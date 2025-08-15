import axios from "axios"

// Set the base URL for your backend API
axios.defaults.baseURL = "http://localhost:4000"

// Check if user is authenticated
export const checkAuth = async () => {
  try {
    const response = await axios.get("/api/auth/is-auth", {
      withCredentials: true,
    })
    return response.data.success
  } catch (error) {
    console.error("Auth check failed:", error)
    return false
  }
}

// Get user info if authenticated
export const getUserInfo = async () => {
  try {
    const response = await axios.get("/api/auth/is-auth", {
      withCredentials: true,
    })
    return response.data.success ? response.data.user : null
  } catch (error) {
    console.error("Get user info failed:", error)
    return null
  }
}
