const path = require("node:path");
const fs = require("node:fs/promises");

const fileQueries = require("../db/queries/fileQueries");

// =====================================
// HELPER
// =====================================

const redirectToFolder = (res, folder) => {
  if (folder) {
    return res.redirect(`/folder/${folder.id}`);
  }

  return res.redirect("/");
};

// =====================================
// UPLOAD
// =====================================

const uploadFile = async (req, res, next) => {
  try {
    const file = req.file;

    await fileQueries.createFileQuery({
      name: path.parse(file.originalname).name,
      originalName: file.originalname,

      path: file.path,

      mimeType: file.mimetype,
      size: file.size,

      ownerId: req.user.id,

      folderId: req.body.folderId || null,
    });

    if (req.body.folderId) {
      return res.redirect(`/folder/${req.body.folderId}`);
    }

    return res.redirect("/");
  } catch (err) {
    return next(err);
  }
};

// =====================================
// VIEW
// =====================================

const getFileDetails = async (req, res, next) => {
  try {
    const file = await fileQueries.getFileByIdQuery(req.params.id, req.user.id);

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
    const file = await fileQueries.getFileByIdQuery(req.params.id, req.user.id);

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
    const file = await fileQueries.getFileByIdQuery(req.params.id, req.user.id);

    await fileQueries.renameFileQuery(file.id, req.body.name);

    return redirectToFolder(res, file.folder);
  } catch (err) {
    return next(err);
  }
};

// =====================================
// DELETE
// =====================================

const deleteFile = async (req, res, next) => {
  try {
    const file = await fileQueries.getFileByIdQuery(req.params.id, req.user.id);

    try {
      await fs.unlink(file.path);
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw err;
      }
    }

    await fileQueries.deleteFileQuery(file.id);

    return redirectToFolder(res, file.folder);
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
