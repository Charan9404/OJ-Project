import jwt from "jsonwebtoken"

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again" })
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

    if (tokenDecode.id) {
      req.userId = tokenDecode.id
      next()
    } else {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again" })
    }
  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.status(401).json({ success: false, message: "Not Authorized. Login Again" })
  }
}

export default userAuth
