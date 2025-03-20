import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import HomePage from "./pages/HomePage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import DashboardPage from "./pages/DashboardPage";
import Login from "./pages/Login";
import UploadPage from "./pages/UploadPage";

const App = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/upload" element={<UploadPage />} />
    </Routes>
  </GoogleOAuthProvider>
);

export default App;
