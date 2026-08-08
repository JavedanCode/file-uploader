const folderQueries = require("../db/queries/folderQueries");

const buildDashboardData = async (userId, folderId = null) => {
  if (folderId === null) {
    const [sidebarFolders, folders] = await Promise.all([
      folderQueries.getFolderTreeQuery(userId),
      folderQueries.getRootFoldersQuery(userId),
    ]);

    return {
      title: "My Drive",

      sidebarFolders,

      breadcrumbs: [],

      currentFolder: null,

      folders,

      files: [],

      errors: [],
      oldInput: {},
    };
  }

  const [sidebarFolders, folder, breadcrumbs] = await Promise.all([
    folderQueries.getFolderTreeQuery(userId),
    folderQueries.getFolderContentsQuery(folderId, userId),
    folderQueries.getFolderPathQuery(folderId, userId),
  ]);

  if (!folder) {
    return null;
  }

  return {
    title: folder.name,

    sidebarFolders,

    breadcrumbs,

    currentFolder: folder,

    folders: folder.children,

    files: folder.files,

    errors: [],
    oldInput: {},
  };
};

module.exports = buildDashboardData;
