const musicRequestService = require('../services/musicRequestService');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const fsExists = promisify(fs.exists);

class UploadController {
  /**
   * Upload audio file and associate it with a music request
   * POST /api/v1/uploads
   */
  async uploadAudio(req, res, next) {
    try {
      if (!req.file) {
        const error = new Error('No file uploaded');
        error.code = 'FILE_UPLOAD_ERROR';
        throw error;
      }

      const { requestId } = req.body;
      if (!requestId) {
        const error = new Error('requestId is required');
        error.code = 'VALIDATION_ERROR';
        throw error;
      }

      // Generate the URL for the uploaded file
      const audioUrl = `/uploads/${req.file.filename}`;

      // Update the music request with the audio URL
      await musicRequestService.updateAudioUrl(requestId, audioUrl);

      res.status(201).json({
        success: true,
        data: {
          audioUrl
        }
      });
    } catch (error) {
      // Cleanup the uploaded file if there was an error
      if (req.file) {
        try {
          await fs.promises.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      next(error);
    }
  }

  /**
   * Stream an audio file
   * GET /api/v1/uploads/:filename
   */
  async streamAudio(req, res, next) {
    try {
      const { filename } = req.params;
      
      // Prevent path traversal attacks
      if (filename.includes('..') || filename.includes('/')) {
        const error = new Error('Invalid filename');
        error.code = 'VALIDATION_ERROR';
        throw error;
      }
      
      const filePath = path.join(__dirname, '../uploads', filename);
      const normalizedPath = path.normalize(filePath);
      
      // Additional path traversal check
      if (!normalizedPath.startsWith(path.join(__dirname, '../uploads'))) {
        const error = new Error('Invalid filename');
        error.code = 'VALIDATION_ERROR';
        throw error;
      }

      // Check if file exists
      if (!await fsExists(filePath)) {
        const error = new Error('Audio file not found');
        error.code = 'FILE_NOT_FOUND';
        throw error;
      }

      // Get file stats for content-length
      const stats = await fs.promises.stat(filePath);

      // Set appropriate headers
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', stats.size);

      // Create read stream and pipe to response
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadController();
