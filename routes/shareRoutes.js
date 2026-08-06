const { Router } = require("express");

const shareController = require("../controllers/shareController");

const isAuthenticated = require("../middleware/isAuthenticated");

const router = Router();

// =====================================
// CREATE / UPDATE
// =====================================

router.post(
  "/folders/:id/share",
  isAuthenticated,
  shareController.createShareLink,
);

// =====================================
// PUBLIC VIEW
// =====================================

router.get("/share/:id", shareController.viewSharedFolder);

// =====================================
// DELETE
// =====================================

router.delete(
  "/folders/:id/share",
  isAuthenticated,
  shareController.deleteShareLink,
);

module.exports = router;
