const Trip = require('../models/Trip');

async function checkTripOwnership(req, res, next) {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).send('Trip not found');

  if (!trip.user.equals(req.session.userId)) {
    return res.status(403).send('Not authorised');
  }

  next();
}

module.exports = checkTripOwnership;
