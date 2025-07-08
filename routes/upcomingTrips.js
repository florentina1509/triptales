const express = require('express');
const router = express.Router();
const upcomingCtrl = require('../controllers/upcomingTrips');
const isSignedIn = require('../middleware/is-signed-in');

router.use(isSignedIn);

router.get('/', upcomingCtrl.index);
router.get('/new', upcomingCtrl.new);
router.post('/', upcomingCtrl.create);
router.get('/:id/edit', upcomingCtrl.edit);
router.put('/:id', upcomingCtrl.update);
router.delete('/:id', upcomingCtrl.destroy);

module.exports = router;
