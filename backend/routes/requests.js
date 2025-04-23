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

// DELETE /api/v1/requests/:id - Musikanfrage löschen
router.delete('/:id', musicRequestController.deleteRequest);

module.exports = router;
