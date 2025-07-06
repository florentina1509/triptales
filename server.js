require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express(); // Must come before route and view usage

// Models & Middleware
const Trip = require('./models/Trip');
const User = require('./models/User');
const isSignedIn = require('./middleware/is-signed-in');
const passUserToView = require('./middleware/pass-user-to-view');

// Route Imports
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const wishlistRoutes = require('./routes/wishlist');

// View Engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(passUserToView);

// Routes
app.use('/auth', authRoutes);
app.use('/trips', tripRoutes);
app.use('/wishlist', wishlistRoutes);

// Profile Page
app.get('/profile', isSignedIn, async (req, res) => {
  const user = await User.findById(req.session.userId).lean();
  const trips = await Trip.find({ user: req.session.userId }).lean();
  res.render('profile', { title: 'Profile', user, trips });
});

// Home Feed
app.get('/', async (req, res) => {
  const trips = await Trip.find().populate('user').lean();
  res.render('home', { title: 'Home', trips });
});

// Optional protected test route
app.get('/protected', isSignedIn, (req, res) => {
  res.send('You are logged in and can see this page.');
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

// Start Server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
