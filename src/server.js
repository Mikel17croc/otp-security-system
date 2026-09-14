const express = require("express");
const path = require("path");

const otpRoutes = require("./routes/otpRoutes");
const { PORT } = require("./config");

const app = express();

// Middleware
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "..", "public")));

// API routes
app.use("/api/otp", otpRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "OTP Security System is running."
    });
});

// Start server
app.listen(PORT, () => {
    console.log(
        `OTP Security System running at http://localhost:${PORT}`
    );
});