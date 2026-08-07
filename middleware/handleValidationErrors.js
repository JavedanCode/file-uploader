const { validationResult } = require("express-validator");

const handleValidationErrors = (view, buildData = null) => {
  return async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    try {
      const data = buildData ? await buildData(req) : {};

      return res.status(400).render(view, {
        ...data,

        errors: errors.array(),
        oldInput: req.body,
      });
    } catch (err) {
      return next(err);
    }
  };
};

module.exports = handleValidationErrors;
