# README.md

# Auto Apply — Resume/Profile API

A simple Express + MongoDB backend to register users (Google-style email+name), save user profiles with an uploaded resume (stored in MongoDB as binary), and download resumes.

## Quick overview

- Node.js + Express server
- MongoDB (local or Atlas)
- File uploads handled by `multer` (memory storage)
- JWT for authentication (access & refresh tokens)

## Prerequisites

- Node.js (LTS recommended, e.g. v18 or later)
- npm (comes with Node) or yarn
- MongoDB running locally or a MongoDB Atlas connection string
- (Optional) Docker (if you want to run MongoDB via Docker)

## Project structure (important files)

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

## Environment variables

Create a `.env` file in the project root with values like:

PORT=3000
MONGO_URI=mongodb://localhost:27017/autodoc
JWT_SECRET=your_access_token_secret_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here

> **Important**: Use strong random strings for `JWT_SECRET` and `JWT_REFRESH_SECRET` in production.

## Install & run (step-by-step)

1. Clone the repository (or put code in a folder):

````bash
git clone https://github.com/harish426/AutoApply.git
cd my-autoapply

2. Install dependencies:

```bash
# using npm
npm install express body-parser mongoose

npm install multer

npm install jsonwebtoken

npm install bcrypt

npm install pdf-parse mammoth

# optional dev tools
npm install --save-dev nodemon

# OR using yarn
yarn add express body-parser mongoose multer jsonwebtoken dotenv
yarn add --dev nodemon
````

3. (If you don't have MongoDB running) start MongoDB:

- **Locally**: make sure `mongod` is running
- **Docker** (quick):

```bash
docker run -d -p 27017:27017 --name mongo mongo:6.0
```

4. Create `.env` (see above) and add your values.

5. Add scripts to `package.json` (example):

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

6. Start the server:

```bash
# production
npm start

# development (auto-restart)
npm run dev
```

Server should log: `Server running at http://localhost:3000`

## API endpoints & examples

> Base URL: `http://localhost:3000`

### 1) Login (generate tokens)

**POST** `/login`
Content-Type: `application/json`
Body:

```json
{ "email": "user@example.com", "name": "User Name" }
```

**Example (curl)**:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

Response contains `accessToken`, `refreshToken`, and `user`.

### 2) Save profile (protected + file upload)

**POST** `/profile/:email`
Headers:

- `Authorization: Bearer <accessToken>`
  Body: `multipart/form-data`
- File field name: `resume` (PDF or DOCX)
- Other text fields: send as individual form fields (e.g. `phone`, `summary`, etc.)

**Example (curl)**:

```bash
TOKEN="<access_token_from_login>"

curl -X POST "http://localhost:3000/profile/test@example.com" \
  -H "Authorization: Bearer $TOKEN" \
  -F "resume=@/path/to/resume.pdf" \
  -F "phone=1234567890" \
  -F "summary=Experienced developer"
```

Notes:

- The server uses `multer.memoryStorage()` so `req.file.buffer` will contain the file bytes and the profile is saved with:

  ```js
  profile.resume = {
    data: req.file.buffer,
    contentType: req.file.mimetype,
    filename: req.file.originalname,
  };
  ```

- If you send a string URL as `resume` (e.g. `"https://.../resume.pdf"`), Mongoose may throw:
  `Cast to Object failed for value "https://..." at path "resume"`. Use file upload or change schema to accept URL.

### 3) Download resume (protected)

**GET** `/download/:email`
Headers:

- `Authorization: Bearer <accessToken>`

**Example (curl)**:

```bash
TOKEN="<access_token_from_login>"
curl -X GET "http://localhost:3000/download/test@example.com" \
  -H "Authorization: Bearer $TOKEN" \
  -o downloaded_resume.pdf
```

## Helpful tips & testing

- In Postman:

  - For login: `POST /login`, JSON body.
  - For profile upload: set Authorization -> Bearer Token (paste accessToken), choose form-data and add `resume` as File type.

- If you get **"No document found"** on download, check that `profile.resume` exists in MongoDB and has `data` and `filename`.

## Common issues & fixes

### 1. `JWT malformed` or `Access token required.`

- Make sure you send header exactly as:
  `Authorization: Bearer <accessToken>`
  Example:

  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...

- Current `authmiddleware.js` uses `authHeader.slice(7, authHeader.length)` which assumes `authHeader` exists and starts with `'Bearer '`; if header is missing, this will throw. Recommended robust extraction:

```js
// safer alternative for authmiddleware.js
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ error: "Access token required." });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ error: 'Authorization header malformed. Use "Bearer <token>"' });
  }
  const token = parts[1];

  const decoded = verifyAccessToken(token);
  if (!decoded)
    return res.status(403).json({ error: "Invalid or expired token." });

  req.user = decoded;
  next();
}
```

### 2. `Cast to Object failed for value "https://..." (type string) at path "resume"`

- Your schema expects `resume` to be an object `{ data, contentType, filename }`. If you want to store a URL instead, change schema or use a separate field like `resumeUrl` (string).

### 3. CORS / Preflight errors (browser requests)

- Ensure server allows `Authorization` header. Update `app.js` middleware:

```js
res.header(
  "Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization"
);
res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
if (req.method === "OPTIONS") return res.sendStatus(200);
```

### 4. Memory usage when uploading large files

- `multer.memoryStorage()` keeps uploads in RAM; for large files or production, use `diskStorage` or upload directly to cloud (S3) and store URL in DB.

---

## Production suggestions

- Use HTTPS.
- Use strong secrets and rotate them.
- Use a persistent file store (S3, GCS) for resumes instead of DB for large-scale apps.
- Add rate limiting, logging, and proper error reporting.
- Validate file size and enforce limits in `multer` config:

```js
multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB
```

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

---

## Troubleshooting checklist

- Is MongoDB running and `MONGO_URI` correct?
- Does `.env` exist and loaded? (If you use `dotenv`, require it in `app.js`.)
- Are you passing the `Authorization` header exactly as `Bearer <token>`?
- When using `curl` with file upload, use `-F` to send multipart/form-data.
- Check server logs for stack traces; `console.error` outputs helpful messages.
