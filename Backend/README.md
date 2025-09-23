# Auto Apply — Resume/Profile API

A simple Express + MongoDB backend to register users (Google-style email+name), save user profiles with an uploaded resume (stored in MongoDB as binary), and download resumes.
Now also includes job application management (save, fetch, delete).

---

## Quick overview

- Node.js + Express server
- MongoDB (local or Atlas)
- File uploads handled by `multer` (memory storage)
- JWT for authentication (access & refresh tokens)

---

## Prerequisites

- Node.js (LTS recommended, e.g. v18 or later)
- npm (comes with Node) or yarn
- MongoDB running locally or a MongoDB Atlas connection string
- (Optional) Docker (if you want to run MongoDB via Docker)

---

## Project structure (important files)

```
.
├─ app.js
├─ api.js
├─ authutil.js
├─ authmiddleware.js
├─ jwtutil.js
├─ middleware.js
├─ profilehandller.js
├─ upload.js
├─ uploadutils.js
├─ models/
│ ├─ User.js
│ └─ userprofile.js
└─ package.json
```

---

## Environment variables

Create a `.env` file in the project root:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/autodoc
JWT_SECRET=your_access_token_secret_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here
```

> Use strong random strings for `JWT_SECRET` and `JWT_REFRESH_SECRET` in production.

---

## Install & run (step-by-step)

1. Clone the repository:

```bash
git clone https://github.com/harish426/AutoApply.git
cd AutoApply
```

2. Install dependencies:

```bash
npm install express body-parser mongoose multer jsonwebtoken bcrypt pdf-parse mammoth dotenv
npm install --save-dev nodemon
```

or using yarn:

```bash
yarn add express body-parser mongoose multer jsonwebtoken dotenv
yarn add --dev nodemon
```

3. Start MongoDB:

- **Locally**: make sure `mongod` is running
- **Docker**:

```bash
docker run -d -p 27017:27017 --name mongo mongo:6.0
```

4. Add `.env` with your configuration.

5. Add scripts to `package.json`:

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

6. Start the server:

```bash
npm start        # production
npm run dev      # development with auto-restart
```

Server should log: `Server running at http://localhost:3000`

---

## API Endpoints & Examples

> Base URL: `http://localhost:3000`

---

### 1) Login (generate tokens)

**POST** `/login`
Content-Type: `application/json`
Body:

```json
{ "email": "user@example.com", "name": "User Name" }
```

**Example (curl):**

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

Response contains `accessToken`, `refreshToken`, and `user`.

---

### 2) Save Profile (with resume upload)

**POST** `/profile/:email`
Headers:

- `Authorization: Bearer <accessToken>`

Body: `multipart/form-data`

- File field: `resume` (PDF/DOCX)
- Other fields: e.g., `phone`, `summary`

**Example (curl):**

```bash
TOKEN="<access_token_from_login>"

curl -X POST "http://localhost:3000/profile/test@example.com" \
  -H "Authorization: Bearer $TOKEN" \
  -F "resume=@/path/to/resume.pdf" \
  -F "phone=1234567890" \
  -F "summary=Experienced developer"
```

- The server uses `multer.memoryStorage()` → `req.file.buffer` stores the file in MongoDB.
- Sending a string URL instead of a file will throw `Cast to Object failed`. Use `resumeUrl` or change schema.

---

### 3) Download Resume

**GET** `/download/:email`
Headers:

- `Authorization: Bearer <accessToken>`

**Example (curl):**

```bash
TOKEN="<access_token_from_login>"

curl -X GET "http://localhost:3000/download/test@example.com" \
  -H "Authorization: Bearer $TOKEN" \
  -o downloaded_resume.pdf
```

---

### 4) Fetch Profile (exclude binary resume)

**GET** `/api/profile/:email`

**Example:**

```bash
curl -X GET http://localhost:3000/api/profile/test@example.com
```

**Response:**

```json
{
  "message": "Profile fetched successfully",
  "user": {
    "id": "64f9c12a1f8a0c89d1e4a7c1",
    "email": "test@example.com",
    "name": "Test User"
  },
  "profile": {
    "phone": "1234567890",
    "summary": "Experienced developer",
    "resume": {
      "filename": "resume.pdf",
      "contentType": "application/pdf",
      "parsedData": {
        "rawText": "This is the extracted text from resume...",
        "metadata": { "title": "My Resume", "author": "Test User" }
      }
    }
  }
}
```

---

## 🔹 Resume Schema Example (MongoDB)

```js
const resumeSchema = new mongoose.Schema({
  data: Buffer, // binary (excluded in GET)
  contentType: String,
  filename: String,
  parsedData: {
    rawText: String,
    metadata: Object,
  },
});
```

---

## 5) Job Application APIs

These APIs allow users to **save**, **fetch**, and **delete rejected** job applications.

---

#### a) Save Job Application

**POST** `/job/:email`
Headers: `Authorization: Bearer <accessToken>`
Body: `multipart/form-data`

- File field: `resume` (optional)
- Other fields: `jobTitle`, `company`, `status`

**Example:**

```bash
curl -X POST "http://localhost:3000/job/test@example.com" \
  -H "Authorization: Bearer $TOKEN" \
  -F "resume=@/path/to/resume.pdf" \
  -F "jobTitle=Software Engineer" \
  -F "company=Acme Corp" \
  -F "status=Applied"
```

**Behavior:**

- Creates a new application or updates existing one for the same user.
- Stores uploaded resume binary and metadata.

**Response:**

```json
{
  "message": "Job application saved successfully",
  "jobApplication": {
    "_id": "64f9c12a1f8a0c89d1e4a7c2",
    "user": "64f9c12a1f8a0c89d1e4a7c1",
    "jobTitle": "Software Engineer",
    "company": "Acme Corp",
    "status": "Applied",
    "customResume": {
      "filename": "resume.pdf",
      "contentType": "application/pdf"
    }
  }
}
```

---

#### b) Fetch Saved Job Applications

**GET** `/savedjob/:email`
Headers: `Authorization: Bearer <accessToken>`

**Example:**

```bash
curl -X GET "http://localhost:3000/savedjob/test@example.com" \
  -H "Authorization: Bearer $TOKEN"
```

**Behavior:**

- Fetches all applications for the user.
- Excludes binary resume data for lighter responses.
- Groups applications by status: `Applied`, `Rejected`, `Liked`.

**Response:**

```json
{
  "message": "Job applications fetched and grouped successfully",
  "applications": {
    "applied": [
      {
        "jobTitle": "Software Engineer",
        "company": "Acme Corp",
        "status": "Applied"
      }
    ],
    "rejected": [
      {
        "jobTitle": "Backend Developer",
        "company": "Beta Inc",
        "status": "Rejected"
      }
    ],
    "liked": [
      {
        "jobTitle": "Frontend Developer",
        "company": "Gamma LLC",
        "status": "Liked"
      }
    ]
  }
}
```

---

#### c) Delete Rejected Job Applications

**DELETE** `/deleteapp/:email`
Headers: `Authorization: Bearer <accessToken>`

**Example:**

```bash
curl -X DELETE "http://localhost:3000/deleteapp/test@example.com" \
  -H "Authorization: Bearer $TOKEN"
```

**Behavior:**

- Deletes **all rejected applications** for the user.
- Other applications remain untouched.

**Response:**

```json
{
  "message": "2 rejected applications deleted successfully"
}
```

---

## ✅ Notes

- `customResume.data` is **never returned** in fetch API responses.
- Save API supports **file upload** or **resume URL**.
- Job applications require authentication via `Bearer token`.
- Fetching groups applications by `status`.
- Deletion only removes rejected applications.

---

## Troubleshooting / Common Issues

- **JWT malformed / missing:** Make sure header is `Authorization: Bearer <accessToken>`
- **Cast to Object failed for resume URL:** Use file upload or modify schema for URL.
- **CORS / Preflight:** Ensure `Authorization` header is allowed.
- **Memory usage:** `multer.memoryStorage()` keeps files in RAM; for large files, consider disk storage or cloud.

---

## Production Suggestions

- Use HTTPS, strong secrets, and rotate tokens.
- Store resumes in cloud storage for large-scale apps.
- Enforce file size limits in `multer`.
- Add logging, rate limiting, and proper error handling.

---

## Example `package.json` (minimal)

```json
{
  "name": "autoapply",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "body-parser": "^1.20.0",
    "dotenv": "^16.0.0",
    "express": "^4.18.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.0",
    "multer": "^1.4.5"
  },
  "devDependencies": {
    "nodemon": "^2.0.0"
  }
}
```
