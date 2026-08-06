const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const authQueries = require("../../db/queries/authQueries");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Already linked Google account?
        let user = await authQueries.getUserByGoogleIdQuery(profile.id);

        if (user) {
          return done(null, user);
        }

        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(null, false, {
            message: "Google account has no email.",
          });
        }

        // 2. Existing local account?
        user = await authQueries.getUserByEmailQuery(email);

        if (user) {
          user = await authQueries.updateGoogleIdQuery(user.id, profile.id);

          return done(null, user);
        }

        // 3. Brand new user
        const username =
          profile.displayName.toLowerCase().replace(/\s+/g, "_") +
          "_" +
          Math.floor(Math.random() * 10000);

        user = await authQueries.createGoogleUserQuery({
          email,
          username,
          googleId: profile.id,
        });

        return done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);
