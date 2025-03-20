const express = require("express");
const router = express.Router();
const { googleAuth } = require("../controllers/authController");
const { getImageKitAuth } = require("../controllers/imageKitController");

// Google authentication route
router.post("/google", googleAuth);

// ImageKit authentication route
router.get("/imagekit-auth", getImageKitAuth);

module.exports = router;
