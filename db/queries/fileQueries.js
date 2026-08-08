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

    select: {
      id: true,

      name: true,
      originalName: true,

      path: true,
      url: true,

      mimeType: true,
      size: true,

      createdAt: true,

      folder: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

const getRootFilesQuery = async (ownerId) => {
  return prisma.file.findMany({
    where: {
      ownerId,
      folderId: null,
    },
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
  return prisma.file.findFirst({
    where: {
      id,
      ownerId,
    },

    select: {
      id: true,
    },
  });
};

module.exports = {
  createFileQuery,

  getFileByIdQuery,
  getRootFilesQuery,

  updateFileUrlQuery,
  renameFileQuery,

  deleteFileQuery,

  fileExistsQuery,
};
