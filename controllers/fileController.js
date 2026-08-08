const path = require("node:path");
const fs = require("node:fs/promises");

const fileQueries = require("../db/queries/fileQueries");

// =====================================
// HELPERS
// =====================================

const isAjaxRequest = (req) => {
  return req.xhr || req.get("Accept")?.includes("application/json");
};

const getFolderRedirect = (folder) => {
  if (folder) {
    return `/folder/${folder.id}`;
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
// UPLOAD
// =====================================

const uploadFile = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: "Please select a file.",
      });
    }

    await fileQueries.createFileQuery({
      name: path.parse(file.originalname).name,
      originalName: file.originalname,

      path: file.path,

      mimeType: file.mimetype,
      size: file.size,

      ownerId: req.user.id,

      folderId: req.body.folderId || null,
    });

    const redirect = req.body.folderId ? `/folder/${req.body.folderId}` : "/";

    return sendMutationResponse(req, res, redirect);
  } catch (err) {
    return next(err);
  }
};

// =====================================
// VIEW
// =====================================

const getFileDetails = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(404).render("404", {
        title: "Not Found",
      });
    }

    return res.sendFile(path.resolve(file.path), {
      headers: {
        "Content-Type": file.mimeType,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// =====================================
// DOWNLOAD
// =====================================

const downloadFile = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(404).render("404", {
        title: "Not Found",
      });
    }

    return res.download(file.path, file.originalName);
  } catch (err) {
    return next(err);
  }
};

// =====================================
// RENAME
// =====================================

const renameFile = async (req, res, next) => {
  try {
    const file = req.file;

    await fileQueries.renameFileQuery(file.id, req.body.name);

    const redirect = getFolderRedirect(file.folder);

    return sendMutationResponse(req, res, redirect);
  } catch (err) {
    return next(err);
  }
};

// =====================================
// DELETE
// =====================================

const deleteFile = async (req, res, next) => {
  try {
    const file = req.file;

    try {
      await fs.unlink(file.path);
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw err;
      }
    }

    await fileQueries.deleteFileQuery(file.id);

    const redirect = getFolderRedirect(file.folder);

    return sendMutationResponse(req, res, redirect);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  uploadFile,
  getFileDetails,
  downloadFile,
  renameFile,
  deleteFile,
};
