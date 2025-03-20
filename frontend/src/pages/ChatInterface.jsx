import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown
import rehypeHighlight from "rehype-highlight"; // For syntax highlighting
import rehypeMathjax from "rehype-mathjax"; // For rendering LaTeX expressions
import "highlight.js/styles/github-dark.css"; // Syntax highlighting theme
import { CopyIcon, EditIcon } from "../assets/chat/Icons"; // Custom icons for copy and edit

function ChatInterface({ messages }) {
  const [copiedIndex, setCopiedIndex] = useState(null); // Track which message's copy button was clicked
  const messagesEndRef = useRef(null); // Ref for the end of the messages container
  const chatContainerRef = useRef(null); // Ref for the chat container

  // Function to copy text to clipboard
  const copyToClipboard = (text, index) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      })
      .catch(() => alert("Failed to copy text."));
  };

  // Automatically scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Trigger this effect whenever `messages` changes

  // Scroll to the bottom on initial render
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="h-full flex flex-col justify-between">
      <div
        className="overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 200px)" }}
        ref={chatContainerRef}
      >
        <div className="text-white font-thin font-sans p-4">
          <div className={`container mx-auto max-w-4xl`}>
            {/* Chat Messages */}
            <div className="space-y-8">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "max-w-2xl" : ""}`}
                >
                  <div
                    className={`flex-1 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  ></div>
                  <div
                    className={`rounded-2xl lg:w-auto shadow-md leading-loose text-sm relative
                        ${
                          msg.role === "user"
                            ? "bg-n-7 border px-2 py-1 border-n-5 text-white"
                            : "bg-n-8 p-4 pb-8 border rounded-lg border-n-6"
                        }`}
                  >
                    {/* Render Image if it exists */}
                    {msg.image && (
                      <div className="mb-2">
                        <img
                          src={msg.image}
                          alt="User attached"
                          className="w-48 h-48 object-cover rounded-md"
                        />
                      </div>
                    )}

                    {/* Render Markdown Content */}
                    {msg.role === "user" ? (
                      <div className="whitespace-pre-wrap pt-1">{msg.text}</div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight, rehypeMathjax]}
                        components={{
                          // Customize rendering for specific Markdown elements
                          strong: ({ node, ...props }) => (
                            <strong className="font-bold" {...props} />
                          ),
                          em: ({ node, ...props }) => (
                            <em className="italic" {...props} />
                          ),
                          code: ({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) => {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );

                            return !inline && match ? (
                              <div className="relative">
                                <button
                                  onClick={() =>
                                    copyToClipboard(String(children), index)
                                  }
                                  className="absolute top-2 right-2 p-1 hover:bg-n-5 rounded"
                                  title="Copy Code"
                                >
                                  <CopyIcon className="w-4 h-4" />
                                </button>
                                {copiedIndex === index && (
                                  <span className="absolute top-2 right-10 text-sm text-gray-300">
                                    Copied!
                                  </span>
                                )}
                                {/* Language Display */}
                                <div className="absolute top-[-5px] left-4 text-xs text-white px-2 py-1 rounded">
                                  {match[1]}
                                </div>
                                <pre className="bg-n-5 p-4 rounded-lg my-2 whitespace-pre-wrap">
                                  <code
                                    className={`hljs language-${match[1]}`}
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                </pre>
                              </div>
                            ) : (
                              <code
                                className="bg-n-5 px-1 py-0.5 rounded text-sm whitespace-pre-wrap"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          a: ({ node, ...props }) => (
                            <a
                              className="text-color-1 hover:underline"
                              {...props}
                            />
                          ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              className="border-l-4 border-n-5 pl-4 my-2 italic text-gray-300"
                              {...props}
                            />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-6 my-2" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal pl-6 my-2" {...props} />
                          ),
                          table: ({ node, ...props }) => (
                            <table
                              className="w-full border-collapse border border-n-5 my-2"
                              {...props}
                            />
                          ),
                          th: ({ node, ...props }) => (
                            <th
                              className="border border-gray-500 px-4 py-2 bg-n-5"
                              {...props}
                            />
                          ),
                          td: ({ node, ...props }) => (
                            <td
                              className="border border-gray-500 px-4 py-2"
                              {...props}
                            />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="my-2" {...props} />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    )}

                    {/* Copy and Edit Buttons for AI Responses */}
                    <div
                      className={`absolute ${
                        msg.role === "user"
                          ? "bg-n-5 rounded-md text-xs bottom-[-18px] right-2"
                          : "left-0"
                      } flex space-x-2`}
                    >
                      {msg.role !== "user" && (
                        <button
                          onClick={() => copyToClipboard(msg.text, index)}
                          className="p-1 hover:bg-n-6 rounded"
                          title="Copy Response"
                        >
                          <CopyIcon className="w-4 h-4" />
                        </button>
                      )}
                      {copiedIndex === index && (
                        <span className="text-sm text-gray-300">Copied!</span>
                      )}
                      <button
                        onClick={() =>
                          alert("Edit functionality not implemented yet.")
                        }
                        className="px-1 hover:bg-n-6 rounded"
                        title="Edit Response"
                        disabled={msg.role !== "user"} // Disable if not a user message
                      >
                        {msg.role !== "user" ? (
                          <EditIcon className="w-4 h-4" />
                        ) : (
                          "Edit"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Invisible div to mark the end of messages */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
