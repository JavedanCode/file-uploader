const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/zip",
  "text/plain",
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error("Unsupported file type."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

module.exports = upload;
