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
   * Aktualisiert den Songtext einer Musikanfrage mit Versionierung und Formatierung
   * @param {string} id - Die ID der Musikanfrage
   * @param {string} lyrics - Der neue Songtext
   * @param {Object} format - Formatierungsoptionen für den Songtext
   * @param {string} changes - Optionale Beschreibung der Änderungen
   * @returns {Promise<Object>} Die aktualisierte Musikanfrage
   */
  async updateLyrics(id, lyrics, format = {}, changes = '') {
    try {
      const request = await MusicRequest.findById(id);
      if (!request) {
        const error = new Error('Music request not found');
        error.code = 'REQUEST_NOT_FOUND';
        throw error;
      }

      // Bestimme die nächste Versionsnummer
      let nextVersion = 1;
      if (request.lyricsVersions && request.lyricsVersions.length > 0) {
        nextVersion = Math.max(...request.lyricsVersions.map(v => v.version)) + 1;
      }

      // Validiere und normalisiere das Format-Objekt
      const normalizedFormat = this._normalizeFormatObject(format);

      // Erstelle einen neuen Versionseintrag
      const newVersion = {
        text: lyrics,
        format: normalizedFormat,
        version: nextVersion,
        createdAt: new Date(),
        changes: changes
      };

      // Füge die neue Version hinzu
      if (!request.lyricsVersions) {
        request.lyricsVersions = [];
      }
      request.lyricsVersions.push(newVersion);

      // Speichere die Änderungen
      return await request.save();
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Holt den Versionsverlauf eines Songtextes
   * @param {string} id - Die ID der Musikanfrage
   * @returns {Promise<Object>} Die Versionshistorie des Songtextes
   */
  async getLyricsHistory(id) {
    try {
      const request = await MusicRequest.findById(id);
      if (!request) {
        const error = new Error('Music request not found');
        error.code = 'REQUEST_NOT_FOUND';
        throw error;
      }

      if (!request.lyricsVersions || request.lyricsVersions.length === 0) {
        return { versions: [] };
      }

      // Sortiere die Versionen nach Versionsnummer absteigend (neueste zuerst)
      const sortedVersions = [...request.lyricsVersions].sort((a, b) => b.version - a.version);

      // Bereite die Antwort vor
      return {
        requestId: request._id,
        title: request.title,
        currentVersion: request.lyricsVersion,
        versions: sortedVersions.map(v => ({
          version: v.version,
          text: v.text,
          format: v.format,
          createdAt: v.createdAt,
          changes: v.changes
        }))
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Holt eine spezifische Version eines Songtextes
   * @param {string} id - Die ID der Musikanfrage
   * @param {number} version - Die Versionsnummer
   * @returns {Promise<Object>} Die angeforderte Version des Songtextes
   */
  async getLyricsVersion(id, version) {
    try {
      const request = await MusicRequest.findById(id);
      if (!request) {
        const error = new Error('Music request not found');
        error.code = 'REQUEST_NOT_FOUND';
        throw error;
      }

      if (!request.lyricsVersions || request.lyricsVersions.length === 0) {
        const error = new Error('No lyrics versions found for this request');
        error.code = 'VERSION_NOT_FOUND';
        throw error;
      }

      // Finde die angeforderte Version
      const requestedVersion = request.lyricsVersions.find(v => v.version === parseInt(version));
      if (!requestedVersion) {
        const error = new Error(`Lyrics version ${version} not found`);
        error.code = 'VERSION_NOT_FOUND';
        throw error;
      }

      // Bereite die Antwort vor
      return {
        requestId: request._id,
        title: request.title,
        currentVersion: request.lyricsVersion,
        requestedVersion: {
          version: requestedVersion.version,
          text: requestedVersion.text,
          format: requestedVersion.format,
          createdAt: requestedVersion.createdAt,
          changes: requestedVersion.changes
        }
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Vergleicht zwei Versionen eines Songtextes
   * @param {string} id - Die ID der Musikanfrage
   * @param {number} version1 - Die erste Versionsnummer
   * @param {number} version2 - Die zweite Versionsnummer
   * @returns {Promise<Object>} Der Vergleich der beiden Versionen
   */
  async compareLyricsVersions(id, version1, version2) {
    try {
      const request = await MusicRequest.findById(id);
      if (!request) {
        const error = new Error('Music request not found');
        error.code = 'REQUEST_NOT_FOUND';
        throw error;
      }

      if (!request.lyricsVersions || request.lyricsVersions.length < 2) {
        const error = new Error('Not enough versions to compare');
        error.code = 'COMPARISON_ERROR';
        throw error;
      }

      // Parse die Versionsnummern
      const v1 = parseInt(version1);
      const v2 = parseInt(version2);

      // Finde die angeforderten Versionen
      const version1Data = request.lyricsVersions.find(v => v.version === v1);
      const version2Data = request.lyricsVersions.find(v => v.version === v2);

      if (!version1Data) {
        const error = new Error(`Lyrics version ${version1} not found`);
        error.code = 'VERSION_NOT_FOUND';
        throw error;
      }

      if (!version2Data) {
        const error = new Error(`Lyrics version ${version2} not found`);
        error.code = 'VERSION_NOT_FOUND';
        throw error;
      }

      // Bereite die Antwort vor
      return {
        requestId: request._id,
        title: request.title,
        currentVersion: request.lyricsVersion,
        comparison: {
          version1: {
            version: version1Data.version,
            text: version1Data.text,
            format: version1Data.format,
            createdAt: version1Data.createdAt,
            changes: version1Data.changes
          },
          version2: {
            version: version2Data.version,
            text: version2Data.text,
            format: version2Data.format,
            createdAt: version2Data.createdAt,
            changes: version2Data.changes
          }
        }
      };
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Normalisiert und validiert das Format-Objekt
   * @private
   * @param {Object} format - Das zu normalisierende Format-Objekt
   * @returns {Object} Das normalisierte Format-Objekt
   */
  _normalizeFormatObject(format) {
    // Erstelle ein Basis-Format-Objekt mit Standardwerten
    const normalizedFormat = {
      structure: [],
      styles: []
    };

    // Wenn kein Format-Objekt übergeben wurde, gib das Standard-Objekt zurück
    if (!format) return normalizedFormat;

    // Füge Struktur-Informationen hinzu, falls vorhanden
    if (format.structure && Array.isArray(format.structure)) {
      // Validiere jedes Struktur-Element
      normalizedFormat.structure = format.structure
        .filter(item => item && typeof item === 'object')
        .map(item => ({
          type: item.type || 'verse', // Standard: verse
          startLine: parseInt(item.startLine) || 0,
          endLine: parseInt(item.endLine) || 0,
          label: item.label || ''
        }));
    }

    // Füge Stil-Informationen hinzu, falls vorhanden
    if (format.styles && Array.isArray(format.styles)) {
      // Validiere jedes Stil-Element
      normalizedFormat.styles = format.styles
        .filter(item => item && typeof item === 'object')
        .map(item => ({
          type: item.type || 'normal', // Standard: normal
          startPos: parseInt(item.startPos) || 0,
          endPos: parseInt(item.endPos) || 0,
          line: parseInt(item.line) || 0
        }));
    }

    return normalizedFormat;
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
