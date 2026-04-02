const bcrypt = require('bcryptjs');
const { passport } = require('../middleware/passport');
const User = require('../models/user');

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  provider: user.provider,
  displayName: user.displayName,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const register = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({
      $or: [
        { email: req.body.email.toLowerCase() },
        { username: req.body.username }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.email === req.body.email.toLowerCase()
            ? 'A user with this email already exists.'
            : 'A user with this username already exists.'
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const user = await User.create({
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      provider: 'local',
      displayName: req.body.username
    });

    req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      return res.status(201).json({
        message: 'Account created successfully.',
        user: sanitizeUser(user)
      });
    });
  } catch (error) {
    return next(error);
  }
};

const login = (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json({
        message: info?.message || 'Invalid email or password.'
      });
    }

    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      return res.status(200).json({
        message: 'Login successful.',
        user: sanitizeUser(user)
      });
    });
  })(req, res, next);
};

const githubCallbackSuccess = (req, res) => {
  return res.status(200).json({
    message: 'GitHub login successful.',
    user: sanitizeUser(req.user)
  });
};

const githubLoginFailed = (req, res) => {
  return res.status(401).json({
    message: 'GitHub login failed.'
  });
};

const getCurrentUser = (req, res) => {
  return res.status(200).json({
    authenticated: true,
    user: sanitizeUser(req.user)
  });
};

const getSessionStatus = (req, res) => {
  return res.status(200).json({
    authenticated: Boolean(req.user),
    user: req.user ? sanitizeUser(req.user) : null
  });
};

const logout = (req, res, next) => {
  req.logout((logoutError) => {
    if (logoutError) {
      return next(logoutError);
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      res.clearCookie('storekeeper.sid');
      return res.status(200).json({
        message: 'Logout successful.'
      });
    });
  });
};

module.exports = {
  register,
  login,
  githubCallbackSuccess,
  githubLoginFailed,
  getCurrentUser,
  getSessionStatus,
  logout
};
