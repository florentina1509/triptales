const User = require('../models/User');

// Show wishlist
async function show(req, res) {
  try {
    const user = await User.findById(req.session.userId).lean();
    res.render('wishlist/index', { wishlist: user.wishlist });
  } catch (err) {
    res.status(500).send('Error loading wishlist');
  }
}

// Add item to wishlist
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
    res.status(500).send('Error adding to wishlist');
  }
}

// Remove item from wishlist by index
async function remove(req, res) {
  try {
    const user = await User.findById(req.session.userId);
    const index = parseInt(req.params.index);

    if (!isNaN(index) && index >= 0 && index < user.wishlist.length) {
      user.wishlist.splice(index, 1);
      await user.save();
    }

    res.redirect('/wishlist');
  } catch (err) {
    res.status(500).send('Error removing from wishlist');
  }
}

module.exports = {
  show,
  add,
  remove
};
