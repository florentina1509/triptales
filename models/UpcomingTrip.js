const mongoose = require('mongoose');

const upcomingTripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('UpcomingTrip', upcomingTripSchema);
