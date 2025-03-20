// src/pages/UploadPage.js
import React from "react";
import { IKContext, IKUpload } from "imagekitio-react";

const UploadPage = () => {
  const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT; // Replace with your ImageKit URL endpoint
  const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY; // Replace with your ImageKit public key

  // Authenticator function to fetch authentication parameters from your backend
  const authenticator = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/imagekit-auth"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch authentication parameters");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  // Handle upload success
  const onSuccess = (response) => {
    console.log("Upload successful:", response);
    alert("File uploaded successfully!");
  };

  // Handle upload error
  const onError = (error) => {
    console.error("Upload error:", error);
    alert("File upload failed. Please try again.");
  };

  return (
    <div className="upload-page">
      <h1>Upload Image</h1>
      <IKContext
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
      >
        <IKUpload
          fileName="test-upload.png" // Optional: Set a custom file name
          onError={onError}
          onSuccess={onSuccess}
          tags={["sample-tag"]} // Optional: Add tags to the uploaded file
          customCoordinates="10,10,10,10" // Optional: Set custom coordinates for cropping
          isPrivateFile={false} // Optional: Set to true for private files
          useUniqueFileName={true} // Optional: Ensure unique file names
          responseFields={["tags", "customCoordinates"]} // Optional: Specify fields to include in the response
          validateFile={(file) => file.size < 2 * 1024 * 1024} // Optional: Validate file size (2MB limit)
        />
      </IKContext>
    </div>
  );
};

export default UploadPage;
