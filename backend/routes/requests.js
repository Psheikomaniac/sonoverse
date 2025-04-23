const express = require('express');
const router = express.Router();
const musicRequestController = require('../controllers/musicRequestController');
const validateMusicRequest = require('../middleware/validateMusicRequest');
const validateLyrics = require('../middleware/validateLyrics');

// GET /api/v1/requests - Alle Musikanfragen abrufen
router.get('/', musicRequestController.getAllRequests);

// GET /api/v1/requests/search - Musikanfragen suchen
router.get('/search', musicRequestController.searchRequests);

// GET /api/v1/requests/:id - Einzelne Musikanfrage abrufen
router.get('/:id', musicRequestController.getRequestById);

// POST /api/v1/requests - Neue Musikanfrage erstellen
router.post('/', validateMusicRequest, musicRequestController.createRequest);

// PUT /api/v1/requests/:id - Musikanfrage aktualisieren
router.put('/:id', validateMusicRequest, musicRequestController.updateRequest);

// PATCH /api/v1/requests/:id/status - Status einer Musikanfrage aktualisieren
router.patch('/:id/status', musicRequestController.updateRequestStatus);

// PATCH /api/v1/requests/:id/lyrics - Songtext einer Musikanfrage aktualisieren
router.patch('/:id/lyrics', validateLyrics, musicRequestController.updateLyrics);

// GET /api/v1/requests/:id/lyrics/history - Versionsverlauf eines Songtextes abrufen
router.get('/:id/lyrics/history', musicRequestController.getLyricsHistory);

// GET /api/v1/requests/:id/lyrics/versions/:version - Spezifische Version eines Songtextes abrufen
router.get('/:id/lyrics/versions/:version', musicRequestController.getLyricsVersion);

// GET /api/v1/requests/:id/lyrics/compare - Verschiedene Versionen eines Songtextes vergleichen
router.get('/:id/lyrics/compare', musicRequestController.compareLyricsVersions);

// DELETE /api/v1/requests/:id - Musikanfrage löschen
router.delete('/:id', musicRequestController.deleteRequest);

module.exports = router;
