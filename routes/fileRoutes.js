const { Router } = require("express");

const fileController = require("../controllers/fileController");

const {
  uploadFileValidation,
  renameFileValidation,
  deleteFileValidation,
  fileParamValidation,
} = require("../validators/fileValidator");

const buildDashboardData = require("../utils/buildDashboardData");

const handleValidationErrors = require("../middleware/handleValidationErrors");
const { uploadSingle } = require("../middleware/upload");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = Router();

// =====================================
// AUTH
// =====================================

router.use(isAuthenticated);

// =====================================
// CREATE
// =====================================

router.post(
  "/",
  uploadSingle,
  uploadFileValidation,
  handleValidationErrors("dashboard", (req) =>
    buildDashboardData(req.user.id, req.body.folderId || null),
  ),
  fileController.uploadFile,
);

// =====================================
// READ
// =====================================

router.get(
  "/:id",
  fileParamValidation,
  handleValidationErrors("404"),
  fileController.getFileDetails,
);

router.get(
  "/:id/download",
  fileParamValidation,
  handleValidationErrors("404"),
  fileController.downloadFile,
);

// =====================================
// UPDATE
// =====================================

router.patch(
  "/:id",
  renameFileValidation,
  handleValidationErrors("dashboard", (req) =>
    buildDashboardData(req.user.id, req.file.folder?.id ?? null),
  ),
  fileController.renameFile,
);

// =====================================
// DELETE
// =====================================

router.delete(
  "/:id",
  deleteFileValidation,
  handleValidationErrors("dashboard", (req) =>
    buildDashboardData(req.user.id, req.file.folder?.id ?? null),
  ),
  fileController.deleteFile,
);

module.exports = router;
