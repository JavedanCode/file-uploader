const { validationResult } = require("express-validator");

const handleValidationErrors = (view, extraData = {}) => {
  return (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).render(view, {
      errors: errors.array(),
      oldInput: req.body,
      ...extraData,
    });
  };
};

module.exports = handleValidationErrors;
