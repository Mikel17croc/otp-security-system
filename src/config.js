require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 3000,

    MAX_REQUESTS_PER_HOUR:
        Number(process.env.MAX_REQUESTS_PER_HOUR) || 3,

    OTP_EXPIRY_SECONDS:
        Number(process.env.OTP_EXPIRY_SECONDS) || 30,

    RESEND_WINDOW_MINUTES:
        Number(process.env.RESEND_WINDOW_MINUTES) || 5,

    MAX_RESENDS:
        Number(process.env.MAX_RESENDS) || 3,

    OTP_HISTORY_HOURS:
        Number(process.env.OTP_HISTORY_HOURS) || 24
};