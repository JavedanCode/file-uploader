const { Router } = require("express");

const fileController = require("../controllers/fileController");
const isAuthenticated = require("../middleware/isAuthenticated");
const upload = require("../middleware/upload");

const router = Router();

router.post(
  "/upload",
  isAuthenticated,
  upload.single("file"),
  fileController.uploadFile,
);

router.get("/:id", isAuthenticated, fileController.getFile);

router.get("/:id/download", isAuthenticated, fileController.downloadFile);

router.delete("/:id", isAuthenticated, fileController.deleteFile);

module.exports = router;
