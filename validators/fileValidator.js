const { body, param } = require("express-validator");

const fileQueries = require("../db/queries/fileQueries");
const folderQueries = require("../db/queries/folderQueries");

// =====================================
// UPLOAD
// =====================================

const uploadFileValidation = [
  body("folderId").custom(async (folderId, { req }) => {
    if (!folderId) {
      return true;
    }

    const exists = await folderQueries.folderExistsQuery(folderId, req.user.id);

    if (!exists) {
      throw new Error("Invalid folder.");
    }

    return true;
  }),

  body().custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Please select a file.");
    }

    return true;
  }),
];

// =====================================
// RENAME
// =====================================

const renameFileValidation = [
  param("id").custom(async (id, { req }) => {
    const exists = await fileQueries.fileExistsQuery(id, req.user.id);

    if (!exists) {
      throw new Error("File not found.");
    }

    return true;
  }),

  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("File name is required.")
    .isLength({ max: 100 })
    .withMessage("File name cannot exceed 100 characters."),
];

// =====================================
// DELETE
// =====================================

const deleteFileValidation = [
  param("id").custom(async (id, { req }) => {
    const exists = await fileQueries.fileExistsQuery(id, req.user.id);

    if (!exists) {
      throw new Error("File not found.");
    }

    return true;
  }),
];

// =====================================
// DETAILS / DOWNLOAD
// =====================================

const fileParamValidation = [
  param("id").custom(async (id, { req }) => {
    const exists = await fileQueries.fileExistsQuery(id, req.user.id);

    if (!exists) {
      throw new Error("File not found.");
    }

    return true;
  }),
];

module.exports = {
  uploadFileValidation,

  renameFileValidation,

  deleteFileValidation,

  fileParamValidation,
};
