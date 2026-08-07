const { body, param } = require("express-validator");

const folderQueries = require("../db/queries/folderQueries");

// =====================================
// HELPERS
// =====================================

const ensureFolderExists = async (id, req) => {
  const folder = await folderQueries.getFolderByIdQuery(id, req.user.id);

  if (!folder) {
    throw new Error("Folder not found.");
  }

  req.folder = folder;

  return true;
};

const ensureParentFolderExists = async (parentId, ownerId) => {
  if (!parentId) {
    return true;
  }

  const exists = await folderQueries.folderExistsQuery(parentId, ownerId);

  if (!exists) {
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
  param("id").custom((id, { req }) => ensureFolderExists(id, req)),

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
      const folder = req.folder;

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
  param("id").custom((id, { req }) => ensureFolderExists(id, req)),
];

module.exports = {
  createFolderValidation,
  renameFolderValidation,
  deleteFolderValidation,
};
