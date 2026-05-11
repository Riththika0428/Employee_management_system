const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");



// Register
router.post("/register", registerUser);



// Login
router.post("/login", loginUser);



// Admin Only Route Example
router.get(
  "/admin-only",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);



// HR + Admin Route Example
router.get(
  "/hr-dashboard",
  protect,
  authorizeRoles("admin", "hr"),
  (req, res) => {
    res.json({
      message: "Welcome HR/Admin",
    });
  }
);



module.exports = router;