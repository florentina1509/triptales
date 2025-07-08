const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  photo: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
