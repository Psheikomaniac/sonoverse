/**
 * Middleware zur Validierung von Status-Übergängen
 * Validiert, dass der angeforderte Status-Übergang gültig ist
 */

const validateStatusTransition = (req, res, next) => {
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Status is required',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Validiere, dass der Status gültig ist
  const validStatuses = ['received', 'writing', 'recording', 'mixing', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: {
        message: `Status must be one of: ${validStatuses.join(', ')}`,
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Hole den aktuellen Status aus der Anfrage
  // Hinweis: Dies setzt voraus, dass die Anfrage bereits in req.musicRequest geladen wurde
  // oder dass die ID in req.params.id verfügbar ist und die Anfrage später geladen wird
  const currentStatus = req.musicRequest ? req.musicRequest.status : null;

  // Wenn kein aktueller Status verfügbar ist, überspringe die Übergangsvalidierung
  if (!currentStatus) {
    return next();
  }

  // Definiere erlaubte Übergänge
  const allowedTransitions = {
    'received': ['writing'],
    'writing': ['recording'],
    'recording': ['mixing'],
    'mixing': ['completed'],
    'completed': [] // Keine weiteren Übergänge von 'completed' erlaubt
  };

  // Prüfe, ob der Übergang erlaubt ist
  if (status !== currentStatus && !allowedTransitions[currentStatus]?.includes(status)) {
    return res.status(400).json({
      success: false,
      error: {
        message: `Invalid status transition from ${currentStatus} to ${status}`,
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Wenn alles in Ordnung ist, fahre mit dem nächsten Middleware fort
  next();
};

module.exports = validateStatusTransition;