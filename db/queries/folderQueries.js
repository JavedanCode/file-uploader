const prisma = require("../../config/prisma");

// =====================================
// CREATE
// =====================================

const createFolderQuery = async (data) => {
  return prisma.folder.create({
    data,
  });
};

// =====================================
// READ
// =====================================

const getFolderByIdQuery = async (id, ownerId) => {
  return prisma.folder.findFirst({
    where: {
      id,
      ownerId,
    },
  });
};

const getRootFoldersQuery = async (ownerId) => {
  return prisma.folder.findMany({
    where: {
      ownerId,
      parentId: null,
    },

    orderBy: {
      name: "asc",
    },
  });
};

const getChildFoldersQuery = async (parentId, ownerId) => {
  return prisma.folder.findMany({
    where: {
      ownerId,
      parentId,
    },

    orderBy: {
      name: "asc",
    },
  });
};

const getFolderContentsQuery = async (id, ownerId) => {
  return prisma.folder.findFirst({
    where: {
      id,
      ownerId,
    },

    include: {
      children: {
        orderBy: {
          name: "asc",
        },
      },

      files: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });
};

const getFolderPathQuery = async (id, ownerId) => {
  const path = [];

  let current = await prisma.folder.findFirst({
    where: {
      id,
      ownerId,
    },
  });

  while (current) {
    path.unshift(current);

    if (!current.parentId) {
      break;
    }

    current = await prisma.folder.findFirst({
      where: {
        id: current.parentId,
        ownerId,
      },
    });
  }

  return path;
};

// =====================================
// UPDATE
// =====================================

const renameFolderQuery = async (id, name) => {
  return prisma.folder.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
};

// =====================================
// DELETE
// =====================================

const deleteFolderQuery = async (id) => {
  return prisma.folder.delete({
    where: {
      id,
    },
  });
};

// =====================================
// CHECKUP
// =====================================

const folderExistsQuery = async (id, ownerId) => {
  return prisma.folder.count({
    where: {
      id,
      ownerId,
    },
  });
};

module.exports = {
  createFolderQuery,

  getFolderByIdQuery,
  getRootFoldersQuery,
  getChildFoldersQuery,
  getFolderPathQuery,

  renameFolderQuery,

  deleteFolderQuery,

  getFolderContentsQuery,
  folderExistsQuery,
};
