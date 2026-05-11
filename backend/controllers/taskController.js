// const Task = require("../models/Task");
// const Employee = require("../models/Employee");
// const createNotification = require("../utils/notificationService");
// const sendEmail = require("../utils/sendEmail");



// // ==========================================
// // Create Task
// // ==========================================
// const createTask = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       assignedTo,
//       priority,
//       deadline,
//       remarks,
//     } = req.body;

//     // Validation
//     if (
//       !title ||
//       !description ||
//       !assignedTo ||
//       !deadline
//     ) {
//       return res.status(400).json({
//         message: "Please provide all required fields",
//       });
//     }

    

//     // Check employee exists
//     const employee = await Employee.findById(assignedTo);

//     if (!employee) {
//       return res.status(404).json({
//         message: "Assigned employee not found",
//       });
//     }

//     const task = await Task.create({
//       title,
//       description,
//       assignedTo,
//       assignedBy: req.user._id,
//       priority,
//       deadline,
//       remarks,
//     });

//     const populatedTask = await Task.findById(task._id)
//       .populate({
//         path: "assignedTo",
//         populate: {
//           path: "user",
//           select: "name email",
//         },
//       })
//       .populate("assignedBy", "name email");

//     res.status(201).json({
//       message: "Task assigned successfully",
//       task: populatedTask,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };



// // ==========================================
// // Get All Tasks (Admin/HR)
// // ==========================================
// const getAllTasks = async (req, res) => {
//   try {
//     const page = Number(req.query.page) || 1;

//     const limit = Number(req.query.limit) || 10;

//     const skip = (page - 1) * limit;



//     // Filters
//     const filter = {};



//     // Status filter
//     if (req.query.status) {
//       filter.status = req.query.status;
//     }



//     // Priority filter
//     if (req.query.priority) {
//       filter.priority = req.query.priority;
//     }



//     // Deadline filter
//     if (req.query.deadline) {
//       filter.deadline = {
//         $lte: new Date(req.query.deadline),
//       };
//     }



//     // Search by title
//     if (req.query.search) {
//       filter.title = {
//         $regex: req.query.search,
//         $options: "i",
//       };
//     }



//     const tasks = await Task.find(filter)
//       .populate({
//         path: "assignedTo",
//         populate: {
//           path: "user",
//           select: "name email",
//         },
//         select: "department position employeeId",
//       })
//       .populate("assignedBy", "name email")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);



//     const total = await Task.countDocuments(filter);

//     res.status(200).json({
//       total,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//       tasks,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };



// // ==========================================
// // Employee Get My Tasks
// // ==========================================
// const getMyTasks = async (req, res) => {
//   try {
//     const employee = await Employee.findOne({
//       user: req.user._id,
//     });

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee profile not found",
//       });
//     }

//     const tasks = await Task.find({
//       assignedTo: employee._id,
//     })
//       .populate("assignedBy", "name email")
//       .sort({ createdAt: -1 });

//     res.status(200).json(tasks);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };



// // ==========================================
// // Get Single Task
// // ==========================================
// const getTaskById = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id)
//       .populate({
//         path: "assignedTo",
//         populate: {
//           path: "user",
//           select: "name email",
//         },
//         select: "department employeeId position",
//       })
//       .populate("assignedBy", "name email");

//     if (!task) {
//       return res.status(404).json({
//         message: "Task not found",
//       });
//     }

//     // Employee can only view own task
//     if (req.user.role === "employee") {
//       const employee = await Employee.findOne({
//         user: req.user._id,
//       });

//       if (
//         task.assignedTo._id.toString() !==
//         employee._id.toString()
//       ) {
//         return res.status(403).json({
//           message: "Access denied",
//         });
//       }
//     }

//     res.status(200).json(task);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };



// // ==========================================
// // Update Task (Admin/HR)
// // ==========================================
// const updateTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     if (!task) {
//       return res.status(404).json({
//         message: "Task not found",
//       });
//     }

//     const updatedTask = await Task.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     )
//       .populate({
//         path: "assignedTo",
//         populate: {
//           path: "user",
//           select: "name email",
//         },
//       })
//       .populate("assignedBy", "name email");

//     res.status(200).json({
//       message: "Task updated successfully",
//       task: updatedTask,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };



// // ==========================================
// // Update Task Status (Employee)
// // ==========================================
// const updateTaskStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const allowedStatuses = [
//       "pending",
//       "in-progress",
//       "completed",
//     ];

//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({
//         message: "Invalid status",
//       });
//     }

//     const employee = await Employee.findOne({
//       user: req.user._id,
//     });

//     const task = await Task.findById(req.params.id);

//     if (!task) {
//       return res.status(404).json({
//         message: "Task not found",
//       });
//     }

//     // Ensure task belongs to employee
//     if (
//       task.assignedTo.toString() !== employee._id.toString()
//     ) {
//       return res.status(403).json({
//         message: "Access denied",
//       });
//     }



//     // Valid status transitions
//     const currentStatus = task.status;

//     const validTransitions = {
//       pending: ["in-progress"],
//       "in-progress": ["completed"],
//       completed: [],
//     };

//     if (!validTransitions[currentStatus].includes(status)) {
//       return res.status(400).json({
//         message: `Cannot change status from ${currentStatus} to ${status}`,
//       });
//     }



//     task.status = status;

//     // Set completedAt automatically
//     if (status === "completed") {
//       task.completedAt = new Date();
//     }

//     await task.save();

//     res.status(200).json({
//       message: "Task status updated",
//       task,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };



// // ==========================================
// // Delete Task
// // ==========================================
// const deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     if (!task) {
//       return res.status(404).json({
//         message: "Task not found",
//       });
//     }

//     await task.deleteOne();

//     res.status(200).json({
//       message: "Task deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   createTask,
//   getAllTasks,
//   getMyTasks,
//   getTaskById,
//   updateTask,
//   updateTaskStatus,
//   deleteTask,
// };

const Task = require("../models/Task");
const Employee = require("../models/Employee");
const User = require("../models/User");

const createNotification = require("../utils/notificationService");
const sendEmail = require("../utils/sendEmail");



// ==========================================
// CREATE TASK
// ==========================================
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      priority,
      deadline,
      remarks,
    } = req.body;

    // Validation
    if (!title || !description || !assignedTo || !deadline) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check employee exists
    const employee = await Employee.findById(assignedTo).populate("user");

    if (!employee) {
      return res.status(404).json({
        message: "Assigned employee not found",
      });
    }

    // Create Task
    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      priority,
      deadline,
      remarks,
    });

    const populatedTask = await Task.findById(task._id)
      .populate({
        path: "assignedTo",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate("assignedBy", "name email");



    // ==========================================
    // NOTIFICATION + EMAIL
    // ==========================================

    await createNotification({
      recipient: employee.user._id,
      title: "New Task Assigned",
      message: `You have been assigned task: ${title}`,
      type: "task",
    });

    await sendEmail({
      email: employee.user.email,
      subject: "New Task Assigned",
      message: `Task: ${title}\nDeadline: ${deadline}`,
    });



    res.status(201).json({
      message: "Task assigned successfully",
      task: populatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// GET ALL TASKS (ADMIN/HR)
// ==========================================
const getAllTasks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    if (req.query.deadline) {
      filter.deadline = {
        $lte: new Date(req.query.deadline),
      };
    }

    if (req.query.search) {
      filter.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    const tasks = await Task.find(filter)
      .populate({
        path: "assignedTo",
        populate: {
          path: "user",
          select: "name email",
        },
        select: "department position employeeId",
      })
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// GET MY TASKS (EMPLOYEE)
// ==========================================
const getMyTasks = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      user: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee profile not found",
      });
    }

    const tasks = await Task.find({
      assignedTo: employee._id,
    })
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// GET SINGLE TASK
// ==========================================
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate({
        path: "assignedTo",
        populate: {
          path: "user",
          select: "name email",
        },
        select: "department employeeId position",
      })
      .populate("assignedBy", "name email");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (req.user.role === "employee") {
      const employee = await Employee.findOne({
        user: req.user._id,
      });

      if (task.assignedTo._id.toString() !== employee._id.toString()) {
        return res.status(403).json({
          message: "Access denied",
        });
      }
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// UPDATE TASK (ADMIN/HR)
// ==========================================
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate({
        path: "assignedTo",
        populate: {
          path: "user",
          select: "name email",
        },
      });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );



    // ==========================================
    // NOTIFICATION (TASK UPDATED)
    // ==========================================

    await createNotification({
      recipient: task.assignedTo.user._id,
      title: "Task Updated",
      message: `Task "${task.title}" has been updated`,
      type: "task",
    });



    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// UPDATE TASK STATUS (EMPLOYEE)
// ==========================================
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "in-progress",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const employee = await Employee.findOne({
      user: req.user._id,
    });

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.assignedTo.toString() !== employee._id.toString()) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const validTransitions = {
      pending: ["in-progress"],
      "in-progress": ["completed"],
      completed: [],
    };

    if (!validTransitions[task.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${task.status} to ${status}`,
      });
    }

    task.status = status;

    if (status === "completed") {
      task.completedAt = new Date();
    }

    await task.save();



    // ==========================================
    // NOTIFICATION (STATUS UPDATE)
    // ==========================================

    await createNotification({
      recipient: req.user._id,
      title: "Task Status Updated",
      message: `Task marked as ${status}`,
      type: "task",
    });



    res.status(200).json({
      message: "Task status updated",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// DELETE TASK
// ==========================================
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};