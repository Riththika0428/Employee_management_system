const multer = require("multer");



// ==========================================
// FILE FILTER
// ==========================================
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG, and PDF files are allowed"
      ),
      false
    );
  }
};



// ==========================================
// MULTER CONFIG
// ==========================================
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});

module.exports = upload;