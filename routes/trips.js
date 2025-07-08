// --- Dependencies ---
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

// --- Controllers & Middleware ---
const tripsCtrl = require('../controllers/trips');
const isSignedIn = require('../middleware/is-signed-in');

// --- Protect all /trips routes ---
router.use(isSignedIn);

// --- Routes ---

// GET /trips - Show all trips for the current user
router.get('/', tripsCtrl.index);

// GET /trips/new - Form to create a new trip
router.get('/new', tripsCtrl.new);

// POST /trips - Create a trip with media (up to 10 files)
router.post('/', upload.array('media', 10), tripsCtrl.create);

// GET /trips/:id - View one trip
router.get('/:id', tripsCtrl.show);

// GET /trips/:id/edit - Form to edit a trip
router.get('/:id/edit', tripsCtrl.edit);

// PUT /trips/:id - Update trip & optionally update media
router.put('/:id', upload.array('media', 10), tripsCtrl.update);

// DELETE /trips/:id - Delete a trip
router.delete('/:id', tripsCtrl.destroy);

// --- Export ---
module.exports = router;
