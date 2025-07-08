const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const isSignedIn = require('../middleware/is-signed-in');

router.post('/:id', isSignedIn, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    const userId = req.session.userId;

    const alreadyLiked = trip.likes.includes(userId);

    if (alreadyLiked) {
      trip.likes = trip.likes.filter(id => id.toString() !== userId);
    } else {
      trip.likes.push(userId);
    }

    await trip.save();
    res.redirect('/');
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).send('Error toggling like');
  }
});

module.exports = router;
