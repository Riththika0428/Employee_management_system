const Employee = require("../models/Employee");
const User = require("../models/User");



// ======================================
// Add Employee
// ======================================
const createEmployee = async (req, res) => {
  try {
    const {
      user,
      employeeId,
      department,
      position,
      salary,
      joiningDate,
      status,
    } = req.body;

    // Validate required fields
    if (
      !user ||
      !employeeId ||
      !department ||
      !position ||
      !salary ||
      !joiningDate
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // Check user exists
    const existingUser = await User.findById(user);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check duplicate employee ID
    const existingEmployee = await Employee.findOne({ employeeId });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee ID already exists",
      });
    }

    // Create employee
    const employee = await Employee.create({
      user,
      employeeId,
      department,
      position,
      salary,
      joiningDate,
      status,
    });

    const populatedEmployee = await Employee.findById(employee._id).populate(
      "user",
      "name email role"
    );

    res.status(201).json({
      message: "Employee created successfully",
      employee: populatedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ======================================
// Get All Employees
// ======================================
const getEmployees = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const department = req.query.department || "";



    // Find users matching search
    const users = await User.find({
      name: { $regex: search, $options: "i" },
    });

    const userIds = users.map((user) => user._id);



    // Build filter
    const filter = {
      $or: [
        { employeeId: { $regex: search, $options: "i" } },
        { user: { $in: userIds } },
      ],
    };



    if (department) {
      filter.department = department;
    }



    const employees = await Employee.find(filter)
      .populate("user", "name email role")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });



    const total = await Employee.countDocuments(filter);



    res.status(200).json({
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      employees,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ======================================
// Get Single Employee
// ======================================
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "user",
      "name email role"
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }



    // Employee can only view own profile
    if (
      req.user.role === "employee" &&
      employee.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ======================================
// Update Employee
// ======================================
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email role");

    res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ======================================
// Delete Employee
// ======================================
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    await employee.deleteOne();

    res.status(200).json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};