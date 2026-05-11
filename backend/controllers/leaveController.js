const Leave = require("../models/Leave");
const Employee = require("../models/Employee");



// ==========================================
// Calculate Leave Days
// ==========================================
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);

  const end = new Date(endDate);

  const difference =
    end.getTime() - start.getTime();

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  ) + 1;
};



// ==========================================
// Apply Leave
// ==========================================
const applyLeave = async (req, res) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason,
    } = req.body;

    if (
      !leaveType ||
      !startDate ||
      !endDate ||
      !reason
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const employee = await Employee.findOne({
      user: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }



    // Prevent past dates
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (new Date(startDate) < today) {
      return res.status(400).json({
        message: "Cannot apply leave for past dates",
      });
    }



    // Validate dates
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        message: "End date cannot be before start date",
      });
    }



    // Calculate total days
    const totalDays = calculateDays(
      startDate,
      endDate
    );



    // Check leave balance
    if (leaveType !== "unpaid") {
      const balance =
        employee.leaveBalance[leaveType];

      if (balance < totalDays) {
        return res.status(400).json({
          message: `Insufficient ${leaveType} leave balance`,
        });
      }
    }



    // Prevent overlapping leaves
    const overlappingLeave = await Leave.findOne({
      employee: employee._id,
      status: {
        $in: ["pending", "approved"],
      },
      $or: [
        {
          startDate: {
            $lte: endDate,
          },
          endDate: {
            $gte: startDate,
          },
        },
      ],
    });

    if (overlappingLeave) {
      return res.status(400).json({
        message:
          "Overlapping leave request already exists",
      });
    }



    const leave = await Leave.create({
      employee: employee._id,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
    });

    res.status(201).json({
      message: "Leave applied successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Employee Leave History
// ==========================================
const getMyLeaves = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      user: req.user._id,
    });

    const leaves = await Leave.find({
      employee: employee._id,
    })
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Get All Leaves
// ==========================================
const getLeaves = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;



    const filter = {};



    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }



    // Leave type filter
    if (req.query.leaveType) {
      filter.leaveType = req.query.leaveType;
    }



    // Employee filter
    if (req.query.employee) {
      filter.employee = req.query.employee;
    }



    // Month filter
    if (req.query.month) {
      const month = Number(req.query.month);

      const year =
        Number(req.query.year) ||
        new Date().getFullYear();

      filter.startDate = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      };
    }



    // Search employee name or employeeId
    if (req.query.search) {
      const employees = await Employee.find({
        employeeId: {
          $regex: req.query.search,
          $options: "i",
        },
      }).populate({
        path: "user",
        match: {
          name: {
            $regex: req.query.search,
            $options: "i",
          },
        },
      });

      const employeeIds = employees.map(
        (emp) => emp._id
      );

      filter.employee = {
        $in: employeeIds,
      };
    }



    const leaves = await Leave.find(filter)
      .populate({
        path: "employee",
        populate: {
          path: "user",
          select: "name email",
        },
        select:
          "department employeeId position leaveBalance",
      })
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);



    const total = await Leave.countDocuments(filter);

    res.status(200).json({
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Get Single Leave
// ==========================================
const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate({
        path: "employee",
        populate: {
          path: "user",
          select: "name email",
        },
        select:
          "department employeeId position leaveBalance",
      })
      .populate("reviewedBy", "name email");

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    // Employee can only access own leave
    if (req.user.role === "employee") {
      const employee = await Employee.findOne({
        user: req.user._id,
      });

      if (
        leave.employee._id.toString() !==
        employee._id.toString()
      ) {
        return res.status(403).json({
          message: "Access denied",
        });
      }
    }

    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Approve Leave
// ==========================================
const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate("employee");

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending leaves can be approved",
      });
    }



    // Deduct leave balance
    if (leave.leaveType !== "unpaid") {
      const employee = await Employee.findById(
        leave.employee._id
      );

      employee.leaveBalance[
        leave.leaveType
      ] -= leave.totalDays;

      await employee.save();
    }



    leave.status = "approved";

    leave.reviewedBy = req.user._id;

    leave.reviewedAt = new Date();

    await leave.save();

    res.status(200).json({
      message: "Leave approved successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Reject Leave
// ==========================================
const rejectLeave = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending leaves can be rejected",
      });
    }

    leave.status = "rejected";

    leave.reviewedBy = req.user._id;

    leave.reviewedAt = new Date();

    leave.rejectionReason =
      rejectionReason || "Rejected by admin";

    await leave.save();

    res.status(200).json({
      message: "Leave rejected successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Cancel Leave
// ==========================================
const cancelLeave = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      user: req.user._id,
    });

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    // Ownership validation
    if (
      leave.employee.toString() !==
      employee._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Only pending leaves can be cancelled
    if (leave.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending leave can be cancelled",
      });
    }

    await leave.deleteOne();

    res.status(200).json({
      message: "Leave cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  applyLeave,
  getMyLeaves,
  getLeaves,
  getLeaveById,
  approveLeave,
  rejectLeave,
  cancelLeave,
};