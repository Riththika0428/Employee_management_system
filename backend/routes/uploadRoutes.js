const express = require("express");

const router = express.Router();

const {
  uploadProfileImage,
  uploadDocuments,
  getMyDocuments,
  getEmployeeDocuments,
  deleteDocument,
} = require(
  "../controllers/uploadController"
);

const protect = require(
  "../middleware/authMiddleware"
);

const authorizeRoles = require(
  "../middleware/roleMiddleware"
);

const upload = require(
  "../middleware/uploadMiddleware"
);



// ==========================================
// Upload Profile Image
// ==========================================
router.post(
  "/profile-image",
  protect,
  upload.single("file"),
  uploadProfileImage
);



// ==========================================
// Upload Documents
// ==========================================
router.post(
  "/document",
  protect,
  upload.array("files", 5),
  uploadDocuments
);



// ==========================================
// My Documents
// ==========================================
router.get(
  "/my-documents",
  protect,
  getMyDocuments
);



// ==========================================
// Admin/HR Employee Documents
// ==========================================
router.get(
  "/employee/:employeeId",
  protect,
  authorizeRoles("admin", "hr"),
  getEmployeeDocuments
);



// ==========================================
// Delete Document
// ==========================================
router.delete(
  "/:id",
  protect,
  deleteDocument
);

module.exports = router;