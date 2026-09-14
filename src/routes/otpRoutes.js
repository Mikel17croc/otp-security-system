const express = require("express");

const {
    requestOtp,
    verifyOtp
} = require("../otpService");

const router = express.Router();

// Send / resend OTP
router.post("/send", (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        const result = requestOtp(email.toLowerCase());

        res.json({
            success: true,
            message: result.resent
                ? "OTP resent successfully."
                : "OTP sent successfully.",

            // For assessment/demo purposes only
            otp: result.otp,

            expiresAt: result.expiresAt,
            resent: result.resent
        });
    } catch (error) {
        res.status(429).json({
            success: false,
            message: error.message
        });
    }
});

// Verify OTP
router.post("/verify", (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required."
        });
    }

    if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({
            success: false,
            message: "OTP must be exactly 6 digits."
        });
    }

    const result = verifyOtp(
        email.toLowerCase(),
        otp
    );

    if (!result.valid) {
        return res.status(400).json({
            success: false,
            message: result.message
        });
    }

    res.json({
        success: true,
        message: result.message
    });
});

module.exports = router;