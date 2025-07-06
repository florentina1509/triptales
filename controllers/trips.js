const Trip = require('../models/Trip');

// Show all trips for the current user
async function index(req, res) {
  try {
    const trips = await Trip.find({ user: req.session.userId }).lean();

    let achievements = [];
    if (trips.length >= 5) {
      achievements.push('World Wanderer');
    } else if (trips.length >= 3) {
      achievements.push('Globetrotter');
    } else if (trips.length >= 1) {
      achievements.push('New Explorer');
    }

    res.render('trips/index', { trips, achievements });
  } catch (err) {
    console.error('Error loading trips:', err); // Debug log

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
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const imageUrl = req.file?.path || req.file?.url || '';

    const trip = await Trip.create({
      ...req.body,
      photo: imageUrl,
      user: req.session.userId
    });

    res.redirect(`/trips/${trip._id}`);
  } catch (err) {
    console.error('Upload error:', err); // Debug log

    res.status(500).send(`
      <h2>Error creating trip</h2>
      <p><strong>Message:</strong> ${err.message}</p>
      <pre>${JSON.stringify(err, null, 2)}</pre>
    `);
  }
}

// Show one trip
async function show(req, res) {
  try {
    const trip = await Trip.findById(req.params.id).lean();
    res.render('trips/show', { trip });
  } catch (err) {
    console.error('Error showing trip:', err); // Debug log

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
    console.error('Error loading trip for edit:', err); // Debug log

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
    await Trip.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/trips/${req.params.id}`);
  } catch (err) {
    console.error('Error updating trip:', err); // Debug log

    res.status(500).send(`
      <h2>Error updating trip</h2>
      <p><strong>Message:</strong> ${err.message}</p>
      <pre>${JSON.stringify(err, null, 2)}</pre>
    `);
  }
}

// Delete a trip
async function remove(req, res) {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.redirect('/trips');
  } catch (err) {
    console.error('Error deleting trip:', err); // Debug log

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
  delete: remove
};
