const musicRequestService = require('../services/musicRequestService');

class MusicRequestController {
  // GET /api/v1/requests
  async getAllRequests(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        genre, 
        startDate, 
        endDate,
        sortBy,
        sortOrder
      } = req.query;

      const result = await musicRequestService.getAllRequests({ 
        page, 
        limit, 
        status, 
        genre, 
        startDate, 
        endDate,
        sortBy,
        sortOrder
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/requests/search
  async searchRequests(req, res, next) {
    try {
      const { 
        query, 
        status, 
        genre, 
        mood, 
        hasLyrics, 
        hasAudio, 
        startDate, 
        endDate,
        page = 1,
        limit = 10,
        sortField = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filters = {
        status,
        genre,
        mood,
        hasLyrics: hasLyrics === 'true',
        hasAudio: hasAudio === 'true',
        startDate,
        endDate
      };

      const result = await musicRequestService.searchRequests({
        query,
        filters,
        pagination: { page, limit },
        sort: { field: sortField, order: sortOrder }
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/requests/:id
  async getRequestById(req, res, next) {
    try {
      const request = await musicRequestService.getRequestById(req.params.id);
      res.json({
        success: true,
        data: request
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/requests
  async createRequest(req, res, next) {
    try {
      const request = await musicRequestService.createRequest(req.body);
      res.status(201).json({
        success: true,
        data: request
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/v1/requests/:id
  async updateRequest(req, res, next) {
    try {
      const request = await musicRequestService.updateRequest(req.params.id, req.body);
      res.json({
        success: true,
        data: request
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/v1/requests/:id/status
  async updateRequestStatus(req, res, next) {
    try {
      const { status } = req.body;
      const request = await musicRequestService.updateRequestStatus(req.params.id, status);
      res.json({
        success: true,
        data: {
          id: request._id,
          status: request.status,
          updatedAt: request.updatedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/v1/requests/:id
  async deleteRequest(req, res, next) {
    try {
      const result = await musicRequestService.deleteRequest(req.params.id);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/v1/requests/:id/lyrics
  async updateLyrics(req, res, next) {
    try {
      const { lyrics, format, changes } = req.body;

      // Validation is now handled by validateLyrics middleware

      const request = await musicRequestService.updateLyrics(req.params.id, lyrics, format, changes);
      res.json({
        success: true,
        data: {
          id: request._id,
          lyrics: request.lyrics,
          format: request.lyricsFormat,
          version: request.lyricsVersion,
          updatedAt: request.updatedAt,
          // Include the latest version details
          latestVersion: request.lyricsVersions && request.lyricsVersions.length > 0 
            ? request.lyricsVersions[request.lyricsVersions.length - 1] 
            : null
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MusicRequestController();
