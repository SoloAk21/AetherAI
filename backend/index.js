const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const cors = require("cors");
require("dotenv").config();
require("./config/passport");
const connectDB = require("./db/index.js");

const app = express();

// Middleware
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST"],
  })
);
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

// Connect to MongoDB
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
