/**
 * Middleware zum Laden einer Musikanfrage
 * Lädt die Musikanfrage anhand der ID in req.params.id und fügt sie zu req.musicRequest hinzu
 */

const MusicRequest = require('../models/musicRequest');

const loadMusicRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Request ID is required',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    const request = await MusicRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Music request not found',
          code: 'REQUEST_NOT_FOUND'
        }
      });
    }

    // Füge die Anfrage zu req hinzu, damit sie in nachfolgenden Middlewares verfügbar ist
    req.musicRequest = request;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: error.code || 'SERVER_ERROR'
      }
    });
  }
};

module.exports = loadMusicRequest;