const { body } = require("express-validator");
const prisma = require("../config/prisma");

const registerValidation = [
  body("username")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters.")
    .custom(async (username) => {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (user) {
        throw new Error("Username already exists.");
      }

      return true;
    }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail()
    .custom(async (email) => {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        throw new Error("Email already exists.");
      }

      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be between 8 and 100 characters."),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }

      return true;
    }),
];

const loginValidation = [
  body("username").trim().notEmpty().withMessage("Username is required."),

  body("password").notEmpty().withMessage("Password is required."),
];

module.exports = {
  registerValidation,
  loginValidation,
};
