require("dotenv").config();
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// Get ImageKit authentication parameters
const getImageKitAuth = (req, res) => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  res.send(authenticationParameters);
};

module.exports = { getImageKitAuth };
