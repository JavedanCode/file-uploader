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
// AUTH
// =====================================

router.use(isAuthenticated);

// =====================================
// DASHBOARD
// =====================================

router.get("/", dashboardController.getRoot);

router.get("/folder/:id", dashboardController.getFolder);

// =====================================
// FOLDER CRUD
// =====================================

router.post(
  "/folder",
  createFolderValidation,
  handleValidationErrors("dashboard", (req) =>
    buildDashboardData(req.user.id, req.body.parentId || null),
  ),
  dashboardController.createFolder,
);

router.patch(
  "/folder/:id",
  renameFolderValidation,
  handleValidationErrors("dashboard", (req) =>
    buildDashboardData(req.user.id, req.params.id),
  ),
  dashboardController.renameFolder,
);

router.delete(
  "/folder/:id",
  deleteFolderValidation,
  handleValidationErrors("dashboard", (req) =>
    buildDashboardData(req.user.id, req.params.id),
  ),
  dashboardController.deleteFolder,
);

module.exports = router;
