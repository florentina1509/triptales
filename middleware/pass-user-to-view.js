const User = require('../models/User');

async function passUserToView(req, res, next) {
  res.locals.currentUser = null;
  if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    res.locals.currentUser = user;
  }
  next();
}

module.exports = passUserToView;
