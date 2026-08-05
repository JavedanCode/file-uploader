const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

const registerGet = (req, res) => {
  res.render("auth/register");
};

const registerPost = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.redirect("/auth/login");
  } catch (err) {
    next(err);
  }
};

const loginGet = (req, res) => {
  res.render("auth/login");
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      res.redirect("/");
    });
  });
};

module.exports = {
  registerGet,
  registerPost,
  loginGet,
  logout,
};
