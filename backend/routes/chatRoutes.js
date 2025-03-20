const express = require("express");
const router = express.Router();
const {
  saveChat,
  getChats,
  createChat,
  getChatById,
} = require("../controllers/chatController.js");

// Save chat route
router.post("/save-chat", saveChat);

// Get chats route
router.get("/get-chats/:userId", getChats);

// Get a single chat by chatId
router.get("/get-chat/:chatId", getChatById);

// Create chat route
router.post("/create-chat", createChat);

module.exports = router;
