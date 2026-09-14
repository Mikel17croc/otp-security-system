# OTP Security System

A simple and secure One-Time Password (OTP) system built with **Node.js, Express, and JavaScript**.

This project was developed as part of a technical software development assessment. It includes both a REST API and a web-based frontend for sending, resending, and verifying OTPs.

---

## 🚀 Features

The system implements the following OTP security requirements:

* ✅ Generates exactly **6-digit OTPs**
* ✅ OTPs can contain a leading zero
* ✅ Prevents the same user from receiving the same OTP within **24 hours**
* ✅ Limits users to **3 OTP requests per hour**
* ✅ OTPs expire after **30 seconds**
* ✅ Resends the original OTP within a **5-minute resend window**
* ✅ Updates the OTP expiry time when resent
* ✅ Limits an OTP to a maximum of **3 resends**
* ✅ Only the latest OTP is valid
* ✅ Prevents an OTP from being used more than once
* ✅ Validates email addresses
* ✅ Validates OTP format
* ✅ Includes automated Jest tests
* ✅ Includes a simple web frontend for testing the API

---

## 🛠️ Technology Stack

### Backend

* Node.js
* Express.js
* JavaScript
* Node.js `crypto` module
* dotenv

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API

### Testing

* Jest

---

## 📁 Project Structure

```text
otp-security-system/
│
├── src/
│   ├── config.js
│   ├── otpService.js
│   ├── server.js
│   │
│   └── routes/
│       └── otpRoutes.js
│
├── public/
│   ├── index.html
│   ├── verify.html
│   ├── style.css
│   ├── app.js
│   └── verify.js
│
├── tests/
│   └── otp.test.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Configuration

The OTP rules can be configured using environment variables.

Example `.env`:

```env
PORT=3000
MAX_REQUESTS_PER_HOUR=3
OTP_EXPIRY_SECONDS=30
RESEND_WINDOW_MINUTES=5
MAX_RESENDS=3
OTP_HISTORY_HOURS=24
```

### Configuration Explanation

| Setting                 |  Value | Description                                  |
| ----------------------- | -----: | -------------------------------------------- |
| `PORT`                  | `3000` | Port used by the server                      |
| `MAX_REQUESTS_PER_HOUR` |    `3` | Maximum OTP requests per hour                |
| `OTP_EXPIRY_SECONDS`    |   `30` | OTP validity period                          |
| `RESEND_WINDOW_MINUTES` |    `5` | Time in which the original OTP can be resent |
| `MAX_RESENDS`           |    `3` | Maximum number of resends                    |
| `OTP_HISTORY_HOURS`     |   `24` | OTP uniqueness history period                |

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Mikel17croc/otp-security-system.git
```

### 2. Enter the project directory

```bash
cd otp-security-system
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create the environment file

Create a `.env` file in the root directory:

```env
PORT=3000
MAX_REQUESTS_PER_HOUR=3
OTP_EXPIRY_SECONDS=30
RESEND_WINDOW_MINUTES=5
MAX_RESENDS=3
OTP_HISTORY_HOURS=24
```

---

## ▶️ Running the Application

Start the server with:

```bash
npm start
```

The application will be available at:

```text
http://localhost:3000
```

For development with automatic restart:

```bash
npm run dev
```

---

## 🧪 Running Tests

Run the automated tests with:

```bash
npm test
```

Current test coverage includes:

```text
✓ should generate a 6 digit OTP
✓ should verify a valid OTP
✓ should reject an incorrect OTP
✓ OTP cannot be used twice
```

---

## 🔌 API Endpoints

### Send / Resend OTP

**POST**

```text
/api/otp/send
```

Request:

```json
{
  "email": "test@example.com"
}
```

Example response:

```json
{
  "success": true,
  "message": "OTP sent successfully.",
  "otp": "123456",
  "expiresAt": 1750000000000,
  "resent": false
}
```

> **Note:** The OTP is returned in the API response only for demonstration and assessment purposes. In a production system, the OTP should be delivered through an email or SMS service and should never be returned to the frontend.

---

### Verify OTP

**POST**

```text
/api/otp/verify
```

Request:

```json
{
  "email": "test@example.com",
  "otp": "123456"
}
```

Successful response:

```json
{
  "success": true,
  "message": "OTP verified successfully."
}
```

---

### Health Check

**GET**

```text
/api/health
```

Example response:

```json
{
  "success": true,
  "message": "OTP Security System is running."
}
```

---

## 🔐 OTP Security Logic

### 1. Six-Digit OTP

The system uses Node.js `crypto.randomInt()` to generate the OTP.

```javascript
crypto.randomInt(0, 1000000)
```

The number is converted into a six-character string:

```javascript
.toString().padStart(6, "0")
```

This means OTPs such as:

```text
012345
098765
123456
```

are valid.

---

### 2. OTP Uniqueness

Before creating a new OTP, the system checks the user's OTP history.

If the randomly generated OTP was already issued to that user within the previous 24 hours, another OTP is generated.

---

### 3. Request Rate Limiting

Each user has a record of their OTP request times.

The system removes requests older than one hour and checks the remaining requests.

If the user has already made 3 requests:

```text
Request 1 → Allowed
Request 2 → Allowed
Request 3 → Allowed
Request 4 → Rejected
```

---

### 4. OTP Expiration

Each OTP receives an expiration timestamp.

The default validity period is:

```text
30 seconds
```

After expiration, verification fails.

---

### 5. Resend Logic

If the user requests another OTP within the configured **5-minute resend window**, the system sends the existing OTP again instead of generating a new one.

The expiry time is refreshed.

Example:

```text
Initial OTP: 123456

Resend:
123456

New expiry:
30 seconds from resend
```

---

### 6. Maximum Resends

An OTP can only be resent **3 times**.

After reaching the resend limit, the system generates a new OTP when the resend window no longer permits the original OTP to be resent.

---

### 7. Latest OTP Only

When a new OTP is generated, it replaces the previous current OTP.

Therefore:

```text
Old OTP → Invalid
New OTP → Valid
```

This ensures that only the latest OTP can be verified.

---

### 8. One-Time Use

After successful verification, the OTP is marked as used and the current OTP is invalidated.

Therefore:

```text
First verification → Success
Second verification → Rejected
```

---

## 🧪 Manual Testing Checklist

The following scenarios should be tested before submission.

### Basic OTP

* [ ] Enter a valid email
* [ ] Send OTP
* [ ] Confirm OTP contains exactly 6 digits
* [ ] Verify the correct OTP

### Invalid OTP

* [ ] Enter an incorrect OTP
* [ ] Confirm verification fails

### OTP Reuse

* [ ] Successfully verify an OTP
* [ ] Try using the same OTP again
* [ ] Confirm it is rejected

### OTP Expiration

* [ ] Request an OTP
* [ ] Wait 30 seconds
* [ ] Try to verify it
* [ ] Confirm it has expired

### Resend

* [ ] Request an OTP
* [ ] Immediately request another OTP
* [ ] Confirm the same OTP is returned
* [ ] Confirm its expiry is refreshed

### Rate Limit

* [ ] Make 3 OTP requests
* [ ] Make a 4th request
* [ ] Confirm the request is rejected

### Latest OTP

* [ ] Generate a new OTP
* [ ] Try the previous OTP
* [ ] Confirm the previous OTP is invalid

---

## 🏗️ Architecture

The application follows a simple separation between the frontend, API, and OTP service.

```text
                FRONTEND
                    │
                    ▼
             EXPRESS API
                    │
                    ▼
              OTP SERVICE
                    │
                    ▼
              OTP STORE
```

### Frontend

Provides interfaces for:

* Sending an OTP
* Resending an OTP
* Verifying an OTP

### Express API

Handles HTTP requests and responses.

### OTP Service

Contains the main OTP security logic, including:

* Generation
* Expiration
* Resending
* Rate limiting
* Uniqueness
* Verification

### OTP Store

The current implementation uses an in-memory JavaScript `Map`.

---

## 💾 Data Storage

For simplicity, this assessment uses in-memory storage.

```javascript
const otpStore = new Map();
```

This is suitable for demonstrating the OTP logic but is **not recommended for production** because all data is lost when the server restarts.

A production implementation could use:

* Redis
* PostgreSQL
* MongoDB
* Another persistent database

Redis would be particularly suitable for OTPs because it supports expiration and fast temporary data storage.

---

## 🔒 Production Security Considerations

This project intentionally keeps the implementation simple for the technical assessment.

For a production system, additional security measures should be implemented:

* Hash OTPs before storing them
* Never return OTPs through API responses
* Send OTPs using an email/SMS provider
* Use persistent or distributed storage such as Redis
* Add IP-based rate limiting
* Add request logging and monitoring
* Use HTTPS
* Add stronger email validation
* Protect against automated abuse
* Add audit logging
* Avoid exposing sensitive OTP information in logs

---

## 🎯 Assessment Requirements

| Requirement                          | Implementation |
| ------------------------------------ | -------------- |
| 6-digit OTP                          | ✅              |
| OTP can start with 0                 | ✅              |
| No duplicate OTP within 24 hours     | ✅              |
| Maximum 3 requests/hour              | ✅              |
| OTP expires after 30 seconds         | ✅              |
| Resend original OTP within 5 minutes | ✅              |
| Maximum 3 resends                    | ✅              |
| Only latest OTP valid                | ✅              |
| OTP cannot be reused                 | ✅              |
| Send OTP frontend                    | ✅              |
| Verify OTP frontend                  | ✅              |
| Node.js API                          | ✅              |
| Automated tests                      | ✅              |

---

## 👨‍💻 Author

**Mhlengi Ngwenya**

Junior Full Stack AI Engineer / Digital Skills Trainer

South Africa

---

## 📌 Project Status

**Completed for technical assessment**

The project demonstrates a functional OTP security system with a Node.js/Express API, frontend interface, OTP security rules, and automated tests.
live URL: https://otp-security-system.vercel.app/