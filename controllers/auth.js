const User = require('../models/User');

// Show sign-up form
function showSignUp(req, res) {
  res.render('auth/sign-up');
}

// Handle sign-up
async function signUp(req, res) {
  try {
    const user = await User.create(req.body);
    req.session.userId = user._id;
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Error during sign-up: ' + err.message);
  }
}

// Show login form
function showLogin(req, res) {
  res.render('auth/login');
}

// Handle login
async function login(req, res) {
  try {
    const user = await User.findOne({ username: req.body.username.trim() });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const isValid = await user.validatePassword(req.body.password);
    if (!isValid) {
      return res.status(401).send('Invalid password');
    }

    req.session.userId = user._id;
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error during login: ' + err.message);
  }
}

// Handle logout
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
}

module.exports = {
  showSignUp,
  signUp,
  showLogin,
  login,
  logout
};
