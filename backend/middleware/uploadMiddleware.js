const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

/**
 * Sanitizes a filename to remove unsafe characters
 * @param {string} filename - The original filename
 * @returns {string} The sanitized filename
 */
const sanitizeFilename = (filename) => {
  // Remove any path components
  const basename = path.basename(filename);

  // Remove special characters and spaces, keep only alphanumeric, dash, underscore, and dot
  const sanitized = basename.replace(/[^a-zA-Z0-9\-_\.]/g, '_');

  // Ensure the filename doesn't start with a dot (hidden file)
  return sanitized.replace(/^\.+/, '');
};

// Storage configuration for file location and naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a random string for added security
    const randomString = crypto.randomBytes(8).toString('hex');

    // Get the file extension and sanitize it
    const originalExt = path.extname(file.originalname).toLowerCase();
    const safeExt = ['.mp3', '.wav', '.ogg', '.flac', '.m4a'].includes(originalExt) 
      ? originalExt 
      : '.mp3'; // Default to .mp3 if extension is not recognized

    // Sanitize the original filename (without extension)
    const originalName = path.basename(file.originalname, path.extname(file.originalname));
    const safeName = sanitizeFilename(originalName).substring(0, 50); // Limit length

    // Generate the final filename
    const timestamp = Date.now();
    const finalFilename = `${req.body.requestId || 'audio'}-${safeName}-${timestamp}-${randomString}${safeExt}`;

    cb(null, finalFilename);
  }
});

// File filter for allowed audio formats
const fileFilter = (req, file, cb) => {
  // Expanded list of allowed audio MIME types
  const allowedTypes = [
    'audio/mpeg', 
    'audio/mp3', 
    'audio/wav', 
    'audio/wave',
    'audio/x-wav',
    'audio/ogg', 
    'audio/flac',
    'audio/x-flac',
    'audio/mp4',
    'audio/m4a',
    'audio/x-m4a'
  ];

  // Check file extension as well
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.mp3', '.wav', '.ogg', '.flac', '.m4a'];

  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only MP3, WAV, OGG, FLAC, and M4A files are allowed.');
    error.code = 'VALIDATION_ERROR';
    cb(error, false);
  }
};

// Add file size limit and path traversal protection
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  }
});

// Middleware to validate file paths
const validateFilePath = (req, res, next) => {
  const filename = req.params.filename;
  if (filename.includes('..') || path.isAbsolute(filename)) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid filename',
      },
    });
  }
  next();
};

module.exports = { upload, validateFilePath };
