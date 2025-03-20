import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate text from a single text input with streaming
export const generateTextStream = async (prompt, onChunkReceived) => {
  try {
    const result = await model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onChunkReceived(chunkText); // Callback to handle each chunk
    }
  } catch (error) {
    console.error("Error generating text stream:", error);
    return null;
  }
};

// Convert image URL to Base64
const convertImageUrlToBase64 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]);
      };
    });
  } catch (error) {
    console.error("Error converting image to Base64:", error);
    return null;
  }
};

// Generate text from image with streaming
export const generateTextFromImageStream = async (
  prompt,
  imageUrl,
  mimeType,
  onChunkReceived
) => {
  try {
    const base64Image = await convertImageUrlToBase64(imageUrl);
    if (!base64Image) throw new Error("Base64 conversion failed");

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };

    const result = await model.generateContentStream([prompt, imagePart]);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onChunkReceived(chunkText); // Callback to handle each chunk
    }
  } catch (error) {
    console.error("Error generating text from image stream:", error);
    return null;
  }
};

// Create a chat session with history
export const createChat = (history) => {
  return model.startChat({
    history: history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model", // Gemini expects "user" or "model"
      parts: [{ text: msg.text }],
    })),
  });
};

// Send a message in a chat session with streaming
export const sendMessageStream = async (chat, message, onChunkReceived) => {
  try {
    const result = await chat.sendMessageStream(message);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onChunkReceived(chunkText); // Callback to handle each chunk
    }
  } catch (error) {
    console.error("Error sending chat message stream:", error);
    return null;
  }
};

// Configure text generation with custom settings
export const generateTextWithConfig = async (prompt, imageUrl, config) => {
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }, { imageUrl }] }],
      generationConfig: config,
    });
    return result.response.text();
  } catch (error) {
    console.error("Error generating text with config:", error);
    return null;
  }
};

export default {
  generateTextStream,
  generateTextFromImageStream,
  createChat,
  sendMessageStream,
  generateTextWithConfig,
};
