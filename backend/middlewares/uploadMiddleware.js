const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Cloudinary storage engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'apex-market-products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif']
    }
});

const upload = multer({ storage: storage });
const multiUpload = upload.array('photos', 4);

// Middleware function: uploads files and enforces that at least 1 image is present
const uploadMiddleware = (req, res, next) => {
    multiUpload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'At least one product image is required.'
            });
        }

        next();
    });
};

module.exports = uploadMiddleware;