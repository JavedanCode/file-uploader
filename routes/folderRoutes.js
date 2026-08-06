const { Router } = require("express");

const folderController = require("../controllers/folderController");

const {
  createFolderValidation,
  renameFolderValidation,
  deleteFolderValidation,
} = require("../validators/folderValidator");

const handleValidationErrors = require("../middleware/handleValidationErrors");

const isAuthenticated = require("../middleware/isAuthenticated");

const router = Router();

// =====================================
// READ
// =====================================

router.get("/", isAuthenticated, folderController.getRoot);

router.get("/:id", isAuthenticated, folderController.getFolder);

// =====================================
// CREATE
// =====================================

router.post(
  "/",
  isAuthenticated,
  createFolderValidation,
  handleValidationErrors("folders/index"),
  folderController.createFolder,
);

// =====================================
// UPDATE
// =====================================

router.patch(
  "/:id",
  isAuthenticated,
  renameFolderValidation,
  handleValidationErrors("folders/index"),
  folderController.renameFolder,
);

// =====================================
// DELETE
// =====================================

router.delete(
  "/:id",
  isAuthenticated,
  deleteFolderValidation,
  handleValidationErrors("folders/index"),
  folderController.deleteFolder,
);

module.exports = router;
