import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // Redirect to dashboard if authenticated
    }
  }, [navigate]);

  const handleSuccess = async (response) => {
    console.log("JWT Token:", response.credential);

    try {
      // Send the JWT token to the backend for verification
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          credential: response.credential,
        }
      );

      // Store the token and redirect to the dashboard
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleFailure = (response) => {
    console.error("Google login failed", response);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="flex items-center justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleFailure}
          render={(renderProps) => (
            <button
              className="google-button border border-gray-50"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
                style={{ marginRight: "10px" }}
              />
              Sign in with Google
            </button>
          )}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleButton;
