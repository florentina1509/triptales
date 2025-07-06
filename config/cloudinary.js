const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'TripTales',
    allowed_formats: ['jpg', 'jpeg', 'png'], // consistent casing
    transformation: [{ width: 1000, crop: 'limit' }] // optional: limit image size
  }
});

module.exports = {
  cloudinary,
  storage
};
