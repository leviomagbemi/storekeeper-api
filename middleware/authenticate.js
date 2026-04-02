const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    message: 'Authentication required.'
  });
};

const ensureGithubOAuthConfigured = (req, res, next) => {
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    return next();
  }

  return res.status(503).json({
    message: 'GitHub OAuth is not configured.'
  });
};

module.exports = {
  ensureAuthenticated,
  ensureGithubOAuthConfigured
};
