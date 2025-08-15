import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String, default: "" }, // ✅ Added for Google OAuth
    profilePicture: { type: String, default: "" }, // ✅ Added for profile picture
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },
  },
  {
    timestamps: true, // ✅ Added timestamps
  },
)

// ✅ Use mongoose.model safely to avoid overwriting in dev mode
const userModel = mongoose.models.User || mongoose.model("User", userSchema)

// ✅ Export as default for ES Modules
export default userModel
