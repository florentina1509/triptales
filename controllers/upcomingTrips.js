const UpcomingTrip = require('../models/UpcomingTrip');

// Show all upcoming trips (for profile or global explore)
async function index(req, res) {
  const upcomingTrips = await UpcomingTrip.find({ user: req.session.userId }).lean();
  res.render('upcoming/index', { upcomingTrips });
}

// Show form to create a new upcoming trip
function newUpcoming(req, res) {
  res.render('upcoming/new');
}

// Create new upcoming trip
async function create(req, res) {
  await UpcomingTrip.create({
    user: req.session.userId,
    destination: req.body.destination,
    date: req.body.date,
    notes: req.body.notes
  });
  res.redirect('/upcoming');
}

// Show form to edit
async function edit(req, res) {
  const upcomingTrip = await UpcomingTrip.findById(req.params.id).lean();
  res.render('upcoming/edit', { upcomingTrip });
}

// Update
async function update(req, res) {
  await UpcomingTrip.findByIdAndUpdate(req.params.id, {
    destination: req.body.destination,
    date: req.body.date,
    notes: req.body.notes
  });
  res.redirect('/upcoming');
}

// Delete
async function destroy(req, res) {
  await UpcomingTrip.findByIdAndDelete(req.params.id);
  res.redirect('/upcoming');
}

module.exports = {
  index,
  new: newUpcoming,
  create,
  edit,
  update,
  destroy
};
