/**
 * Middleware zur Validierung von Songtexten
 * Validiert eingehende Songtext-Daten für Musikanfragen
 */

const validateLyrics = (req, res, next) => {
  const { lyrics, format } = req.body;
  const errors = [];

  // Validiere, dass Lyrics vorhanden sind
  if (lyrics === undefined) {
    errors.push({ field: 'lyrics', message: 'Lyrics are required' });
  } else if (lyrics.length > 5000) {
    errors.push({ field: 'lyrics', message: 'Lyrics cannot be more than 5000 characters' });
  }

  // Validiere Format-Objekt, falls vorhanden
  if (format) {
    // Validiere Struktur-Array
    if (format.structure && !Array.isArray(format.structure)) {
      errors.push({ field: 'format.structure', message: 'Structure must be an array' });
    } else if (format.structure && Array.isArray(format.structure)) {
      // Validiere jedes Struktur-Element
      format.structure.forEach((item, index) => {
        if (!item || typeof item !== 'object') {
          errors.push({ field: `format.structure[${index}]`, message: 'Structure item must be an object' });
        } else {
          // Validiere Typ
          if (!item.type) {
            errors.push({ field: `format.structure[${index}].type`, message: 'Structure item type is required' });
          } else if (!['verse', 'chorus', 'bridge', 'intro', 'outro', 'pre-chorus', 'hook'].includes(item.type)) {
            errors.push({ 
              field: `format.structure[${index}].type`, 
              message: 'Structure item type must be one of: verse, chorus, bridge, intro, outro, pre-chorus, hook' 
            });
          }
          
          // Validiere Start- und Endzeile
          if (item.startLine === undefined || item.startLine === null) {
            errors.push({ field: `format.structure[${index}].startLine`, message: 'Structure item startLine is required' });
          } else if (isNaN(parseInt(item.startLine))) {
            errors.push({ field: `format.structure[${index}].startLine`, message: 'Structure item startLine must be a number' });
          }
          
          if (item.endLine === undefined || item.endLine === null) {
            errors.push({ field: `format.structure[${index}].endLine`, message: 'Structure item endLine is required' });
          } else if (isNaN(parseInt(item.endLine))) {
            errors.push({ field: `format.structure[${index}].endLine`, message: 'Structure item endLine must be a number' });
          } else if (parseInt(item.endLine) < parseInt(item.startLine)) {
            errors.push({ 
              field: `format.structure[${index}].endLine`, 
              message: 'Structure item endLine must be greater than or equal to startLine' 
            });
          }
        }
      });
    }

    // Validiere Styles-Array
    if (format.styles && !Array.isArray(format.styles)) {
      errors.push({ field: 'format.styles', message: 'Styles must be an array' });
    } else if (format.styles && Array.isArray(format.styles)) {
      // Validiere jedes Style-Element
      format.styles.forEach((item, index) => {
        if (!item || typeof item !== 'object') {
          errors.push({ field: `format.styles[${index}]`, message: 'Style item must be an object' });
        } else {
          // Validiere Typ
          if (!item.type) {
            errors.push({ field: `format.styles[${index}].type`, message: 'Style item type is required' });
          } else if (!['bold', 'italic', 'underline', 'normal', 'header'].includes(item.type)) {
            errors.push({ 
              field: `format.styles[${index}].type`, 
              message: 'Style item type must be one of: bold, italic, underline, normal, header' 
            });
          }
          
          // Validiere Start- und Endposition
          if (item.startPos === undefined || item.startPos === null) {
            errors.push({ field: `format.styles[${index}].startPos`, message: 'Style item startPos is required' });
          } else if (isNaN(parseInt(item.startPos))) {
            errors.push({ field: `format.styles[${index}].startPos`, message: 'Style item startPos must be a number' });
          }
          
          if (item.endPos === undefined || item.endPos === null) {
            errors.push({ field: `format.styles[${index}].endPos`, message: 'Style item endPos is required' });
          } else if (isNaN(parseInt(item.endPos))) {
            errors.push({ field: `format.styles[${index}].endPos`, message: 'Style item endPos must be a number' });
          } else if (parseInt(item.endPos) < parseInt(item.startPos)) {
            errors.push({ 
              field: `format.styles[${index}].endPos`, 
              message: 'Style item endPos must be greater than or equal to startPos' 
            });
          }
          
          // Validiere Zeile
          if (item.line === undefined || item.line === null) {
            errors.push({ field: `format.styles[${index}].line`, message: 'Style item line is required' });
          } else if (isNaN(parseInt(item.line))) {
            errors.push({ field: `format.styles[${index}].line`, message: 'Style item line must be a number' });
          }
        }
      });
    }
  }

  // Wenn Fehler gefunden wurden, sende Fehlerantwort
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      }
    });
  }

  // Wenn keine Fehler, fahre mit dem nächsten Middleware fort
  next();
};

module.exports = validateLyrics;