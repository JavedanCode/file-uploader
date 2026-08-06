const passport = require("passport");
const bcrypt = require("bcryptjs");

const authQueries = require("../db/queries/authQueries");

const renderLogin = (res, data = {}) => {
  return res.render("auth/login", {
    title: "Login",
    errors: [],
    oldInput: {},
    ...data,
  });
};

const registerGet = (req, res) => {
  res.render("auth/register", {
    title: "Register",
    errors: [],
    oldInput: {},
  });
};

const registerPost = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await authQueries.createUserQuery({
      username,
      email,
      password: hashedPassword,
    });

    return res.redirect("/auth/login");
  } catch (err) {
    next(err);
  }
};

const loginGet = (req, res) => {
  renderLogin(res);
};

const loginPost = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return renderLogin(res, {
        errors: [
          {
            path: "login",
            msg: info.message,
          },
        ],
        oldInput: {
          username: req.body.username,
        },
      });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.redirect("/");
    });
  })(req, res, next);
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
  loginPost,
  logout,
};
