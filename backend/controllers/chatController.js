const Chat = require("../models/Chat.js");

// Create chat controller
const createChat = async (req, res) => {
  try {
    const chat = new Chat({ userId: req.body.userId, messages: [] });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Save a single message to a specific chat
const saveChat = async (req, res) => {
  try {
    const { chatId, message } = req.body;

    // Find the chat by its ID and push the new message into the messages array
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: message } }, // Add the new message to the messages array
      { new: true } // Return the updated document
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json(chat); // Return the updated chat
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return the error message
  }
};

// Get chat messages by user ID
const getChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ userId });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single chat by chatId
const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Find the chat by its ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { saveChat, getChats, createChat, getChatById };
