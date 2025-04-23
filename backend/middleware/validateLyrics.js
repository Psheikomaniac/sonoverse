/**
 * Middleware zur erweiterten Validierung von Songtexten
 * Validiert Songtexte auf Länge, Format und Struktur
 */

const validateLyrics = (req, res, next) => {
  const { lyrics } = req.body;
  const errors = [];

  // Prüfe, ob Lyrics vorhanden sind
  if (lyrics === undefined || lyrics === null) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Lyrics are required',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Validiere Länge
  if (lyrics.length > 5000) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Lyrics cannot be more than 5000 characters',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Validiere Mindestlänge
  if (lyrics.length < 10) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Lyrics must be at least 10 characters',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Validiere Struktur (Prüfe auf Verse/Strophen)
  const lines = lyrics.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Lyrics must have at least 2 lines',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Validiere Format (Prüfe auf übermäßige Wiederholungen)
  const uniqueLines = new Set(lines.map(line => line.trim().toLowerCase()));
  if (uniqueLines.size < lines.length * 0.3) { // Mindestens 30% der Zeilen sollten einzigartig sein
    return res.status(400).json({
      success: false,
      error: {
        message: 'Lyrics have too many repetitive lines',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Validiere auf unerwünschte Zeichen oder Muster
  const forbiddenPatterns = [
    /^\s*$/,  // Leere Zeilen wurden bereits oben gefiltert
    /^[^a-zA-Z0-9äöüÄÖÜß\s,.!?'"()\-:;]+$/  // Zeilen, die nur aus Sonderzeichen bestehen
  ];

  for (const line of lines) {
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(line)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Lyrics contain invalid characters or patterns',
            code: 'VALIDATION_ERROR'
          }
        });
      }
    }
  }

  // Wenn keine Fehler, fahre mit dem nächsten Middleware fort
  next();
};

module.exports = validateLyrics;