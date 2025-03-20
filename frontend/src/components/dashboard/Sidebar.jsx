import React, { useEffect } from "react";
import NewChatSvg from "../../assets/svg/NewChat";

const Sidebar = ({
  chats,
  selectedChatId,
  setSelectedChatId,
  handleNewChat,
  openNavigation,
  setOpenNavigation,
}) => {
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  // Sort chats by creation date (most recent first)
  const sortedChats = [...chats].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Close sidebar when a chat is selected
  const handleChatSelection = (chatId) => {
    setSelectedChatId(chatId);
    setOpenNavigation(false);
  };

  return (
    <aside
      className={`w-64 p-4 z-50 fixed md:relative transform transition-transform duration-200 ease-in-out bg-n-8 h-[calc(100vh-4rem)] overflow-y-auto styled-scrollbar ${
        openNavigation ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div>
        <div
          className="flex items-center justify-center gap-2 w-32 bg-n-6 py-2 rounded-[1rem] cursor-pointer"
          onClick={() => {
            handleNewChat();
            setOpenNavigation(false);
          }}
        >
          <div className="relative">
            <NewChatSvg className="" />
            <span className="absolute top-[-0.5rem] right-0 text-xl">+</span>
          </div>
          <span className="text-sm text-n-1">New Chat</span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-xs font-semibold text-n-2 uppercase mb-2">Chats</h3>
        <nav>
          {sortedChats.map((chat) => {
            // Check if messages exist and are non-empty
            const firstMessage =
              chat.messages.length > 0 ? chat.messages[0].text : "No messages";
            return (
              <div
                key={chat._id}
                className={`block py-2 px-4 text-sm body-2 text-n-3 hover:bg-n-5 rounded-sm transition-colors ${
                  selectedChatId === chat._id ? "bg-n-7" : ""
                }`}
                onClick={() => handleChatSelection(chat._id)}
              >
                {truncateText(firstMessage, 20)}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
