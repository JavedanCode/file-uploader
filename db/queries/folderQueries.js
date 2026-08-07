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

const getFolderContentsQuery = async (id, ownerId) => {
  return prisma.folder.findFirst({
    where: {
      id,
      ownerId,
    },

    include: {
      children: {
        select: {
          id: true,
          name: true,
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

const getFolderTreeQuery = async (ownerId) => {
  const folders = await prisma.folder.findMany({
    where: {
      ownerId,
    },
    select: {
      id: true,
      name: true,
      parentId: true,
    },

    orderBy: {
      name: "asc",
    },
  });

  const map = new Map();

  folders.forEach((folder) => {
    map.set(folder.id, {
      ...folder,
      children: [],
    });
  });

  const tree = [];

  folders.forEach((folder) => {
    const current = map.get(folder.id);

    if (folder.parentId) {
      const parent = map.get(folder.parentId);

      if (parent) {
        parent.children.push(current);
      }
    } else {
      tree.push(current);
    }
  });

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
  getRootFoldersQuery,
  getFolderContentsQuery,
  getFolderPathQuery,
  getFolderTreeQuery,

  renameFolderQuery,

  deleteFolderQuery,

  folderExistsQuery,
  folderNameExistsQuery,
  folderNameExistsExceptQuery,
};
