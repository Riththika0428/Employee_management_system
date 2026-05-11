const express = require("express");

const router = express.Router();

const {
  applyLeave,
  getMyLeaves,
  getLeaves,
  getLeaveById,
  approveLeave,
  rejectLeave,
  cancelLeave,
} = require("../controllers/leaveController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");



// ==========================================
// Employee Routes
// ==========================================

// Apply Leave
router.post(
  "/",
  protect,
  authorizeRoles("employee"),
  applyLeave
);



// My Leave History
router.get(
  "/my",
  protect,
  authorizeRoles("employee"),
  getMyLeaves
);



// Cancel Leave
router.delete(
  "/:id",
  protect,
  authorizeRoles("employee"),
  cancelLeave
);



// ==========================================
// Admin / HR Routes
// ==========================================

// Get All Leaves
router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  getLeaves
);



// Approve Leave
router.patch(
  "/:id/approve",
  protect,
  authorizeRoles("admin", "hr"),
  approveLeave
);



// Reject Leave
router.patch(
  "/:id/reject",
  protect,
  authorizeRoles("admin", "hr"),
  rejectLeave
);



// ==========================================
// Shared Route
// ==========================================

// Get Single Leave
router.get("/:id", protect, getLeaveById);



module.exports = router;