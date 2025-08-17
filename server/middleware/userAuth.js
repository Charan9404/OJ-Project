import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  try {
    // ✅ Ensure cookie-parser is installed in server.js
    const token = req.cookies?.token;

    if (!token) {
      console.warn("🔒 No token cookie received");
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized. Login Again" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      console.warn("🔒 Token decoded but no id field");
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized. Login Again" });
    }

    // ✅ Attach userId to request
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized. Login Again" });
  }
};

export default userAuth;
