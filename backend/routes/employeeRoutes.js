const express = require("express");

const router = express.Router();

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");



// ======================================
// Admin & HR Routes
// ======================================

// Add Employee
router.post(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  createEmployee
);



// Get All Employees
router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  getEmployees
);



// Update Employee
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "hr"),
  updateEmployee
);



// Delete Employee
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "hr"),
  deleteEmployee
);



// ======================================
// Shared Route
// ======================================

// Get Single Employee
router.get("/:id", protect, getEmployeeById);



module.exports = router;