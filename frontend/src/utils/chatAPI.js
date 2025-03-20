import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Unified function for API calls
const apiCall = async (method, endpoint, data = null) => {
  try {
    console.log(data);

    const response = await axios[method](`${API_URL}/${endpoint}`, data);
    console.log(
      `Response from ${method} request to ${endpoint}:`,
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(`Error in ${method} request to ${endpoint}:`, error);
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

// Create a new chat
export const createUserChat = (userId) =>
  apiCall("post", "create-chat", { userId });

// Get all chats for a user
export const getChatMessages = (userId) =>
  apiCall("get", `get-chats/${userId}`);

// Get a single chat by chatId
export const getChatById = (chatId) => apiCall("get", `get-chat/${chatId}`);

// Save a message to a specific chat
export const saveMessage = (messageData) =>
  apiCall("post", "save-chat", messageData);

// Named exports for all functions
export default { createUserChat, getChatMessages, getChatById, saveMessage };
