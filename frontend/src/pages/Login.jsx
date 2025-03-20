import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
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
      <div className="">
        <div className="bg-white p-8 shadow-2xl rounded-2xl max-w-sm text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Login with Google
          </h2>

          <div className="flex justify-center">
            {/* Default Google Login Button */}
            <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
