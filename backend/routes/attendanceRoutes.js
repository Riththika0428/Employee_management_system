const express = require("express");

const router = express.Router();

const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  getAttendanceByEmployee,
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");



// ==========================================
// Employee Routes
// ==========================================

// Check-In
router.post(
  "/check-in",
  protect,
  authorizeRoles("employee"),
  checkIn
);



// Check-Out
router.post(
  "/check-out",
  protect,
  authorizeRoles("employee"),
  checkOut
);



// My Attendance
router.get(
  "/my",
  protect,
  authorizeRoles("employee"),
  getMyAttendance
);



// ==========================================
// Admin / HR Routes
// ==========================================

// Get All Attendance
router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  getAllAttendance
);



// Get Attendance By Employee
router.get(
  "/:employeeId",
  protect,
  authorizeRoles("admin", "hr"),
  getAttendanceByEmployee
);



module.exports = router;