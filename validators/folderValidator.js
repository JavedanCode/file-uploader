const { body, param } = require("express-validator");

const folderQueries = require("../db/queries/folderQueries");

// =====================================
// CREATE
// =====================================

const createFolderValidation = [
  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Folder name is required.")
    .isLength({ max: 50 })
    .withMessage("Folder name cannot exceed 50 characters."),

  body("parentId").custom(async (parentId, { req }) => {
    if (!parentId) {
      return true;
    }

    const exists = await folderQueries.folderExistsQuery(parentId, req.user.id);

    if (!exists) {
      throw new Error("Invalid parent folder.");
    }

    return true;
  }),
];

// =====================================
// RENAME
// =====================================

const renameFolderValidation = [
  param("id").custom(async (id, { req }) => {
    const exists = await folderQueries.folderExistsQuery(id, req.user.id);

    if (!exists) {
      throw new Error("Folder not found.");
    }

    return true;
  }),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Folder name is required.")
    .isLength({ max: 50 })
    .withMessage("Folder name cannot exceed 50 characters."),
];

// =====================================
// DELETE
// =====================================

const deleteFolderValidation = [
  param("id").custom(async (id, { req }) => {
    const exists = await folderQueries.folderExistsQuery(id, req.user.id);

    if (!exists) {
      throw new Error("Folder not found.");
    }

    return true;
  }),
];

module.exports = {
  createFolderValidation,
  renameFolderValidation,
  deleteFolderValidation,
};
