// authMiddleware.js
const { verifyAccessToken } = require("./jwtutil");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  //console.log("Auth header received:", authHeader);
  const token = authHeader.slice(7, authHeader.length).trim();
  //console.log("Token extracted:", token);

  if (!token) {
    return res.status(401).json({ error: "Access token required." });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }

  req.user = decoded; // attach decoded payload (id, email)
  next();
}

module.exports = authenticateToken;
