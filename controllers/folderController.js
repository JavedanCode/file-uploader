const folderQueries = require("../db/queries/folderQueries");

// =====================================
// ROOT
// =====================================

const getRoot = async (req, res, next) => {
  try {
    const folders = await folderQueries.getRootFoldersQuery(req.user.id);

    return res.render("folders/index", {
      title: "My Drive",
      folders,
      files: [],
      currentFolder: null,

      errors: [],
      oldInput: {},
    });
  } catch (err) {
    next(err);
  }
};

// =====================================
// VIEW
// =====================================

const getFolder = async (req, res, next) => {
  try {
    const folder = await folderQueries.getFolderContentsQuery(
      req.params.id,
      req.user.id,
    );

    if (!folder) {
      return res.status(404).render("404", {
        title: "Not Found",
      });
    }

    return res.render("folders/index", {
      title: folder.name,

      folders: folder.children,
      files: folder.files,

      currentFolder: folder,

      errors: [],
      oldInput: {},
    });
  } catch (err) {
    next(err);
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

    if (parentId) {
      return res.redirect(`/folders/${parentId}`);
    }

    return res.redirect("/folders");
  } catch (err) {
    next(err);
  }
};

// =====================================
// RENAME
// =====================================

const renameFolder = async (req, res, next) => {
  try {
    await folderQueries.renameFolderQuery(req.params.id, req.body.name);

    return res.redirect("back");
  } catch (err) {
    next(err);
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

    await folderQueries.deleteFolderQuery(req.params.id);

    if (folder.parentId) {
      return res.redirect(`/folders/${folder.parentId}`);
    }

    return res.redirect("/folders");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRoot,
  getFolder,

  createFolder,

  renameFolder,

  deleteFolder,
};
