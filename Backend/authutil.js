const User = require("./models/User");
const { generateAccessToken, generateRefreshToken } = require("./jwtutil");

/**
 * Google-style login (email + name only)
 */
async function userLogin(req, res) {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required." });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, name });
      console.log("New user created:", user);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200).json({
      message: "Login successful.",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  userLogin,
};
