const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res
    .status(400)
    .render(
      req.originalUrl.includes("register") ? "auth/register" : "auth/login",
      {
        errors: errors.array(),
        oldInput: req.body,
      },
    );
};
