const express = require("express");

const router = express.Router();

const {
  createTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");



// ==========================================
// Admin / HR Routes
// ==========================================

// Create Task
router.post(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  createTask
);



// Get All Tasks
router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  getAllTasks
);



// Update Task
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "hr"),
  updateTask
);



// Delete Task (Admin Only)
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteTask
);



// ==========================================
// Employee Routes
// ==========================================

// Get My Tasks
router.get(
  "/my",
  protect,
  authorizeRoles("employee"),
  getMyTasks
);



// Update Task Status
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("employee"),
  updateTaskStatus
);



// ==========================================
// Shared Route
// ==========================================

// Get Single Task
router.get("/:id", protect, getTaskById);



module.exports = router;