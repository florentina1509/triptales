const Trip = require('../models/Trip');
const Comment = require('../models/Comment');
const User = require('../models/User');

// Show all trips for the current user
async function index(req, res) {
  try {
    const trips = await Trip.find({ user: req.session.userId }).lean();

    const tripsWithLikeCount = trips.map(trip => ({
      ...trip,
      likeCount: trip.likes ? trip.likes.length : 0
    }));

    let achievements = [];
    if (trips.length >= 5) {
      achievements.push('World Wanderer');
    } else if (trips.length >= 3) {
      achievements.push('Globetrotter');
    } else if (trips.length >= 1) {
      achievements.push('New Explorer');
    }

    res.render('trips/index', { trips: tripsWithLikeCount, achievements });
  } catch (err) {
    console.error('Error loading trips:', JSON.stringify(err, null, 2));
    res.status(500).send(`
      <h2>Error loading trips</h2>
      <p><strong>Message:</strong> ${err.message}</p>
      <pre>${JSON.stringify(err, null, 2)}</pre>
    `);
  }
}

// Show form to create a new trip
function newTrip(req, res) {
  res.render('trips/new');
}

// Create a new trip
async function create(req, res) {
  try {
    const media = (req.files || []).map(file => ({
      url: file.path || file.url,
      type: file.mimetype.startsWith('video') ? 'video' : 'image'
    }));

    const trip = await Trip.create({
      ...req.body,
      media,
      user: req.session.userId
    });

    res.redirect(`/trips/${trip._id}`);
  } catch (err) {
    console.error('Error creating trip:', JSON.stringify(err, null, 2));
    res.status(500).send(`
      <h2>Error creating trip</h2>
      <p><strong>Message:</strong> ${err.message}</p>
      <pre>${JSON.stringify(err, null, 2)}</pre>
    `);
  }
}

// Show one trip and its comments
async function show(req, res) {
  try {
    const trip = await Trip.findById(req.params.id).populate('likes').lean();
    const comments = await Comment.find({ trip: trip._id }).populate('user').lean();

    trip.comments = comments;
    trip.likes = trip.likes || [];
    trip.likeCount = trip.likes.length;

    res.render('trips/show', { trip, user: req.session.user });
  } catch (err) {
    console.error('Error showing trip:', JSON.stringify(err, null, 2));
    res.status(404).send(`
      <h2>Trip not found</h2>
      <p><strong>Message:</strong> ${err.message}</p>
      <pre>${JSON.stringify(err, null, 2)}</pre>
    `);
  }
}

// Show form to edit a trip
async function edit(req, res) {
  try {
    const trip = await Trip.findById(req.params.id).lean();
    res.render('trips/edit', { trip });
  } catch (err) {
    console.error('Error loading trip for edit:', JSON.stringify(err, null, 2));
    res.status(404).send(`
      <h2>Error loading trip for edit</h2>
      <p><strong>Message:</strong> ${err.message}</p>
      <pre>${JSON.stringify(err, null, 2)}</pre>
    `);
  }
}

// Update a trip
async function update(req, res) {
  try {
    const media = (req.files || []).map(file => ({
      url: file.path || file.url,
      type: file.mimetype.startsWith('video') ? 'video' : 'image'
    }));

    const updatedTrip = {
      ...req.body
    };

    if (media.length > 0) {
      updatedTrip.media = media;
    }

    await Trip.findByIdAndUpdate(req.params.id, updatedTrip);
    res.redirect(`/trips/${req.params.id}`);
  } catch (err) {
    console.error('Error updating trip:', JSON.stringify(err, null, 2));
    res.status(500).send(`
      <h2>Error updating trip</h2>
      <p><strong>Message:</strong> ${err.message}</p>
      <pre>${JSON.stringify(err, null, 2)}</pre>
    `);
  }
}

// Delete a trip
async function destroy(req, res) {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.redirect('/trips');
  } catch (err) {
    console.error('Error deleting trip:', JSON.stringify(err, null, 2));
    res.status(500).send(`
      <h2>Error deleting trip</h2>
      <p><strong>Message:</strong> ${err.message}</p>
      <pre>${JSON.stringify(err, null, 2)}</pre>
    `);
  }
}

module.exports = {
  index,
  new: newTrip,
  create,
  show,
  edit,
  update,
  destroy
};
