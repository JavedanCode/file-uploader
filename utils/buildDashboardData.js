const folderQueries = require("../db/queries/folderQueries");

const buildDashboardData = async (userId, folderId = null) => {
  const sidebarFolders = await folderQueries.getFolderTreeQuery(userId);

  if (folderId === null) {
    return {
      title: "My Drive",

      sidebarFolders,

      breadcrumbs: [],

      currentFolder: null,

      folders: await folderQueries.getRootFoldersQuery(userId),

      files: [],

      errors: [],
      oldInput: {},
    };
  }

  const folder = await folderQueries.getFolderContentsQuery(folderId, userId);

  if (!folder) {
    return null;
  }

  const breadcrumbs = await folderQueries.getFolderPathQuery(folderId, userId);

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
