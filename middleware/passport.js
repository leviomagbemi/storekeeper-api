const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

const makeUniqueUsername = async (baseUsername) => {
  const sanitizedBase =
    (baseUsername || 'user').toLowerCase().replace(/[^a-z0-9_]/g, '') || 'user';

  let candidate = sanitizedBase;
  let suffix = 1;

  while (await User.exists({ username: candidate })) {
    candidate = `${sanitizedBase}${suffix}`;
    suffix += 1;
  }

  return candidate;
};

const configurePassport = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email.toLowerCase() });

          if (!user || !user.password) {
            return done(null, false, {
              message: 'Invalid email or password.'
            });
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return done(null, false, {
              message: 'Invalid email or password.'
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL:
            process.env.GITHUB_CALLBACK_URL ||
            `${process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 3000}`}/auth/github/callback`,
          scope: ['user:email']
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const primaryEmail = profile.emails?.[0]?.value?.toLowerCase();

            let user = await User.findOne({
              $or: [
                { githubId: profile.id },
                ...(primaryEmail ? [{ email: primaryEmail }] : [])
              ]
            });

            if (user) {
              user.githubId = profile.id;
              user.provider = 'github';
              if (!user.displayName) {
                user.displayName = profile.displayName || profile.username;
              }
              await user.save();
              return done(null, user);
            }

            const username = await makeUniqueUsername(
              profile.username || profile.displayName || `github_${profile.id}`
            );

            user = await User.create({
              username,
              email: primaryEmail,
              githubId: profile.id,
              provider: 'github',
              displayName: profile.displayName || profile.username || username
            });

            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

module.exports = {
  passport,
  configurePassport
};
