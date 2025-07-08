const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const convert = require('heic-convert');
const User = require('../models/User');

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/heic'];

    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.heic')) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, .png, .webp, and .heic files are allowed.'));
    }
  }
});

// --- AUTH ROUTES ---
router.get('/sign-up', authCtrl.showSignUp);
router.post('/sign-up', authCtrl.signUp);

router.get('/login', authCtrl.showLogin);
router.post('/login', authCtrl.login);

router.get('/logout', authCtrl.logout);

// Upload profile picture with HEIC support
router.post('/profile/upload-picture', upload.single('profilePicture'), async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    let finalImagePath = req.file.path;

    // If HEIC, convert to JPG
    if (req.file.mimetype === 'image/heic' || req.file.originalname.endsWith('.heic')) {
      const inputBuffer = fs.readFileSync(finalImagePath);

      const outputBuffer = await convert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 1
      });

      const newFilename = `${Date.now()}.jpg`;
      const newPath = `public/uploads/${newFilename}`;

      fs.writeFileSync(newPath, outputBuffer);
      fs.unlinkSync(finalImagePath); // delete original .heic

      finalImagePath = newPath;
    }

    user.profilePicture = finalImagePath.replace('public', '');
    await user.save();

    res.redirect('/profile');
  } catch (err) {
    console.error('Profile upload error:', err);
    res.status(500).send('Upload failed');
  }
});

// Remove profile picture
router.post('/profile/remove-picture', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (user.profilePicture) {
      const filePath = path.join(__dirname, '..', 'public', user.profilePicture);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      user.profilePicture = '';
      await user.save();
    }

    res.redirect('/profile');
  } catch (err) {
    console.error('Error removing profile picture:', err);
    res.status(500).send('Failed to remove profile picture');
  }
});

module.exports = router;
