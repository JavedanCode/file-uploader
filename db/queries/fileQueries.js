const prisma = require("../../config/prisma");

// =====================================
// CREATE
// =====================================

const createFileQuery = async (data) => {
  return prisma.file.create({
    data,
  });
};

// =====================================
// READ
// =====================================

const getFileByIdQuery = async (id, ownerId) => {
  return prisma.file.findFirst({
    where: {
      id,
      ownerId,
    },

    include: {
      folder: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

const getFilesInFolderQuery = async (folderId, ownerId) => {
  return prisma.file.findMany({
    where: {
      folderId,
      ownerId,
    },

    orderBy: {
      name: "asc",
    },
  });
};

// =====================================
// UPDATE
// =====================================

const updateFileUrlQuery = async (id, url) => {
  return prisma.file.update({
    where: {
      id,
    },

    data: {
      url,
    },
  });
};

const renameFileQuery = async (id, name) => {
  return prisma.file.update({
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

const deleteFileQuery = async (id) => {
  return prisma.file.delete({
    where: {
      id,
    },
  });
};

// =====================================
// CHECKUP
// =====================================

const fileExistsQuery = async (id, ownerId) => {
  return prisma.file.count({
    where: {
      id,
      ownerId,
    },
  });
};

module.exports = {
  createFileQuery,

  getFileByIdQuery,
  getFilesInFolderQuery,

  updateFileUrlQuery,
  renameFileQuery,

  deleteFileQuery,

  fileExistsQuery,
};
