import userModel from '../models/userModel.js';

export const getUserData = async (req, res) => {
    try {
        const userId = req.userId; // ✅ Get userId from middleware

        const user = await userModel.findById(userId).select("name email isAccountVerified");
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            userData: user
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
