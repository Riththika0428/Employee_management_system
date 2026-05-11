const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");



// ==========================================
// Helper Functions
// ==========================================

// Start of today
const getTodayDate = () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
};



// ==========================================
// Employee Check-In
// ==========================================
const checkIn = async (req, res) => {
  try {
    // Find employee profile
    const employee = await Employee.findOne({
      user: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee profile not found",
      });
    }

    const today = getTodayDate();

    // Prevent multiple check-ins
    const existingAttendance = await Attendance.findOne({
      employee: employee._id,
      date: today,
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "You already checked in today",
      });
    }

    const currentTime = new Date();

    // Late after 9:15 AM
    const lateThreshold = new Date();

    lateThreshold.setHours(9, 15, 0, 0);

    const status =
      currentTime > lateThreshold ? "late" : "present";



    const attendance = await Attendance.create({
      employee: employee._id,
      date: today,
      checkIn: currentTime,
      status,
    });

    res.status(201).json({
      message: "Check-in successful",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Employee Check-Out
// ==========================================
const checkOut = async (req, res) => {
  try {
    // Find employee
    const employee = await Employee.findOne({
      user: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee profile not found",
      });
    }

    const today = getTodayDate();

    // Find today's attendance
    const attendance = await Attendance.findOne({
      employee: employee._id,
      date: today,
    });

    if (!attendance) {
      return res.status(400).json({
        message: "Please check in first",
      });
    }

    // Prevent multiple check-outs
    if (attendance.checkOut) {
      return res.status(400).json({
        message: "Already checked out today",
      });
    }

    const checkOutTime = new Date();

    attendance.checkOut = checkOutTime;



    // Calculate total hours
    const totalMilliseconds =
      checkOutTime - attendance.checkIn;

    const totalHours =
      totalMilliseconds / (1000 * 60 * 60);

    attendance.totalHours = totalHours.toFixed(2);

    await attendance.save();

    res.status(200).json({
      message: "Check-out successful",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Get My Attendance
// ==========================================
const getMyAttendance = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      user: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee profile not found",
      });
    }

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;



    // Filters
    const filter = {
      employee: employee._id,
    };



    // Date filters
    const type = req.query.type;

    const now = new Date();

    if (type === "daily") {
      filter.date = {
        $gte: getTodayDate(),
      };
    }

    if (type === "weekly") {
      const lastWeek = new Date();

      lastWeek.setDate(now.getDate() - 7);

      filter.date = {
        $gte: lastWeek,
      };
    }

    if (type === "monthly") {
      const lastMonth = new Date();

      lastMonth.setMonth(now.getMonth() - 1);

      filter.date = {
        $gte: lastMonth,
      };
    }



    const records = await Attendance.find(filter)
      .populate({
        path: "employee",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);



    const total = await Attendance.countDocuments(filter);

    res.status(200).json({
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      records,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Admin/HR Get All Attendance
// ==========================================
const getAllAttendance = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;



    const filter = {};



    // Date filters
    const type = req.query.type;

    const now = new Date();

    if (type === "daily") {
      filter.date = {
        $gte: getTodayDate(),
      };
    }

    if (type === "weekly") {
      const lastWeek = new Date();

      lastWeek.setDate(now.getDate() - 7);

      filter.date = {
        $gte: lastWeek,
      };
    }

    if (type === "monthly") {
      const lastMonth = new Date();

      lastMonth.setMonth(now.getMonth() - 1);

      filter.date = {
        $gte: lastMonth,
      };
    }



    const attendance = await Attendance.find(filter)
      .populate({
        path: "employee",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);



    const total = await Attendance.countDocuments(filter);

    res.status(200).json({
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Get Attendance By Employee ID
// ==========================================
const getAttendanceByEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(
      req.params.employeeId
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const records = await Attendance.find({
      employee: employee._id,
    })
      .populate({
        path: "employee",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ date: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  getAttendanceByEmployee,
};