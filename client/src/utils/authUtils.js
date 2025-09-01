import api from "./axios"

// Check if user is authenticated
export const checkAuth = async () => {
  try {
    const { data } = await api.get("/api/auth/is-auth")
    return data.success
  } catch (error) {
    console.error("Auth check failed:", error)
    return false
  }
}

// Get user info if authenticated
export const getUserInfo = async () => {
  try {
    const { data } = await api.get("/api/auth/is-auth")
    return data.success ? data.user : null
  } catch (error) {
    console.error("Get user info failed:", error)
    return null
  }
}
