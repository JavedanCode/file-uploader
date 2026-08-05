const { Router } = require("express");
const passport = require("../config/passport");

const authController = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");

const handleValidationErrors = require("../middleware/handleValidationErrors");

const router = Router();

router.get("/register", authController.registerGet);

router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  authController.registerPost,
);

router.get("/login", authController.loginGet);

router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: false,
  }),
);

router.post("/logout", authController.logout);

module.exports = router;
