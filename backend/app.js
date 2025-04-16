const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const requestsRouter = require('./routes/requests');
const uploadController = require('./controllers/uploadController');
const upload = require('./middleware/uploadMiddleware');

// Ensure uploads directory exists
const fs = require('fs');
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Path traversal protection middleware
const pathTraversalProtection = (req, res, next) => {
  if (req.params.filename && (
      req.params.filename.includes('..') ||
      req.params.filename.includes('/') ||
      req.params.filename.includes('\\')
    )) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid filename - path traversal attempt detected',
        code: 'VALIDATION_ERROR'
      }
    });
  }
  next();
};

// API Routes
app.use('/api/v1/requests', requestsRouter);
app.post('/api/v1/uploads', upload.upload.single('audio'), uploadController.uploadAudio);
app.get('/api/v1/uploads/:filename', pathTraversalProtection, uploadController.streamAudio);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
