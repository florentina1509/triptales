const express = require('express');
const router = express.Router();
const isSignedIn = require('../middleware/is-signed-in');
const Trip = require('../models/Trip');

// GET /search — Show the search results page
router.get('/search', isSignedIn, async (req, res) => {
  const query = req.query.q;
  let results = [];

  if (query) {
    results = await Trip.find({
      title: { $regex: query, $options: 'i' }
    }).lean();
  }

  res.render('search/index', { results, query });
});


module.exports = router;
