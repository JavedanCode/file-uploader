const { body, param } = require("express-validator");

const fileQueries = require("../db/queries/fileQueries");
const folderQueries = require("../db/queries/folderQueries");

// =====================================
// HELPERS
// =====================================

const ensureFileExists = async (id, req) => {
  const file = await fileQueries.getFileByIdQuery(id, req.user.id);

  if (!file) {
    throw new Error("File not found.");
  }

  req.file = file;

  return true;
};

const ensureFolderExists = async (folderId, ownerId) => {
  if (!folderId) {
    return true;
  }

  const folder = await folderQueries.folderExistsQuery(folderId, ownerId);

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
  param("id").custom((id, { req }) => ensureFileExists(id, req)),

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
  param("id").custom((id, { req }) => ensureFileExists(id, req)),
];

// =====================================
// DETAILS / DOWNLOAD
// =====================================

const fileParamValidation = [
  param("id").custom((id, { req }) => ensureFileExists(id, req)),
];

module.exports = {
  uploadFileValidation,
  renameFileValidation,
  deleteFileValidation,
  fileParamValidation,
};
