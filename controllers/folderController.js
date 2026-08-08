const folderQueries = require("../db/queries/folderQueries");
const buildDashboardData = require("../utils/buildDashboardData");

// =====================================
// HELPERS
// =====================================

const isAjaxRequest = (req) => {
  return req.xhr || req.get("Accept")?.includes("application/json");
};

const getFolderRedirect = (parentId) => {
  if (parentId) {
    return `/folder/${parentId}`;
  }

  return "/";
};

const sendMutationResponse = (req, res, redirect) => {
  if (isAjaxRequest(req)) {
    return res.json({
      success: true,
      redirect,
    });
  }

  return res.redirect(redirect);
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

    const redirect = getFolderRedirect(parentId);

    return sendMutationResponse(req, res, redirect);
  } catch (err) {
    return next(err);
  }
};

// =====================================
// RENAME
// =====================================

const renameFolder = async (req, res, next) => {
  try {
    const folder = req.folder;

    await folderQueries.renameFolderQuery(folder.id, req.body.name);

    const redirect = getFolderRedirect(folder.parentId);

    return sendMutationResponse(req, res, redirect);
  } catch (err) {
    return next(err);
  }
};

// =====================================
// DELETE
// =====================================

const deleteFolder = async (req, res, next) => {
  try {
    const folder = req.folder;

    await folderQueries.deleteFolderQuery(folder.id);

    const redirect = getFolderRedirect(folder.parentId);

    return sendMutationResponse(req, res, redirect);
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
