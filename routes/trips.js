const express = require('express');
const router = express.Router();
const tripsCtrl = require('../controllers/trips');
const isSignedIn = require('../middleware/is-signed-in');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

// Protect all routes under /trips
router.use(isSignedIn);

// Trip CRUD routes
router.get('/', tripsCtrl.index);
router.get('/new', tripsCtrl.new);
router.post('/', upload.single('photo'), tripsCtrl.create);
router.get('/:id', tripsCtrl.show);
router.get('/:id/edit', tripsCtrl.edit);
router.put('/:id', tripsCtrl.update);
router.delete('/:id', tripsCtrl.delete);

module.exports = router;
