import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname); // Set the filename with a unique suffix
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Set a file size limit of 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/; // Define allowed file types
    const extname = allowedTypes.test(file.mimetype);
    const mimetype = allowedTypes.test(
      file.originalname.split(".").pop().toLowerCase(),
    );

    if (extname && mimetype) {
      return cb(null, true); // Accept the file
    } else {
      cb(new Error("Only images are allowed!")); // Reject the file
    }
  },
});

export { upload };
