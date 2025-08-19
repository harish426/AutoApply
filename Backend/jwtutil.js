const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "access_secret_key";
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || "refresh_secret_key";

function generateAccessToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m", // 15 minutes
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // 7days
  });
}

function verifyAccessToken(token) {
  try {
    //console.log(ACCESS_TOKEN_SECRET);
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (err) {
    console.error("Access token verification failed:", err.message);
    return null;
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.error("Refresh token verification failed:", err.message);
    return null;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
