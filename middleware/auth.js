module.exports = function (req, res, next) {
  if (!req.session.authStatus) {
    return res.redirect('/auth/login');
  }
  next();
}
