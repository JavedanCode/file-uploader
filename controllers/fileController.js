const path = require("node:path");
const fs = require("node:fs/promises");

const fileQueries = require("../db/queries/fileQueries");

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
      return res.redirect(`/folders/${req.body.folderId}`);
    }

    return res.redirect("/folders");
  } catch (err) {
    next(err);
  }
};

// =====================================
// DETAILS
// =====================================

const getFileDetails = async (req, res, next) => {
  try {
    const file = await fileQueries.getFileByIdQuery(req.params.id, req.user.id);

    return res.render("files/details", {
      title: file.name,

      file,

      errors: [],
      oldInput: {},
    });
  } catch (err) {
    next(err);
  }
};

// =====================================
// DOWNLOAD
// =====================================

const downloadFile = async (req, res, next) => {
  try {
    const file = await fileQueries.getFileByIdQuery(req.params.id, req.user.id);

    return res.download(file.path, file.originalName);
  } catch (err) {
    next(err);
  }
};

// =====================================
// RENAME
// =====================================

const renameFile = async (req, res, next) => {
  try {
    const file = await fileQueries.getFileByIdQuery(req.params.id, req.user.id);

    await fileQueries.renameFileQuery(req.params.id, req.body.name);

    if (file.folder) {
      return res.redirect(`/folders/${file.folder.id}`);
    }

    return res.redirect("/folders");
  } catch (err) {
    next(err);
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

    await fileQueries.deleteFileQuery(req.params.id);

    if (file.folder) {
      return res.redirect(`/folders/${file.folder.id}`);
    }

    return res.redirect("/folders");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadFile,

  getFileDetails,

  downloadFile,

  renameFile,

  deleteFile,
};
