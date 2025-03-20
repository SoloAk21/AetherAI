export const getMimeType = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  const mimeTypes = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  };
  return mimeTypes[extension] || "application/octet-stream"; // Default if unknown
};

export default {
  getMimeType,
};
