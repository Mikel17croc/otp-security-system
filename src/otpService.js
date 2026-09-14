const crypto = require("crypto");

const {
    MAX_REQUESTS_PER_HOUR,
    OTP_EXPIRY_SECONDS,
    RESEND_WINDOW_MINUTES,
    MAX_RESENDS,
    OTP_HISTORY_HOURS
} = require("./config");

// Store OTP information in memory
const otpStore = new Map();

// Generate a secure 6-digit OTP
function generateOtp() {
    return crypto.randomInt(0, 1000000).toString().padStart(6, "0");
}

// Get or create user record
function getUser(email) {
    if (!otpStore.has(email)) {
        otpStore.set(email, {
            currentOtp: null,
            createdAt: null,
            expiresAt: null,
            resendCount: 0,
            requestTimes: [],
            otpHistory: []
        });
    }

    return otpStore.get(email);
}

// Remove request timestamps older than one hour
function cleanOldRequests(user) {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    user.requestTimes = user.requestTimes.filter(
        (time) => time > oneHourAgo
    );
}

// Check if OTP was used recently
function wasOtpUsedRecently(user, otp) {
    const historyLimit =
        Date.now() - OTP_HISTORY_HOURS * 60 * 60 * 1000;

    user.otpHistory = user.otpHistory.filter(
        (item) => item.createdAt > historyLimit
    );

    return user.otpHistory.some(
        (item) => item.otp === otp
    );
}

// Generate a unique OTP
function createUniqueOtp(user) {
    let otp;

    do {
        otp = generateOtp();
    } while (
        otp === user.currentOtp ||
        wasOtpUsedRecently(user, otp)
    );

    return otp;
}

// Request a new OTP
function requestOtp(email) {
    const user = getUser(email);

    cleanOldRequests(user);

    // Check hourly limit
    if (
        user.requestTimes.length >=
        MAX_REQUESTS_PER_HOUR
    ) {
        throw new Error(
            "OTP request limit exceeded. Please try again later."
        );
    }

    const now = Date.now();

    // Check whether we can resend the current OTP
    const resendWindow =
        RESEND_WINDOW_MINUTES * 60 * 1000;

    const canResendOriginal =
        user.currentOtp &&
        user.createdAt &&
        now - user.createdAt <= resendWindow &&
        user.resendCount < MAX_RESENDS;

    if (canResendOriginal) {
        user.expiresAt =
            now + OTP_EXPIRY_SECONDS * 1000;

        user.resendCount++;

        user.requestTimes.push(now);

        return {
            otp: user.currentOtp,
            expiresAt: user.expiresAt,
            resent: true
        };
    }

    // Generate completely new OTP
    const otp = createUniqueOtp(user);

    user.currentOtp = otp;
    user.createdAt = now;
    user.expiresAt =
        now + OTP_EXPIRY_SECONDS * 1000;

    user.resendCount = 0;

    user.requestTimes.push(now);

    user.otpHistory.push({
        otp,
        createdAt: now,
        used: false
    });

    return {
        otp,
        expiresAt: user.expiresAt,
        resent: false
    };
}

// Verify OTP
function verifyOtp(email, otp) {
    const user = getUser(email);

    if (!user.currentOtp) {
        return {
            valid: false,
            message: "No OTP has been requested."
        };
    }

    // Check expiry
    if (Date.now() > user.expiresAt) {
        return {
            valid: false,
            message: "OTP has expired."
        };
    }

    // Check whether OTP matches
    if (user.currentOtp !== otp) {
        return {
            valid: false,
            message: "Invalid OTP."
        };
    }

    // Find OTP history record
    const historyItem = user.otpHistory.find(
        (item) => item.otp === otp
    );

    // Prevent reuse
    if (historyItem && historyItem.used) {
        return {
            valid: false,
            message: "OTP has already been used."
        };
    }

    // Mark OTP as used
    if (historyItem) {
        historyItem.used = true;
    }

    // Invalidate current OTP
    user.currentOtp = null;

    return {
        valid: true,
        message: "OTP verified successfully."
    };
}

module.exports = {
    requestOtp,
    verifyOtp,
    otpStore
};