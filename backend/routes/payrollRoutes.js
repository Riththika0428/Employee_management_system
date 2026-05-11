const express = require("express");

const router = express.Router();

const {
  createPayroll,
  getPayrolls,
  getMyPayrolls,
  getPayrollById,
  updatePayroll,
  markAsPaid,
  deletePayroll,
} = require("../controllers/payrollController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");



// ==========================================
// Admin / HR Routes
// ==========================================

// Generate Payroll
router.post(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  createPayroll
);



// Get All Payrolls
router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  getPayrolls
);



// Update Payroll
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "hr"),
  updatePayroll
);



// Mark Payroll as Paid
router.patch(
  "/:id/pay",
  protect,
  authorizeRoles("admin", "hr"),
  markAsPaid
);



// Delete Payroll (Admin only)
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deletePayroll
);



// ==========================================
// Employee Routes
// ==========================================

// My Payroll History
router.get(
  "/my",
  protect,
  authorizeRoles("employee"),
  getMyPayrolls
);



// ==========================================
// Shared Route
// ==========================================

// Get Single Payroll
router.get("/:id", protect, getPayrollById);



module.exports = router;