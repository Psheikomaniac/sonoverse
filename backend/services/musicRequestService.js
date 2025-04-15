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
   * @param {Object} options - Filteroptionen (limit, page, status)
   * @returns {Promise<Object>} Musikanfragen und Pagination-Informationen
   */
  async getAllRequests({ limit = 10, page = 1, status = null }) {
    try {
      const query = status ? { status } : {};
      const skip = (page - 1) * limit;

      const [requests, total] = await Promise.all([
        MusicRequest.find(query)
          .sort({ createdAt: -1 })
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
