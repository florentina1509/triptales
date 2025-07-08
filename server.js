require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();

const Trip = require('./models/Trip');
const User = require('./models/User');
const UpcomingTrip = require('./models/UpcomingTrip');
const isSignedIn = require('./middleware/is-signed-in');
const passUserToView = require('./middleware/pass-user-to-view');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const wishlistRoutes = require('./routes/wishlist');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const upcomingRoutes = require('./routes/upcomingTrips');
const userRoutes = require('./routes/users');

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));
app.use(passUserToView);

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/trips', tripRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/comments', commentRoutes);
app.use('/likes', likeRoutes);
app.use('/upcoming', upcomingRoutes);
app.use('/users', userRoutes);

function arraysEqual(a = [], b = []) {
  return (
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

app.get('/profile', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const trips = await Trip.find({ user: req.session.userId }).sort({ date: -1 }).lean();
    const upcomingTrips = await UpcomingTrip.find({ user: req.session.userId }).sort({ date: 1 }).lean();

    let achievements = [];
    if (trips.length >= 1) achievements.push('New Explorer');
    if (trips.length >= 3) achievements.push('Globetrotter');
    if (trips.length >= 5) achievements.push('World Wanderer');

    if (!arraysEqual(user.achievements, achievements)) {
      user.achievements = achievements;
      await user.save();
    }

    res.render('profile', {
      title: 'Profile',
      user: user.toObject(),
      trips,
      wishlist: user.wishlist,
      achievements,
      upcomingTrips
    });
  } catch (err) {
    console.error('Error loading profile:', err);
    res.status(500).send('Error loading profile');
  }
});

app.get('/', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.render('welcome', { title: 'Welcome to TripTales' });
    }

    const currentUser = await User.findById(req.session.userId).lean();
    const filter = req.query.filter || null;

    let tripsQuery = {};
    if (filter === 'following') {
      tripsQuery.user = { $in: currentUser.following };
    }

    const trips = await Trip.find(tripsQuery)
      .populate('user')
      .sort({ createdAt: -1 })
      .lean();

    const tripsWithLikes = trips.map(trip => ({
      ...trip,
      likeCount: Array.isArray(trip.likes) ? trip.likes.length : 0
    }));

    res.render('home', {
      title: 'Home',
      trips: tripsWithLikes,
      user: currentUser,
      filter
    });

  } catch (err) {
    console.error('Error loading homepage:', err);
    res.status(500).send('Error loading homepage');
  }
});

app.get('/protected', isSignedIn, (req, res) => {
  res.send('You are logged in and can see this protected route.');
});

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('error', err => console.error('MongoDB connection error:', err));

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
