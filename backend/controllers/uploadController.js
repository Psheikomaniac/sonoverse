const musicRequestService = require('../services/musicRequestService');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const fsExists = promisify(fs.exists);
const mm = require('music-metadata');

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

      // Extract metadata from the audio file
      let metadata = {};
      try {
        const filePath = req.file.path;
        const fileStats = await fs.promises.stat(filePath);

        // Parse metadata using music-metadata
        const parsedMetadata = await mm.parseFile(filePath);

        // Extract relevant metadata
        metadata = {
          duration: parsedMetadata.format.duration || 0,
          format: parsedMetadata.format.container || path.extname(req.file.originalname).replace('.', ''),
          bitrate: parsedMetadata.format.bitrate || 0,
          sampleRate: parsedMetadata.format.sampleRate || 0,
          channels: parsedMetadata.format.numberOfChannels || 0,
          fileSize: fileStats.size || 0,
          encoding: parsedMetadata.format.codec || ''
        };
      } catch (metadataError) {
        console.error('Error extracting metadata:', metadataError);
        // If metadata extraction fails, provide basic file info
        const fileStats = await fs.promises.stat(req.file.path);
        metadata = {
          fileSize: fileStats.size,
          format: path.extname(req.file.originalname).replace('.', '')
        };
      }

      // Update the music request with the audio URL and metadata
      await musicRequestService.updateAudioWithMetadata(requestId, audioUrl, metadata);

      res.status(201).json({
        success: true,
        data: {
          audioUrl,
          metadata
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

      // Prevent path traversal attacks - stricter check
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        const error = new Error('Invalid filename - path traversal attempt detected');
        error.code = 'VALIDATION_ERROR';
        return next(error);
      }

      const filePath = path.join(__dirname, '../uploads', filename);
      const normalizedPath = path.normalize(filePath);

      // Additional path traversal check
      if (!normalizedPath.startsWith(path.join(__dirname, '../uploads'))) {
        const error = new Error('Invalid filename - path traversal attempt detected');
        error.code = 'VALIDATION_ERROR';
        return next(error);
      }

      // Check if file exists
      if (!await fsExists(filePath)) {
        const error = new Error('Audio file not found');
        error.code = 'FILE_NOT_FOUND';
        throw error;
      }

      // Get file stats for content-length
      const stats = await fs.promises.stat(filePath);

      // Determine content type based on file extension
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'audio/mpeg'; // Default to MP3

      // Map file extensions to MIME types
      const mimeTypes = {
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.ogg': 'audio/ogg',
        '.flac': 'audio/flac',
        '.m4a': 'audio/mp4'
      };

      if (mimeTypes[ext]) {
        contentType = mimeTypes[ext];
      }

      // Set appropriate headers
      res.setHeader('Content-Type', contentType);
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
