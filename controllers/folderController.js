const folderQueries = require("../db/queries/folderQueries");
const buildDashboardData = require("../utils/buildDashboardData");

// =====================================
// HELPER
// =====================================
const redirectToParent = (res, parentId) => {
  if (parentId) {
    return res.redirect(`/folder/${parentId}`);
  }

  return res.redirect("/");
};

// =====================================
// ROOT
// =====================================

const getRoot = async (req, res, next) => {
  try {
    const data = await buildDashboardData(req.user.id);

    return res.render("dashboard", data);
  } catch (err) {
    return next(err);
  }
};

// =====================================
// VIEW
// =====================================

const getFolder = async (req, res, next) => {
  try {
    const data = await buildDashboardData(req.user.id, req.params.id);

    if (!data) {
      return res.status(404).render("404", {
        title: "Not Found",
      });
    }

    return res.render("dashboard", data);
  } catch (err) {
    return next(err);
  }
};

// =====================================
// CREATE
// =====================================

const createFolder = async (req, res, next) => {
  try {
    const { name, parentId } = req.body;

    await folderQueries.createFolderQuery({
      name,
      ownerId: req.user.id,
      parentId: parentId || null,
    });

    return redirectToParent(res, parentId);
  } catch (err) {
    return next(err);
  }
};

// =====================================
// RENAME
// =====================================

const renameFolder = async (req, res, next) => {
  try {
    const folder = await folderQueries.getFolderByIdQuery(
      req.params.id,
      req.user.id,
    );

    await folderQueries.renameFolderQuery(folder.id, req.body.name);

    return redirectToParent(res, folder.parentId);
  } catch (err) {
    return next(err);
  }
};

// =====================================
// DELETE
// =====================================

const deleteFolder = async (req, res, next) => {
  try {
    const folder = await folderQueries.getFolderByIdQuery(
      req.params.id,
      req.user.id,
    );

    await folderQueries.deleteFolderQuery(folder.id);

    return redirectToParent(res, folder.parentId);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getRoot,
  getFolder,

  createFolder,

  renameFolder,

  deleteFolder,
};
