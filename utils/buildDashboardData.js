const folderQueries = require("../db/queries/folderQueries");

// =====================================
// HELPERS
// =====================================

const findFolderInTree = (folders, folderId, parents = []) => {
  for (const folder of folders) {
    const currentPath = [...parents, folder];

    if (folder.id === folderId) {
      return {
        folder,
        path: currentPath,
      };
    }

    if (folder.children.length > 0) {
      const result = findFolderInTree(folder.children, folderId, currentPath);

      if (result) {
        return result;
      }
    }
  }

  return null;
};

// =====================================
// DASHBOARD DATA
// =====================================

const buildDashboardData = async (userId, folderId = null) => {
  const sidebarFolders = await folderQueries.getFolderTreeQuery(userId);

  // =================================
  // ROOT
  // =================================

  if (folderId === null) {
    return {
      title: "My Drive",

      sidebarFolders,

      breadcrumbs: [],

      currentFolder: null,

      folders: sidebarFolders,

      files: [],

      errors: [],
      oldInput: {},
    };
  }

  // =================================
  // CURRENT FOLDER
  // =================================

  const result = findFolderInTree(sidebarFolders, folderId);

  if (!result) {
    return null;
  }

  const { path } = result;

  const folder = await folderQueries.getFolderContentsQuery(folderId, userId);

  if (!folder) {
    return null;
  }

  return {
    title: folder.name,

    sidebarFolders,

    breadcrumbs: path,

    currentFolder: folder,

    folders: folder.children,

    files: folder.files,

    errors: [],
    oldInput: {},
  };
};

module.exports = buildDashboardData;
