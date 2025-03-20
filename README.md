

# Aether AI - Chat Application

Aether AI is a full-stack chat application that integrates Google OAuth for authentication, MongoDB for data storage, and Google's Gemini AI for generating text and image-based responses. The application allows users to create, save, and manage chat sessions with AI-powered responses.

---

## **Features**

1. **User Authentication**:
   - Google OAuth for secure login and user management.
   - JWT-based session management.

2. **Chat Functionality**:
   - Create, save, and retrieve chat sessions.
   - Send and receive messages with AI-generated responses.
   - Support for text and image-based prompts.

3. **AI Integration**:
   - Powered by Google's Gemini AI for text and image-based responses.
   - Streaming responses for real-time interaction.

4. **Markdown Support**:
   - Render AI responses with Markdown formatting.
   - Syntax highlighting for code blocks.
   - LaTeX support for mathematical expressions.

5. **Image Handling**:
   - Upload and process images for AI analysis.
   - Display images within chat messages.

6. **Responsive UI**:
   - Modern and intuitive user interface.
   - Sidebar for managing chat sessions.
   - Mobile-friendly design.

7. **Backend API**:
   - RESTful API for managing chats and messages.
   - MongoDB for persistent storage.

---

## **Tech Stack**

### **Frontend**:
- **React**: Frontend framework for building the user interface.
- **React Router**: For routing and navigation.
- **Tailwind CSS**: For styling and responsive design.
- **Google OAuth**: For user authentication.
- **Axios**: For making API requests.

### **Backend**:
- **Node.js**: Runtime environment for the backend.
- **Express.js**: Framework for building the REST API.
- **MongoDB**: Database for storing user data and chat sessions.
- **Passport.js**: For Google OAuth authentication.
- **JWT**: For secure user sessions.

### **AI Integration**:
- **Google Gemini AI**: For generating text and image-based responses.
- **Streaming API**: For real-time AI responses.

### **Other Tools**:
- **dotenv**: For managing environment variables.
- **CORS**: For enabling cross-origin requests.
- **jsonwebtoken**: For JWT token handling.

---

## **Setup Instructions**

### **Prerequisites**:
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Google OAuth credentials (Client ID and Secret)
- Google Gemini API key

## **Usage**

1. **Login**:
   - Click on the "Login with Google" button to authenticate.

2. **Create a New Chat**:
   - Click the "New Chat" button in the sidebar to start a new chat session.

3. **Send Messages**:
   - Type your message in the input box and press Enter or click the send button.
   - Upload an image to include it in your prompt.

4. **View Chat History**:
   - Select a chat from the sidebar to view its messages.

5. **Copy or Edit Messages**:
   - Use the copy button to copy AI responses to the clipboard.
   - Use the edit button to modify user messages (not implemented yet).

6. **Logout**:
   - Click the logout button in the header to sign out.

---

