const form = document.getElementById("otpForm");
const emailInput = document.getElementById("email");
const message = document.getElementById("message");
const otpDisplay = document.getElementById("otpDisplay");
const resendButton = document.getElementById("resendButton");

let currentEmail = "";

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    await sendOtp();
});

resendButton.addEventListener("click", async () => {
    await sendOtp();
});

async function sendOtp() {
    const email = emailInput.value.trim();

    if (!email) {
        message.textContent = "Please enter an email address.";
        return;
    }

    currentEmail = email;

    try {
        const response = await fetch("/api/otp/send", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email
            })
        });

        const data = await response.json();

        message.textContent = data.message;

        if (data.success) {

            otpDisplay.textContent =
                `Demo OTP: ${data.otp}`;

            resendButton.style.display = "block";
        }

    } catch (error) {

        message.textContent =
            "Something went wrong. Please try again.";

    }
}