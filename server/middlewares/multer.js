const multer = require("multer");

// Store uploaded file in memory (as buffer)
const storage = multer.memoryStorage();

// Export multer middleware to handle file upload
const upload = multer({ storage });

module.exports = upload;
