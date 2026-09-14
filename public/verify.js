const form = document.getElementById("verifyForm");

const emailInput =
    document.getElementById("email");

const otpInput =
    document.getElementById("otp");

const message =
    document.getElementById("message");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = emailInput.value.trim();

    const otp = otpInput.value.trim();

    try {

        const response = await fetch(
            "/api/otp/verify",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    otp
                })
            }
        );

        const data = await response.json();

        message.textContent = data.message;

    } catch (error) {

        message.textContent =
            "Something went wrong.";

    }
});