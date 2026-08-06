const prisma = require("../../config/prisma");

// ================================
// Local Authentication
// ================================

const createUserQuery = async (data) => {
  return prisma.user.create({
    data,
  });
};

const getUserByUsernameQuery = async (username) => {
  return prisma.user.findUnique({
    where: {
      username,
    },
  });
};

const getUserByEmailQuery = async (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

// ================================
// Google Authentication
// ================================

const getUserByGoogleIdQuery = async (googleId) => {
  return prisma.user.findUnique({
    where: {
      googleId,
    },
  });
};

const createGoogleUserQuery = async (data) => {
  return prisma.user.create({
    data,
  });
};

const updateGoogleIdQuery = async (id, googleId) => {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      googleId,
    },
  });
};

// ================================
// GitHub Authentication
// ================================

const getUserByGithubIdQuery = async (githubId) => {
  return prisma.user.findUnique({
    where: {
      githubId,
    },
  });
};

const updateGithubIdQuery = async (id, githubId) => {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      githubId,
    },
  });
};

module.exports = {
  createUserQuery,
  getUserByUsernameQuery,
  getUserByEmailQuery,

  getUserByGoogleIdQuery,
  createGoogleUserQuery,
  updateGoogleIdQuery,

  getUserByGithubIdQuery,
  updateGithubIdQuery,
};
