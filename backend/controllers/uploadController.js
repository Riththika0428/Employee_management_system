const cloudinary = require("../utils/cloudinary");

const EmployeeDocument = require(
  "../models/EmployeeDocument"
);

const Employee = require("../models/Employee");
const sharp = require("sharp");

// ==========================================
// Upload Profile Image
// ==========================================
const uploadProfileImage = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const employee =
      await Employee.findOne({
        user: req.user._id,
      });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }



    // ==========================================
    // COMPRESS IMAGE USING SHARP
    // ==========================================
    const compressedImage =
      await sharp(req.file.buffer)
        .resize({
          width: 500,
          height: 500,
          fit: "cover",
        })
        .jpeg({
          quality: 80,
        })
        .toBuffer();



    // ==========================================
    // UPLOAD TO CLOUDINARY
    // ==========================================
    const result =
      await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${compressedImage.toString(
          "base64"
        )}`,
        {
          folder:
            "employee-management/profile-images",

          resource_type: "image",

          public_id: `profile-${Date.now()}`,
        }
      );



    // ==========================================
    // SAVE DATABASE
    // ==========================================
    const document =
      await EmployeeDocument.create({
        employee: employee._id,

        fileName: req.file.originalname,

        fileUrl: result.secure_url,

        publicId: result.public_id,

        fileType: "image/jpeg",

        category: "profile-image",

        uploadedBy: req.user._id,
      });

    res.status(201).json({
      message:
        "Profile image uploaded successfully",

      document,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// Upload Profile Image
// ==========================================
// const uploadProfileImage = async (
//   req,
//   res
// ) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         message: "No file uploaded",
//       });
//     }

//     const employee =
//       await Employee.findOne({
//         user: req.user._id,
//       });

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found",
//       });
//     }

    // Upload to Cloudinary
    // const result =
    //   await cloudinary.uploader.upload(
    //     `data:${req.file.mimetype};base64,${req.file.buffer.toString(
    //       "base64"
    //     )}`,
    //     {
    //       folder:
    //         "employee-management/profile-images",

    //       resource_type: "image",

    //       public_id: `profile-${Date.now()}`,
    //     }
    //   );

    // Save DB
//     const document =
//       await EmployeeDocument.create({
//         employee: employee._id,

//         fileName: req.file.originalname,

//         fileUrl: result.secure_url,

//         publicId: result.public_id,

//         fileType: req.file.mimetype,

//         category: "profile-image",

//         uploadedBy: req.user._id,
//       });

//     res.status(201).json({
//       message:
//         "Profile image uploaded successfully",

//       document,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };



// ==========================================
// Upload Employee Documents
// ==========================================
const uploadDocuments = async (
  req,
  res
) => {
  try {
    const { category } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded",
      });
    }

    const employee =
      await Employee.findOne({
        user: req.user._id,
      });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const uploadedDocs = [];



    // Upload multiple files
    for (const file of req.files) {

      let fileBuffer = file.buffer;
      let mimetype = file.mimetype;

      // Compress images
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png"
      ) {
        fileBuffer = await sharp(file.buffer)
          .resize({
            width: 1200,
          })
          .jpeg({
            quality: 80,
          })
          .toBuffer();

        mimetype = "image/jpeg";
      }

      const result =
        await cloudinary.uploader.upload(
          `data:${mimetype};base64,${fileBuffer.toString(
            "base64"
          )}`,
          {
            folder:
              "employee-management/documents",

            resource_type:
              mimetype ===
              "application/pdf"
                ? "raw"
                : "image",

            public_id: `${Date.now()}-${file.originalname}`,
          }
        );

      const document =
        await EmployeeDocument.create({
          employee: employee._id,

          fileName: file.originalname,

          fileUrl: result.secure_url,

          publicId: result.public_id,

          fileType: mimetype,

          category,

          uploadedBy: req.user._id,
        });

      uploadedDocs.push(document);
    }

    res.status(201).json({
      message:
        "Documents uploaded successfully",

      documents: uploadedDocs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Get My Documents
// ==========================================
const getMyDocuments = async (
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
        message: "Employee not found",
      });
    }

    const filter = {
      employee: employee._id,
    };

    // Category filter
    if (req.query.category) {
      filter.category =
        req.query.category;
    }

    const documents =
      await EmployeeDocument.find(filter)
        .sort({ createdAt: -1 });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Get Employee Documents (Admin/HR)
// ==========================================
const getEmployeeDocuments =
  async (req, res) => {
    try {
      const documents =
        await EmployeeDocument.find({
          employee:
            req.params.employeeId,
        })
          .populate({
            path: "employee",
            populate: {
              path: "user",
              select: "name email",
            },
          })
          .sort({ createdAt: -1 });

      res.status(200).json(
        documents
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };



// ==========================================
// Delete Document
// ==========================================
const deleteDocument = async (
  req,
  res
) => {
  try {
    const document =
      await EmployeeDocument.findById(
        req.params.id
      );

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }



    // Ownership check
    if (
      req.user.role === "employee"
    ) {
      const employee =
        await Employee.findOne({
          user: req.user._id,
        });

      if (
        document.employee.toString() !==
        employee._id.toString()
      ) {
        return res.status(403).json({
          message: "Access denied",
        });
      }
    }



    // Delete from Cloudinary
    await cloudinary.uploader.destroy(
      document.publicId,
      {
        resource_type:
          document.fileType ===
          "application/pdf"
            ? "raw"
            : "image",
      }
    );



    // Delete from DB
    await document.deleteOne();

    res.status(200).json({
      message:
        "Document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  uploadProfileImage,
  uploadDocuments,
  getMyDocuments,
  getEmployeeDocuments,
  deleteDocument,
};