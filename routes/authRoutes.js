const { Router } = require("express");
const passport = require("passport");

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
  handleValidationErrors("auth/register"),
  authController.registerPost,
);

router.get("/login", authController.loginGet);

router.post(
  "/login",
  loginValidation,
  handleValidationErrors("auth/login"),
  authController.loginPost,
);

router.post("/logout", authController.logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
  }),
  (req, res) => {
    res.redirect("/");
  },
);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/login",
  }),
  (req, res) => {
    res.redirect("/");
  },
);

module.exports = router;
