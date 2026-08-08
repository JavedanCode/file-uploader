const folderQueries = require("../db/queries/folderQueries");
const fileQueries = require("../db/queries/fileQueries");

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
  // =================================
  // ROOT
  // =================================

  if (folderId === null) {
    const [sidebarFolders, files] = await Promise.all([
      folderQueries.getFolderTreeQuery(userId),

      fileQueries.getRootFilesQuery(userId),
    ]);

    return {
      title: "My Drive",

      sidebarFolders,

      breadcrumbs: [],

      currentFolder: null,

      folders: sidebarFolders,

      files,

      errors: [],
      oldInput: {},
    };
  }

  // =================================
  // CURRENT FOLDER
  // =================================

  const sidebarFolders = await folderQueries.getFolderTreeQuery(userId);

  const result = findFolderInTree(sidebarFolders, folderId);

  if (!result) {
    return null;
  }

  const folder = await folderQueries.getFolderContentsQuery(folderId, userId);

  if (!folder) {
    return null;
  }

  return {
    title: folder.name,

    sidebarFolders,

    breadcrumbs: result.path,

    currentFolder: folder,

    folders: folder.children,

    files: folder.files,

    errors: [],
    oldInput: {},
  };
};

module.exports = buildDashboardData;
