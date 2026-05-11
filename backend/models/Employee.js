const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
     leaveBalance: {
  sick: {
    type: Number,
    default: 10,
  },

  casual: {
    type: Number,
    default: 7,
  },

  annual: {
    type: Number,
    default: 15,
  },
},
    department: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    leaveBalance: {
  sick: {
    type: Number,
    default: 10,
  },

  casual: {
    type: Number,
    default: 7,
  },

  annual: {
    type: Number,
    default: 15,
  },
},

    joiningDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", employeeSchema);