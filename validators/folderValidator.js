const { body, param } = require("express-validator");

const folderQueries = require("../db/queries/folderQueries");

// =====================================
// HELPERS
// =====================================

const ensureFolderExists = async (id, userId) => {
  const folder = await folderQueries.folderExistsQuery(id, userId);

  if (!folder) {
    throw new Error("Folder not found.");
  }

  return true;
};

const ensureParentFolderExists = async (parentId, userId) => {
  if (!parentId) {
    return true;
  }

  const folder = await folderQueries.folderExistsQuery(parentId, userId);

  if (!folder) {
    throw new Error("Invalid parent folder.");
  }

  return true;
};

// =====================================
// CREATE
// =====================================

const createFolderValidation = [
  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Folder name is required.")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Folder name cannot exceed 50 characters.")
    .bail()
    .custom(async (name, { req }) => {
      const exists = await folderQueries.folderNameExistsQuery(
        req.user.id,
        req.body.parentId || null,
        name,
      );

      if (exists) {
        throw new Error("A folder with this name already exists.");
      }

      return true;
    }),

  body("parentId").custom((parentId, { req }) =>
    ensureParentFolderExists(parentId, req.user.id),
  ),
];

// =====================================
// RENAME
// =====================================

const renameFolderValidation = [
  param("id").custom((id, { req }) => ensureFolderExists(id, req.user.id)),

  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Folder name is required.")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Folder name cannot exceed 50 characters.")
    .bail()
    .custom(async (name, { req }) => {
      const folder = await folderQueries.getFolderByIdQuery(
        req.params.id,
        req.user.id,
      );

      const exists = await folderQueries.folderNameExistsExceptQuery(
        req.user.id,
        folder.parentId,
        name,
        folder.id,
      );

      if (exists) {
        throw new Error("A folder with this name already exists.");
      }

      return true;
    }),
];

// =====================================
// DELETE
// =====================================

const deleteFolderValidation = [
  param("id").custom((id, { req }) => ensureFolderExists(id, req.user.id)),
];

module.exports = {
  createFolderValidation,
  renameFolderValidation,
  deleteFolderValidation,
};
