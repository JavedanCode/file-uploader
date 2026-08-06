const shareQueries = require("../db/queries/shareQueries");
const folderQueries = require("../db/queries/folderQueries");

// =====================================
// CREATE / UPDATE
// =====================================

const createShareLink = async (req, res, next) => {
  try {
    const folder = await folderQueries.getFolderByIdQuery(
      req.params.id,
      req.user.id,
    );

    if (!folder) {
      return res.status(404).render("404", {
        title: "Not Found",
      });
    }

    const durations = {
      "1d": 1,
      "7d": 7,
      "30d": 30,
    };

    const duration = durations[req.body.duration];

    if (!duration) {
      return res.status(400).render("400", {
        title: "Invalid Duration",
      });
    }

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + duration);

    const share = await shareQueries.upsertShareLinkQuery(folder.id, expiresAt);

    return res.render("share/success", {
      title: "Folder Shared",

      share,

      shareId: share.id,
    });
  } catch (err) {
    next(err);
  }
};

// =====================================
// VIEW PUBLIC SHARE
// =====================================

const viewSharedFolder = async (req, res, next) => {
  try {
    const share = await shareQueries.getShareLinkQuery(req.params.id);

    if (!share) {
      return res.status(404).render("404", {
        title: "Not Found",
      });
    }

    if (share.expiresAt < new Date()) {
      return res.status(410).render("share/expired", {
        title: "Share Expired",
      });
    }

    return res.render("share/view", {
      title: share.folder.name,

      folder: share.folder,
    });
  } catch (err) {
    next(err);
  }
};

// =====================================
// DELETE SHARE
// =====================================

const deleteShareLink = async (req, res, next) => {
  try {
    const folder = await folderQueries.getFolderByIdQuery(
      req.params.id,
      req.user.id,
    );

    if (!folder) {
      return res.status(404).render("404", {
        title: "Not Found",
      });
    }

    await shareQueries.deleteShareLinkQuery(folder.id);

    return res.redirect(`/folders/${folder.id}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createShareLink,
  viewSharedFolder,
  deleteShareLink,
};
