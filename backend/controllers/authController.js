const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User.js");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Google JWT Token and create/authenticate user
const googleAuth = async (req, res) => {
  const { credential } = req.body;

  try {
    // Verify the JWT token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, name, email, picture: avatar } = payload;

    // Find or create the user
    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({ googleId, name, email, avatar });
      await user.save();
    }

    // Generate a JWT for your app
    const token = jwt.sign(
      { id: user._id, email: user.email, picture: user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Google authentication failed:", error);
    res.status(500).json({ error: "Google authentication failed" });
  }
};

module.exports = { googleAuth };
