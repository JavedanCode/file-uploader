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
    select: {
      id: true,
      name: true,
      parentId: true,
      createdAt: true,
    },
  });
};

const getFolderContentsQuery = async (id, ownerId) => {
  return prisma.folder.findFirst({
    where: {
      id,
      ownerId,
    },
    select: {
      id: true,
      name: true,
      parentId: true,
      createdAt: true,

      children: {
        select: {
          id: true,
          name: true,
          parentId: true,
          createdAt: true,
        },
        orderBy: {
          name: "asc",
        },
      },

      files: {
        select: {
          id: true,
          name: true,
          size: true,
          mimeType: true,
          createdAt: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });
};

const getFolderTreeQuery = async (ownerId) => {
  const folders = await prisma.folder.findMany({
    where: {
      ownerId,
    },
    select: {
      id: true,
      name: true,
      parentId: true,
      createdAt: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const folderMap = new Map();

  for (const folder of folders) {
    folderMap.set(folder.id, {
      ...folder,
      children: [],
    });
  }

  const tree = [];

  for (const folder of folders) {
    const current = folderMap.get(folder.id);

    if (folder.parentId) {
      const parent = folderMap.get(folder.parentId);

      if (parent) {
        parent.children.push(current);
      }
    } else {
      tree.push(current);
    }
  }

  return tree;
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
  return prisma.folder.findFirst({
    where: {
      id,
      ownerId,
    },
    select: {
      id: true,
    },
  });
};

const folderNameExistsQuery = async (ownerId, parentId, name) => {
  return prisma.folder.findFirst({
    where: {
      ownerId,
      parentId,
      name,
    },
    select: {
      id: true,
    },
  });
};

const folderNameExistsExceptQuery = async (ownerId, parentId, name, id) => {
  return prisma.folder.findFirst({
    where: {
      ownerId,
      parentId,
      name,
      NOT: {
        id,
      },
    },
    select: {
      id: true,
    },
  });
};

module.exports = {
  createFolderQuery,

  getFolderByIdQuery,
  getFolderContentsQuery,
  getFolderTreeQuery,

  renameFolderQuery,

  deleteFolderQuery,

  folderExistsQuery,
  folderNameExistsQuery,
  folderNameExistsExceptQuery,
};
