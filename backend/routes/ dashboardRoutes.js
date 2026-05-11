const express = require("express");

const router = express.Router();

const {
  getAdminDashboard,
  getHRDashboard,
  getEmployeeDashboard,
  getAttendanceAnalytics,
  getPayrollAnalytics,
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");



// ==========================================
// ADMIN DASHBOARD
// ==========================================
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard
);



// ==========================================
// HR DASHBOARD
// ==========================================
router.get(
  "/hr",
  protect,
  authorizeRoles("hr", "admin"),
  getHRDashboard
);



// ==========================================
// EMPLOYEE DASHBOARD
// ==========================================
router.get(
  "/employee",
  protect,
  authorizeRoles("employee"),
  getEmployeeDashboard
);



// ==========================================
// ANALYTICS ROUTES
// ==========================================
router.get(
  "/analytics/attendance",
  protect,
  authorizeRoles("admin", "hr"),
  getAttendanceAnalytics
);

router.get(
  "/analytics/payroll",
  protect,
  authorizeRoles("admin", "hr"),
  getPayrollAnalytics
);



module.exports = router;