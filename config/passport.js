const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const prisma = require("./prisma");
const bcrypt = require("bcryptjs");

const verifyCallback = async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return done(null, false, {
        message: "Incorrect username or password",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return done(null, false, {
        message: "Incorrect username or password",
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
    },
    verifyCallback,
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
