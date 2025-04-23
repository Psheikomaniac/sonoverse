/**
 * Controller für Status-Management-Operationen
 */

class StatusController {
  /**
   * Aktualisiert den Status einer Musikanfrage und protokolliert die Änderung
   * PATCH /api/v1/requests/:id/status
   */
  async updateStatus(req, res, next) {
    try {
      const { status, notes } = req.body;
      const request = req.musicRequest; // Wurde bereits durch loadMusicRequest geladen

      // Aktualisiere den Status
      const oldStatus = request.status;
      request.status = status;

      // Füge einen Eintrag zur Status-Historie hinzu
      if (!request.statusHistory) {
        request.statusHistory = [];
      }

      request.statusHistory.push({
        status,
        timestamp: new Date(),
        notes: notes || `Status changed from ${oldStatus} to ${status}`
      });

      // Speichere die Änderungen
      await request.save();

      res.json({
        success: true,
        data: {
          id: request._id,
          status: request.status,
          statusHistory: request.statusHistory,
          updatedAt: request.updatedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Holt die Status-Historie einer Musikanfrage
   * GET /api/v1/requests/:id/status/history
   */
  async getStatusHistory(req, res, next) {
    try {
      const request = req.musicRequest; // Wurde bereits durch loadMusicRequest geladen

      res.json({
        success: true,
        data: {
          id: request._id,
          currentStatus: request.status,
          statusHistory: request.statusHistory || []
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StatusController();