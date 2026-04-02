const express = require('express');
const { passport } = require('../middleware/passport');
const {
  validateRegisterPayload,
  validateLoginPayload
} = require('../validators/auth');
const {
  ensureAuthenticated,
  ensureGithubOAuthConfigured
} = require('../middleware/authenticate');
const {
  register,
  login,
  githubCallbackSuccess,
  githubLoginFailed,
  getCurrentUser,
  getSessionStatus,
  logout
} = require('../controllers/auth');

const router = express.Router();

router.get(
  '/status',
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Get current authentication status'
  getSessionStatus
);

router.post(
  '/register',
  validateRegisterPayload,
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Create a local account'
  register
);

router.post(
  '/login',
  validateLoginPayload,
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Log in with email and password'
  login
);

router.get(
  '/github',
  ensureGithubOAuthConfigured,
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Start GitHub OAuth login'
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  ensureGithubOAuthConfigured,
  passport.authenticate('github', { failureRedirect: '/auth/login-failed' }),
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'GitHub OAuth callback'
  githubCallbackSuccess
);

router.get(
  '/login-failed',
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'GitHub OAuth failure handler'
  githubLoginFailed
);

router.get(
  '/me',
  ensureAuthenticated,
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Get current authenticated user'
  getCurrentUser
);

router.post(
  '/logout',
  ensureAuthenticated,
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Log out current user'
  logout
);

module.exports = router;
