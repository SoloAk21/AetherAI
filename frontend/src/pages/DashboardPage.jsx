import React, { useEffect, useRef, useState } from "react";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";
import ChatInput from "../components/dashboard/ChatInput";
import ChatInterface from "./ChatInterface";
import ButtonGradient from "../assets/svg/ButtonGradient";
import {
  generateTextStream,
  generateTextFromImageStream,
  createChat,
  sendMessageStream,
} from "../utils/geminiAI";
import { getMimeType } from "../utils/usage";
import {
  getChatMessages,
  saveMessage,
  getChatById,
  createUserChat,
} from "../utils/chatAPI";

const DashboardPage = () => {
  const [openNavigation, setOpenNavigation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatSession, setChatSession] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Fetch user data from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  // Fetch chats for the user
  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        try {
          const fetchedChats = await getChatMessages(user.id);
          setChats(fetchedChats);

          if (fetchedChats.length === 0) {
            const newChat = await createUserChat(user.id);
            setChats([newChat]);
            setSelectedChatId(newChat._id); // Automatically select the new chat
          } else if (!selectedChatId) {
            setSelectedChatId(fetchedChats[0]._id); // Select the first chat by default
          }
        } catch (error) {
          console.error("Error fetching chats:", error);
        }
      }
    };
    fetchChats();
  }, [user]);

  // Fetch messages for the selected chat and initialize chat session
  useEffect(() => {
    const fetchSelectedChatMessages = async () => {
      if (selectedChatId) {
        try {
          const chat = await getChatById(selectedChatId);
          setMessages(chat.messages);

          // Initialize chat session with history
          const session = createChat(chat.messages);
          setChatSession(session);
        } catch (error) {
          console.error("Error fetching selected chat messages:", error);
        }
      }
    };
    fetchSelectedChatMessages();
  }, [selectedChatId]);

  // Handle new chat creation
  const handleNewChat = async () => {
    if (!user) return;

    try {
      // Check if there is already an empty chat
      const emptyChat = chats.find((chat) => chat.messages.length === 0);

      if (emptyChat) {
        // If an empty chat exists, select it
        setSelectedChatId(emptyChat._id);
        setMessages([]);
        setChatSession(null); // Reset chat session for the empty chat
      } else {
        // If no empty chat exists, create a new one
        const newChat = await createUserChat(user.id);
        setChats((prevChats) => [newChat, ...prevChats]);
        setSelectedChatId(newChat._id);
        setMessages([]);
        setChatSession(null); // Reset chat session for the new chat
      }
    } catch (error) {
      console.error("Error creating a new chat:", error);
    }
  };

  // Toggle sidebar navigation
  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpenNavigation(false);
        enablePageScroll();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle text generation
  const handleGenerateText = async () => {
    if (!inputValue.trim() && !uploadedImage) return;
    setLoading(true);

    const userMessage = {
      chatId: selectedChatId,
      message: {
        role: "user",
        text: inputValue,
        image: uploadedImage?.url || null,
      },
    };

    const botMessage = {
      chatId: selectedChatId,
      message: {
        role: "bot",
        text: "", // Bot message will be filled later
        image: null,
      },
    };

    // Update local messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage.message,
      botMessage.message,
    ]);

    let accumulatedText = ""; // Accumulate chunks here

    const onChunkReceived = (chunkText) => {
      accumulatedText += chunkText; // Append chunk to accumulated text
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        lastMessage.text = accumulatedText; // Update the last message with the accumulated text
        return [...prevMessages.slice(0, -1), lastMessage];
      });
    };

    try {
      if (uploadedImage) {
        await generateTextFromImageStream(
          inputValue,
          uploadedImage.url,
          getMimeType(uploadedImage.name),
          onChunkReceived
        );
      } else if (chatSession) {
        await sendMessageStream(chatSession, inputValue, onChunkReceived);
      } else {
        await generateTextStream(inputValue, onChunkReceived);
      }

      // Save messages to the backend
      if (user) {
        await saveMessage(userMessage);
        await saveMessage(botMessage);
      }
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setInputValue("");
      setUploadedImage(null);
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="absolute inset-0 bg-cover bg-center">
      <Header
        openNavigation={openNavigation}
        toggleNavigation={toggleNavigation}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 relative bg-gradient-to-r bg-n-8">
        <Sidebar
          chats={chats}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          handleNewChat={handleNewChat}
          openNavigation={openNavigation}
          setOpenNavigation={setOpenNavigation}
          ref={sidebarRef}
        />

        {openNavigation && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-0"
            onClick={toggleNavigation}
          ></div>
        )}

        <main
          className="flex-1 flex flex-col z-20 relative text-white overflow-y-auto"
          style={{ height: "calc(100vh - 8rem)" }}
        >
          <ChatInterface messages={messages} />
        </main>
      </div>

      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        uploadedImage={uploadedImage}
        onUploadSuccess={(response) => {
          setUploadedImage(response);
        }}
        onUploadError={(error) => {
          console.error("Upload error:", error);
          alert("File upload failed. Please try again.");
        }}
        removeImage={() => setUploadedImage(null)}
        handleGenerateText={handleGenerateText}
      />

      <ButtonGradient />
    </div>
  );
};

export default DashboardPage;
