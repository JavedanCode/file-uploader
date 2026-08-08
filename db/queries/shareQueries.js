const prisma = require("../../config/prisma");

// =====================================
// CREATE / UPDATE
// =====================================

const upsertShareLinkQuery = async (folderId, expiresAt) => {
  return prisma.shareLink.upsert({
    where: {
      folderId,
    },

    update: {
      expiresAt,
    },

    create: {
      folderId,
      expiresAt,
    },

    select: {
      id: true,
      folderId: true,
      expiresAt: true,
    },
  });
};

// =====================================
// READ
// =====================================

const getShareLinkQuery = async (id) => {
  return prisma.shareLink.findUnique({
    where: {
      id,
    },

    include: {
      folder: {
        include: {
          children: true,
          files: true,
        },
      },
    },
  });
};

// =====================================
// DELETE
// =====================================

const deleteShareLinkQuery = async (folderId) => {
  return prisma.shareLink.deleteMany({
    where: {
      folderId,
    },
  });
};

module.exports = {
  upsertShareLinkQuery,
  getShareLinkQuery,
  deleteShareLinkQuery,
};
