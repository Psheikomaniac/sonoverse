const express = require('express');
const router = express.Router();
const musicRequestController = require('../controllers/musicRequestController');

// GET /api/v1/requests - Alle Musikanfragen abrufen
router.get('/', musicRequestController.getAllRequests);

// GET /api/v1/requests/:id - Einzelne Musikanfrage abrufen
router.get('/:id', musicRequestController.getRequestById);

// POST /api/v1/requests - Neue Musikanfrage erstellen
router.post('/', musicRequestController.createRequest);

// PUT /api/v1/requests/:id - Musikanfrage aktualisieren
router.put('/:id', musicRequestController.updateRequest);

// PATCH /api/v1/requests/:id/status - Status einer Musikanfrage aktualisieren
router.patch('/:id/status', musicRequestController.updateRequestStatus);

// DELETE /api/v1/requests/:id - Musikanfrage löschen
router.delete('/:id', musicRequestController.deleteRequest);

module.exports = router;
