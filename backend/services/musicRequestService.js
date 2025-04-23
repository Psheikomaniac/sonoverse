const MusicRequest = require('../models/musicRequest');

class MusicRequestService {
  /**
   * Erstellt eine neue Musikanfrage
   * @param {Object} requestData - Die Daten für die neue Musikanfrage
   * @returns {Promise<Object>} Die erstellte Musikanfrage
   */
  async createRequest(requestData) {
    try {
      const request = new MusicRequest(requestData);
      await request.validate(); // Explizite Validierung vor dem Speichern
      return await request.save();
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Holt alle Musikanfragen mit Pagination und Filteroptionen
   * @param {Object} options - Filteroptionen (limit, page, status, genre, startDate, endDate, sortBy, sortOrder)
   * @returns {Promise<Object>} Musikanfragen und Pagination-Informationen
   */
  async getAllRequests({ 
    limit = 10, 
    page = 1, 
    status = null, 
    genre = null, 
    startDate = null, 
    endDate = null,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  }) {
    try {
      // Build query based on filters
      const query = {};

      if (status) {
        query.status = status;
      }

      if (genre) {
        query.genre = genre;
      }

      // Date range filter
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          query.createdAt.$lte = new Date(endDate);
        }
      }

      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      const validSortFields = ['createdAt', 'title', 'genre', 'mood', 'tempo'];

      if (validSortFields.includes(sortBy)) {
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      } else {
        sort.createdAt = -1; // Default sort
      }

      const [requests, total] = await Promise.all([
        MusicRequest.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit),
        MusicRequest.countDocuments(query)
      ]);

      return {
        requests,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Holt eine spezifische Musikanfrage anhand ihrer ID
   * @param {string} id - Die ID der Musikanfrage
   * @returns {Promise<Object>} Die gefundene Musikanfrage
   */
  async getRequestById(id) {
    try {
      const request = await MusicRequest.findById(id);
      if (!request) {
        const error = new Error('Music request not found');
        error.code = 'REQUEST_NOT_FOUND';
        throw error;
      }
      return request;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Aktualisiert eine Musikanfrage
   * @param {string} id - Die ID der Musikanfrage
   * @param {Object} updateData - Die zu aktualisierenden Daten
   * @returns {Promise<Object>} Die aktualisierte Musikanfrage
   */
  async updateRequest(id, updateData) {
    try {
      const request = await MusicRequest.findById(id);
      if (!request) {
        const error = new Error('Music request not found');
        error.code = 'REQUEST_NOT_FOUND';
        throw error;
      }

      Object.assign(request, updateData);
      await request.validate(); // Validiere die Änderungen
      return await request.save();
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Aktualisiert den Status einer Musikanfrage
   * @param {string} id - Die ID der Musikanfrage
   * @param {string} status - Der neue Status
   * @returns {Promise<Object>} Die aktualisierte Musikanfrage
   */
  async updateRequestStatus(id, status) {
    try {
      const validStatuses = ['pending', 'in_progress', 'completed'];
      if (!validStatuses.includes(status)) {
        const error = new Error('Invalid status value');
        error.code = 'VALIDATION_ERROR';
        throw error;
      }

      const request = await MusicRequest.findById(id);
      if (!request) {
        const error = new Error('Music request not found');
        error.code = 'REQUEST_NOT_FOUND';
        throw error;
      }

      request.status = status;
      return await request.save();
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Löscht eine Musikanfrage
   * @param {string} id - Die ID der Musikanfrage
   * @returns {Promise<Object>} Bestätigungsnachricht
   */
  async deleteRequest(id) {
    try {
      const request = await MusicRequest.findById(id);
      if (!request) {
        const error = new Error('Music request not found');
        error.code = 'REQUEST_NOT_FOUND';
        throw error;
      }

      await request.deleteOne();
      return { message: 'Music request deleted successfully' };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Aktualisiert die Audio-URL einer Musikanfrage
   * @param {string} id - Die ID der Musikanfrage
   * @param {string} audioUrl - Die neue Audio-URL
   * @returns {Promise<Object>} Die aktualisierte Musikanfrage
   */
  async updateAudioUrl(id, audioUrl) {
    try {
      const request = await MusicRequest.findById(id);
      if (!request) {
        const error = new Error('Music request not found');
        error.code = 'REQUEST_NOT_FOUND';
        throw error;
      }

      request.audioUrl = audioUrl;
      return await request.save();
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Aktualisiert die Audio-URL und Metadaten einer Musikanfrage
   * @param {string} id - Die ID der Musikanfrage
   * @param {string} audioUrl - Die neue Audio-URL
   * @param {Object} metadata - Die Metadaten der Audiodatei
   * @returns {Promise<Object>} Die aktualisierte Musikanfrage
   */
  async updateAudioWithMetadata(id, audioUrl, metadata) {
    try {
      const request = await MusicRequest.findById(id);
      if (!request) {
        const error = new Error('Music request not found');
        error.code = 'REQUEST_NOT_FOUND';
        throw error;
      }

      request.audioUrl = audioUrl;
      request.audioMetadata = metadata;
      return await request.save();
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Sucht Musikanfragen nach verschiedenen Kriterien
   * @param {Object} searchParams - Suchparameter
   * @param {string} searchParams.query - Suchbegriff für Titel oder Beschreibung
   * @param {Object} searchParams.filters - Zusätzliche Filter (status, genre, mood)
   * @param {Object} searchParams.pagination - Paginierungsoptionen (page, limit)
   * @param {Object} searchParams.sort - Sortieroptionen (field, order)
   * @returns {Promise<Object>} Gefundene Musikanfragen und Pagination-Informationen
   */
  async searchRequests({ 
    query = '', 
    filters = {}, 
    pagination = { page: 1, limit: 10 },
    sort = { field: 'createdAt', order: 'desc' }
  }) {
    try {
      const { page, limit } = pagination;
      const { field: sortField = 'createdAt', order: sortOrder = 'desc' } = sort;
      const skip = (page - 1) * limit;

      // Build search query
      const searchQuery = {};

      // Text search in title and description
      if (query && query.trim() !== '') {
        searchQuery.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ];
      }

      // Apply filters
      if (filters.status) {
        searchQuery.status = filters.status;
      }

      if (filters.genre) {
        searchQuery.genre = filters.genre;
      }

      if (filters.mood) {
        searchQuery.mood = filters.mood;
      }

      if (filters.hasLyrics) {
        searchQuery.lyrics = { $exists: true, $ne: '' };
      }

      if (filters.hasAudio) {
        searchQuery.audioUrl = { $exists: true, $ne: '' };
      }

      // Date range filter
      if (filters.startDate || filters.endDate) {
        searchQuery.createdAt = {};
        if (filters.startDate) {
          searchQuery.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          searchQuery.createdAt.$lte = new Date(filters.endDate);
        }
      }

      // Build sort object
      const sortObj = {};
      const validSortFields = ['createdAt', 'title', 'genre', 'mood', 'tempo'];

      if (validSortFields.includes(sortField)) {
        sortObj[sortField] = sortOrder === 'asc' ? 1 : -1;
      } else {
        sortObj.createdAt = -1; // Default sort
      }

      const [requests, total] = await Promise.all([
        MusicRequest.find(searchQuery)
          .sort(sortObj)
          .skip(skip)
          .limit(limit),
        MusicRequest.countDocuments(searchQuery)
      ]);

      return {
        requests,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Aktualisiert den Songtext einer Musikanfrage
   * @param {string} id - Die ID der Musikanfrage
   * @param {string} lyrics - Der neue Songtext
   * @returns {Promise<Object>} Die aktualisierte Musikanfrage
   */
  async updateLyrics(id, lyrics) {
    try {
      const request = await MusicRequest.findById(id);
      if (!request) {
        const error = new Error('Music request not found');
        error.code = 'REQUEST_NOT_FOUND';
        throw error;
      }

      // Validate lyrics length
      if (lyrics.length > 5000) {
        const error = new Error('Lyrics cannot be more than 5000 characters');
        error.code = 'VALIDATION_ERROR';
        throw error;
      }

      request.lyrics = lyrics;
      return await request.save();
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Standardisierte Fehlerbehandlung
   * @private
   */
  _handleError(error) {
    if (error.name === 'ValidationError') {
      error.code = 'VALIDATION_ERROR';
    } else if (error.name === 'CastError') {
      error.message = 'Invalid ID format';
      error.code = 'VALIDATION_ERROR';
    }

    if (!error.code) {
      error.code = 'SERVER_ERROR';
    }

    return error;
  }
}

module.exports = new MusicRequestService();
