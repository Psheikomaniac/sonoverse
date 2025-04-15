const multer = require('multer');
const path = require('path');

// Storage configuration for file location and naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${req.params.id || 'audio'}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter for allowed audio formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only MP3 and WAV files are allowed.');
    error.code = 'VALIDATION_ERROR';
    cb(error, false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB Limit
  }
});

module.exports = upload;
