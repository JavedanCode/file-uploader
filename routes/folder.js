const { Router } = require("express");

const folderController = require("../controllers/folderController");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = Router();

router.get("/", isAuthenticated, folderController.getFolders);

router.get("/:id", isAuthenticated, folderController.getFolder);

router.post("/", isAuthenticated, folderController.createFolder);

router.put("/:id", isAuthenticated, folderController.updateFolder);

router.delete("/:id", isAuthenticated, folderController.deleteFolder);

module.exports = router;
