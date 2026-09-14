const {
    requestOtp,
    verifyOtp,
    otpStore
} = require("../src/otpService");

describe("OTP Security System", () => {

    beforeEach(() => {
        otpStore.clear();
    });

    test("should generate a 6 digit OTP", () => {

        const result =
            requestOtp("test@example.com");

        expect(result.otp).toMatch(/^\d{6}$/);

    });

    test("should verify a valid OTP", () => {

        const result =
            requestOtp("test@example.com");

        const verification =
            verifyOtp(
                "test@example.com",
                result.otp
            );

        expect(verification.valid).toBe(true);

    });

    test("should reject an incorrect OTP", () => {

        requestOtp("test@example.com");

        const verification =
            verifyOtp(
                "test@example.com",
                "111111"
            );

        expect(verification.valid).toBe(false);

    });

    test("OTP cannot be used twice", () => {

        const result =
            requestOtp("test@example.com");

        const firstVerification =
            verifyOtp(
                "test@example.com",
                result.otp
            );

        const secondVerification =
            verifyOtp(
                "test@example.com",
                result.otp
            );

        expect(firstVerification.valid).toBe(true);

        expect(secondVerification.valid).toBe(false);

    });

});