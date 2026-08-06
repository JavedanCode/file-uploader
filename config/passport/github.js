const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

const authQueries = require("../../db/queries/authQueries");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
      scope: ["user:email"],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await authQueries.getUserByGithubIdQuery(profile.id);

        if (user) {
          return done(null, user);
        }

        const email =
          profile.emails?.find((email) => email.primary)?.value ||
          profile.emails?.[0]?.value;

        if (!email) {
          return done(null, false, {
            message: "GitHub account has no public email.",
          });
        }

        user = await authQueries.getUserByEmailQuery(email);

        if (user) {
          user = await authQueries.updateGithubIdQuery(user.id, profile.id);

          return done(null, user);
        }

        const username =
          profile.username ||
          profile.displayName?.replace(/\s+/g, "_").toLowerCase();

        user = await authQueries.createGoogleUserQuery({
          username,
          email,
          githubId: profile.id,
        });

        return done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);
