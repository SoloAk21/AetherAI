const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "bot"], required: true }, // Role of the message sender
  text: { type: String, required: true },
  image: { type: String },
  timestamp: { type: Date, default: Date.now }, // Timestamp of the message
});

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to the user
    messages: [messageSchema], // Array of messages
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
