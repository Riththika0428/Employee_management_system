const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Task = require("../models/Task");
const Payroll = require("../models/Payroll");
const Leave = require("../models/Leave");



// ==========================================
// Helper Functions
// ==========================================
const getCurrentMonthRange = () => {
  const start = new Date();

  start.setDate(1);

  start.setHours(0, 0, 0, 0);

  const end = new Date();

  return { start, end };
};



// ==========================================
// ADMIN DASHBOARD
// ==========================================
const getAdminDashboard = async (req, res) => {
  try {
    const { start, end } = getCurrentMonthRange();

    // Run queries in parallel
    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      joinedThisMonth,
      payrollExpenses,
      pendingLeaves,
      totalTasks,
      completedTasks,
      totalAttendance,
      presentAttendance,
    ] = await Promise.all([
      Employee.countDocuments(),

      Employee.countDocuments({
        status: "active",
      }),

      Employee.countDocuments({
        status: "inactive",
      }),

      Employee.countDocuments({
        joiningDate: {
          $gte: start,
          $lte: end,
        },
      }),

      Payroll.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$netSalary",
            },
          },
        },
      ]),

      Leave.countDocuments({
        status: "pending",
      }),

      Task.countDocuments(),

      Task.countDocuments({
        status: "completed",
      }),

      Attendance.countDocuments(),

      Attendance.countDocuments({
        status: {
          $in: ["present", "late"],
        },
      }),
    ]);



    // Attendance percentage
    const attendancePercentage =
      totalAttendance === 0
        ? 0
        : (
            (presentAttendance / totalAttendance) *
            100
          ).toFixed(2);



    // Monthly joining stats
    const monthlyJoiningStats =
      await Employee.aggregate([
        {
          $group: {
            _id: {
              month: {
                $month: "$joiningDate",
              },
              year: {
                $year: "$joiningDate",
              },
            },

            total: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);



    // Payroll trends
    const payrollTrends =
      await Payroll.aggregate([
        {
          $group: {
            _id: {
              month: "$month",
              year: "$year",
            },

            totalExpense: {
              $sum: "$netSalary",
            },
          },
        },

        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);



    // Task completion trends
    const taskTrends =
      await Task.aggregate([
        {
          $group: {
            _id: "$status",

            count: {
              $sum: 1,
            },
          },
        },
      ]);



    // Leave analytics
    const leaveAnalytics =
      await Leave.aggregate([
        {
          $group: {
            _id: "$leaveType",

            total: {
              $sum: 1,
            },
          },
        },
      ]);



    res.status(200).json({
      summary: {
        totalEmployees,
        totalDepartments: 5,
        activeEmployees,
        inactiveEmployees,
        joinedThisMonth,

        totalPayrollExpenses:
          payrollExpenses[0]?.total || 0,

        pendingLeaveRequests: pendingLeaves,

        totalTasks,
        completedTasks,

        attendancePercentage,
      },

      analytics: {
        monthlyStats: monthlyJoiningStats,

        payrollTrends,

        taskTrends,

        leaveAnalytics,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// HR DASHBOARD
// ==========================================
const getHRDashboard = async (req, res) => {
  try {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const [
      totalEmployees,
      todayAttendance,
      pendingLeaves,
      upcomingTasks,
      payrollSummary,
      taskSummary,
    ] = await Promise.all([
      Employee.countDocuments(),

      Attendance.countDocuments({
        date: today,
      }),

      Leave.countDocuments({
        status: "pending",
      }),

      Task.find({
        deadline: {
          $gte: new Date(),
        },
      })
        .sort({ deadline: 1 })
        .limit(5)
        .populate({
          path: "assignedTo",
          populate: {
            path: "user",
            select: "name email",
          },
        }),

      Payroll.aggregate([
        {
          $group: {
            _id: "$paymentStatus",

            total: {
              $sum: "$netSalary",
            },
          },
        },
      ]),

      Task.aggregate([
        {
          $group: {
            _id: "$status",

            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);



    res.status(200).json({
      employeeSummary: {
        totalEmployees,
      },

      attendanceSummary: {
        todayAttendance,
      },

      pendingLeaveApprovals:
        pendingLeaves,

      upcomingDeadlines:
        upcomingTasks,

      payrollSummary,

      taskProgressSummary:
        taskSummary,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// EMPLOYEE DASHBOARD
// ==========================================
const getEmployeeDashboard = async (
  req,
  res
) => {
  try {
    const employee =
      await Employee.findOne({
        user: req.user._id,
      });

    if (!employee) {
      return res.status(404).json({
        message: "Employee profile not found",
      });
    }



    const [
      attendanceSummary,
      assignedTasks,
      completedTasks,
      upcomingDeadlines,
      latestPayroll,
    ] = await Promise.all([
      Attendance.countDocuments({
        employee: employee._id,
      }),

      Task.countDocuments({
        assignedTo: employee._id,
      }),

      Task.countDocuments({
        assignedTo: employee._id,
        status: "completed",
      }),

      Task.find({
        assignedTo: employee._id,
        deadline: {
          $gte: new Date(),
        },
      })
        .sort({ deadline: 1 })
        .limit(5),

      Payroll.findOne({
        employee: employee._id,
      }).sort({
        createdAt: -1,
      }),
    ]);



    res.status(200).json({
      attendanceSummary,

      assignedTasks,

      completedTasks,

      upcomingDeadlines,

      leaveBalance:
        employee.leaveBalance,

      latestPayroll,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// ATTENDANCE ANALYTICS
// ==========================================
const getAttendanceAnalytics =
  async (req, res) => {
    try {
      const analytics =
        await Attendance.aggregate([
          {
            $group: {
              _id: {
                month: {
                  $month: "$date",
                },

                year: {
                  $year: "$date",
                },

                status: "$status",
              },

              total: {
                $sum: 1,
              },
            },
          },

          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ]);

      res.status(200).json({
        monthlyStats: analytics,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };



// ==========================================
// PAYROLL ANALYTICS
// ==========================================
const getPayrollAnalytics =
  async (req, res) => {
    try {
      const analytics =
        await Payroll.aggregate([
          {
            $group: {
              _id: {
                month: "$month",
                year: "$year",
              },

              totalExpense: {
                $sum: "$netSalary",
              },
            },
          },

          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ]);

      res.status(200).json({
        monthlyStats: analytics,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };



module.exports = {
  getAdminDashboard,
  getHRDashboard,
  getEmployeeDashboard,
  getAttendanceAnalytics,
  getPayrollAnalytics,
};