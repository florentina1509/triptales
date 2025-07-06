const express = require('express');
const router = express.Router();
const wishlistCtrl = require('../controllers/wishlist');
const isSignedIn = require('../middleware/is-signed-in');

router.use(isSignedIn);

router.get('/', wishlistCtrl.show);
router.post('/', wishlistCtrl.add);
router.delete('/:index', wishlistCtrl.remove);

module.exports = router;
