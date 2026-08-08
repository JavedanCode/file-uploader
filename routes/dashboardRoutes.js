const { Router } = require("express");

const dashboardController = require("../controllers/folderController");

const {
  createFolderValidation,
  renameFolderValidation,
  deleteFolderValidation,
} = require("../validators/folderValidator");

const handleValidationErrors = require("../middleware/handleValidationErrors");
const isAuthenticated = require("../middleware/isAuthenticated");

const buildDashboardData = require("../utils/buildDashboardData");

const router = Router();

// =====================================
// DASHBOARD
// =====================================

router.get("/", isAuthenticated, dashboardController.getRoot);

router.get("/folder/:id", isAuthenticated, dashboardController.getFolder);

// =====================================
// FOLDER CRUD
// =====================================

router.post(
  "/folder",
  isAuthenticated,
  createFolderValidation,
  handleValidationErrors("dashboard", (req) =>
    buildDashboardData(req.user.id, req.body.parentId || null),
  ),
  dashboardController.createFolder,
);

router.patch(
  "/folder/:id",
  isAuthenticated,
  renameFolderValidation,
  handleValidationErrors("dashboard", (req) =>
    buildDashboardData(req.user.id, req.params.id),
  ),
  dashboardController.renameFolder,
);

router.delete(
  "/folder/:id",
  isAuthenticated,
  deleteFolderValidation,
  handleValidationErrors("dashboard", (req) =>
    buildDashboardData(req.user.id, req.params.id),
  ),
  dashboardController.deleteFolder,
);

module.exports = router;
