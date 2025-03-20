import React, { useEffect, useRef, useState } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import AttachmentSvg from "../../assets/svg/AttachmentSvg";
import ArrowUpShortSvg from "../../assets/svg/ArrowUpShortSvg";

const ChatInput = ({
  inputValue,
  setInputValue,
  uploadedImage,
  onUploadSuccess,
  onUploadError,
  removeImage,
  handleGenerateText,
}) => {
  const textareaRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false); // Track upload loading state
  const [isSending, setIsSending] = useState(false); // Track send loading state

  // Adjust textarea height dynamically
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    adjustTextareaHeight();
  };

  // Handle image upload start
  const handleUploadStart = () => {
    setIsUploading(true); // Set upload loading state to true
  };

  // Handle image upload success
  const handleUploadSuccess = (response) => {
    setIsUploading(false); // Set upload loading state to false
    onUploadSuccess(response); // Handle upload success
  };

  // Handle image upload error
  const handleUploadError = (error) => {
    setIsUploading(false); // Set upload loading state to false
    onUploadError(error); // Handle upload error
  };

  // Handle send button click
  const handleSend = async () => {
    if (!inputValue.trim() && !uploadedImage) return; // Prevent empty sends
    setIsSending(true); // Set send loading state to true
    await handleGenerateText(); // Trigger text generation
    setIsSending(false); // Set send loading state to false
  };

  // Clear input value when sending
  useEffect(() => {
    if (isSending) {
      setInputValue(""); // Clear the input value
    }
  }, [isSending, setInputValue]);

  return (
    <div className="fixed z-30 bottom-0 left-0 md:left-72 right-0 p-4 hover:cursor-pointer hover:z-50">
      <div className="flex relative items-end space-x-2 max-w-2xl mx-auto">
        <IKContext
          urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
          publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
          authenticator={async () => {
            const response = await fetch(
              "http://localhost:5000/api/auth/imagekit-auth"
            );
            const data = await response.json();
            return data;
          }}
        >
          <div className="absolute right-1">
            {/* File Upload Button */}
            <IKUpload
              fileName="test-upload.png"
              onError={handleUploadError}
              onSuccess={handleUploadSuccess}
              onUploadStart={handleUploadStart}
              className="hidden"
              id="fileUpload"
            />

            {/* Attachment Button */}
            <button
              className="p-2"
              onClick={() => document.getElementById("fileUpload").click()}
              disabled={isUploading || isSending} // Disable during upload or send
            >
              {isUploading ? ( // Show spinner only during upload
                <div className="animate-spin w-5 h-5 border-2 border-color-1 border-t-transparent rounded-full"></div>
              ) : (
                <AttachmentSvg className="w-5 h-5" />
              )}
            </button>

            {/* Send Button */}
            <button
              className="p-1 bg-color-1 rounded-full hover:bg-color-1/70 transition-colors"
              onClick={handleSend}
              disabled={
                isSending ||
                isUploading ||
                (!inputValue.trim() && !uploadedImage)
              } // Disable during send, upload, or if no input
            >
              {isSending ? ( // Show spinner only during send
                <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <ArrowUpShortSvg className="w-6 h-6" />
              )}
            </button>
          </div>
        </IKContext>

        {/* Textarea for Input */}
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
          rows={1}
          style={{ maxHeight: "150px" }}
          className={`flex-1 h-full bg-n-8 px-4 py-2 pr-20 border border-n-6 rounded-3xl text-n-1 focus:outline-none placeholder:text-n-2/50 placeholder:text-sm placeholder:font-code focus:ring-1 focus:ring-color-1/50 resize-none overflow-hidden ${
            isUploading || isSending ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isUploading || isSending} // Disable during upload or send
        />

        {/* Uploaded Image Preview */}
        {uploadedImage && (
          <div className="absolute top-[-48px] left-2 group">
            <img
              src={uploadedImage.url}
              alt="Uploaded"
              className="w-12 h-12 rounded-md object-cover bg-conic-gradient"
            />
            <button
              onClick={removeImage}
              className="absolute top-0 right-0 bg-color-3 text-white rounded-full px-[6px] py-[2px] text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              X
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
