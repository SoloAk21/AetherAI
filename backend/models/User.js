const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true }, // Unique Google ID
    name: { type: String, required: true }, // User's name
    email: { type: String, required: true, unique: true }, // User's email
    avatar: { type: String }, // URL to the user's avatar
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserChat" }], // Reference to chat history
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
