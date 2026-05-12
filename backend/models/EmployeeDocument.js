const mongoose = require("mongoose");

const employeeDocumentSchema =
  new mongoose.Schema(
    {
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },

      fileName: {
        type: String,
        required: true,
      },

      fileUrl: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        required: true,
      },

      fileType: {
        type: String,
        required: true,
      },

      category: {
        type: String,
        enum: [
          "profile-image",
          "resume",
          "certificate",
          "id-proof",
          "contract",
          "other",
        ],

        default: "other",
      },

      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "EmployeeDocument",
  employeeDocumentSchema
);