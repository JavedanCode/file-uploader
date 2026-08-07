const { body, param } = require("express-validator");

const fileQueries = require("../db/queries/fileQueries");
const folderQueries = require("../db/queries/folderQueries");

// =====================================
// HELPERS
// =====================================

const ensureFileExists = async (id, userId) => {
  const file = await fileQueries.fileExistsQuery(id, userId);

  if (!file) {
    throw new Error("File not found.");
  }

  return true;
};

const ensureFolderExists = async (folderId, userId) => {
  if (!folderId) {
    return true;
  }

  const folder = await folderQueries.folderExistsQuery(folderId, userId);

  if (!folder) {
    throw new Error("Invalid folder.");
  }

  return true;
};

// =====================================
// UPLOAD
// =====================================

const uploadFileValidation = [
  body("folderId").custom((folderId, { req }) =>
    ensureFolderExists(folderId, req.user.id),
  ),

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
  param("id").custom((id, { req }) => ensureFileExists(id, req.user.id)),

  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("File name is required.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("File name cannot exceed 100 characters."),
];

// =====================================
// DELETE
// =====================================

const deleteFileValidation = [
  param("id").custom((id, { req }) => ensureFileExists(id, req.user.id)),
];

// =====================================
// DETAILS / DOWNLOAD
// =====================================

const fileParamValidation = [
  param("id").custom((id, { req }) => ensureFileExists(id, req.user.id)),
];

module.exports = {
  uploadFileValidation,
  renameFileValidation,
  deleteFileValidation,
  fileParamValidation,
};
