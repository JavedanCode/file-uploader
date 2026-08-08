const { validationResult } = require("express-validator");

// =====================================
// HELPERS
// =====================================

const isAjaxRequest = (req) => {
  return req.xhr || req.get("Accept")?.includes("application/json");
};

// =====================================
// VALIDATION ERROR HANDLER
// =====================================

const handleValidationErrors = (view, buildData = null) => {
  return async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    // =====================================
    // AJAX
    // =====================================

    if (isAjaxRequest(req)) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // =====================================
    // NORMAL REQUEST
    // =====================================

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
