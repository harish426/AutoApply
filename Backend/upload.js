// upload.js
const multer = require("multer");

// Store files in memory
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.toLowerCase();
  if (ext.endsWith(".pdf") || ext.endsWith(".docx")) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
