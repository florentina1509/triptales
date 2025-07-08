const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comments');
const isSignedIn = require('../middleware/is-signed-in');

// Post a new comment
router.post('/:tripId', isSignedIn, commentCtrl.create);

// Delete a comment
router.delete('/:commentId', isSignedIn, commentCtrl.destroy);

module.exports = router;
