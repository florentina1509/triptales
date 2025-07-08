const User = require('../models/User');

// Show wishlist page with user's items
async function show(req, res) {
  try {
    const user = await User.findById(req.session.userId).lean();
    res.render('wishlist/index', { wishlist: user.wishlist });
  } catch (err) {
    console.error('Error loading wishlist:', err);
    res.status(500).send('Error loading wishlist');
  }
}

// Add a destination to the user's wishlist
async function add(req, res) {
  try {
    const user = await User.findById(req.session.userId);
    const destination = req.body.destination?.trim();

    if (destination) {
      user.wishlist.push(destination);
      await user.save();
    }

    res.redirect('/wishlist');
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    res.status(500).send('Error adding to wishlist');
  }
}

// Remove a destination from wishlist by index
async function remove(req, res) {
  try {
    const user = await User.findById(req.session.userId);
    const index = parseInt(req.params.index, 10);

    if (!isNaN(index) && index >= 0 && index < user.wishlist.length) {
      user.wishlist.splice(index, 1);
      await user.save();
    }

    res.redirect('/wishlist');
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    res.status(500).send('Error removing from wishlist');
  }
}

module.exports = {
  show,
  add,
  remove
};
