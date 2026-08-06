const { Router } = require("express");

const fileController = require("../controllers/fileController");

const {
  uploadFileValidation,
  renameFileValidation,
  deleteFileValidation,
  fileParamValidation,
} = require("../validators/fileValidator");

const handleValidationErrors = require("../middleware/handleValidationErrors");
const { uploadSingle } = require("../middleware/upload");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = Router();

// =====================================
// CREATE
// =====================================

router.post(
  "/",
  isAuthenticated,
  uploadSingle,
  uploadFileValidation,
  handleValidationErrors("folders/index"),
  fileController.uploadFile,
);

// =====================================
// READ
// =====================================

router.get(
  "/:id",
  isAuthenticated,
  fileParamValidation,
  handleValidationErrors("404"),
  fileController.getFileDetails,
);

router.get(
  "/:id/download",
  isAuthenticated,
  fileParamValidation,
  handleValidationErrors("404"),
  fileController.downloadFile,
);

// =====================================
// UPDATE
// =====================================

router.patch(
  "/:id",
  isAuthenticated,
  renameFileValidation,
  handleValidationErrors("folders/index"),
  fileController.renameFile,
);

// =====================================
// DELETE
// =====================================

router.delete(
  "/:id",
  isAuthenticated,
  deleteFileValidation,
  handleValidationErrors("folders/index"),
  fileController.deleteFile,
);

module.exports = router;
