const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");
const User = require("../models/User");



// ==========================================
// Generate Payroll
// ==========================================
const createPayroll = async (req, res) => {
  try {
    const {
      employee,
      basicSalary,
      bonus,
      deductions,
      overtimePay,
      month,
      year,
    } = req.body;

    // Validation
    if (
      !employee ||
      basicSalary === undefined ||
      !month ||
      !year
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check employee exists
    const existingEmployee = await Employee.findById(employee);

    if (!existingEmployee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    // Prevent duplicate payroll
    const existingPayroll = await Payroll.findOne({
      employee,
      month,
      year,
    });

    if (existingPayroll) {
      return res.status(400).json({
        message:
          "Payroll already generated for this employee/month/year",
      });
    }

    // Calculate net salary
    const netSalary =
      Number(basicSalary) +
      Number(bonus || 0) +
      Number(overtimePay || 0) -
      Number(deductions || 0);

    const payroll = await Payroll.create({
      employee,
      basicSalary,
      bonus,
      deductions,
      overtimePay,
      netSalary,
      month,
      year,
      generatedBy: req.user._id,
    });

    const populatedPayroll = await Payroll.findById(payroll._id)
      .populate({
        path: "employee",
        populate: {
          path: "user",
          select: "name email",
        },
        select: "department position employeeId",
      })
      .populate("generatedBy", "name email");

    res.status(201).json({
      message: "Payroll generated successfully",
      payroll: populatedPayroll,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Get All Payrolls
// ==========================================
const getPayrolls = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;



    const filter = {};



    // Filter by month
    if (req.query.month) {
      filter.month = Number(req.query.month);
    }



    // Filter by year
    if (req.query.year) {
      filter.year = Number(req.query.year);
    }



    // Filter by payment status
    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }



    // Search by employee name or employeeId
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

      const employeeIds = employees.map((emp) => emp._id);

      filter.employee = {
        $in: employeeIds,
      };
    }



    const payrolls = await Payroll.find(filter)
      .populate({
        path: "employee",
        populate: {
          path: "user",
          select: "name email",
        },
        select: "department position employeeId",
      })
      .populate("generatedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);



    const total = await Payroll.countDocuments(filter);

    res.status(200).json({
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      payrolls,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Employee Payroll History
// ==========================================
const getMyPayrolls = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      user: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee profile not found",
      });
    }

    const payrolls = await Payroll.find({
      employee: employee._id,
    })
      .populate("generatedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Get Single Payroll
// ==========================================
const getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate({
        path: "employee",
        populate: {
          path: "user",
          select: "name email",
        },
        select: "department position employeeId",
      })
      .populate("generatedBy", "name email");

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll not found",
      });
    }

    // Employee can only access own payroll
    if (req.user.role === "employee") {
      const employee = await Employee.findOne({
        user: req.user._id,
      });

      if (
        payroll.employee._id.toString() !==
        employee._id.toString()
      ) {
        return res.status(403).json({
          message: "Access denied",
        });
      }
    }

    res.status(200).json(payroll);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Update Payroll
// ==========================================
const updatePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll not found",
      });
    }

    const {
      basicSalary,
      bonus,
      deductions,
      overtimePay,
    } = req.body;

    // Recalculate salary
    const netSalary =
      Number(basicSalary || payroll.basicSalary) +
      Number(bonus || payroll.bonus) +
      Number(overtimePay || payroll.overtimePay) -
      Number(deductions || payroll.deductions);

    const updatedPayroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        netSalary,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: "employee",
        populate: {
          path: "user",
          select: "name email",
        },
        select: "department position employeeId",
      })
      .populate("generatedBy", "name email");

    res.status(200).json({
      message: "Payroll updated successfully",
      payroll: updatedPayroll,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Mark Payroll as Paid
// ==========================================
const markAsPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll not found",
      });
    }

    if (payroll.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Payroll already marked as paid",
      });
    }

    payroll.paymentStatus = "paid";

    payroll.paymentDate = new Date();

    await payroll.save();

    res.status(200).json({
      message: "Payroll marked as paid",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Delete Payroll
// ==========================================
const deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll not found",
      });
    }

    await payroll.deleteOne();

    res.status(200).json({
      message: "Payroll deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  createPayroll,
  getPayrolls,
  getMyPayrolls,
  getPayrollById,
  updatePayroll,
  markAsPaid,
  deletePayroll,
};