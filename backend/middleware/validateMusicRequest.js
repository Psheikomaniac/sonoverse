/**
 * Middleware zur Validierung von Musikanfragen
 * Validiert eingehende Anfragedaten basierend auf dem MusicRequest-Schema
 */

const validateMusicRequest = (req, res, next) => {
  const { title, genre, mood, tempo, lyrics } = req.body;
  const errors = [];

  // Validiere Titel
  if (!title) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (title.length > 100) {
    errors.push({ field: 'title', message: 'Title cannot be more than 100 characters' });
  }

  // Validiere Genre
  const validGenres = ['pop', 'rock', 'jazz', 'classical', 'electronic', 'hip-hop', 'other'];
  if (!genre) {
    errors.push({ field: 'genre', message: 'Genre is required' });
  } else if (!validGenres.includes(genre)) {
    errors.push({ field: 'genre', message: `Genre must be one of: ${validGenres.join(', ')}` });
  }

  // Validiere Mood
  const validMoods = ['happy', 'sad', 'energetic', 'calm', 'aggressive', 'romantic', 'other'];
  if (!mood) {
    errors.push({ field: 'mood', message: 'Mood is required' });
  } else if (!validMoods.includes(mood)) {
    errors.push({ field: 'mood', message: `Mood must be one of: ${validMoods.join(', ')}` });
  }

  // Validiere Tempo
  if (tempo === undefined || tempo === null) {
    errors.push({ field: 'tempo', message: 'Tempo is required' });
  } else {
    const tempoNum = Number(tempo);
    if (isNaN(tempoNum)) {
      errors.push({ field: 'tempo', message: 'Tempo must be a number' });
    } else if (tempoNum < 40) {
      errors.push({ field: 'tempo', message: 'Tempo must be at least 40 BPM' });
    } else if (tempoNum > 250) {
      errors.push({ field: 'tempo', message: 'Tempo cannot exceed 250 BPM' });
    }
  }

  // Validiere Lyrics (optional)
  if (lyrics && lyrics.length > 5000) {
    errors.push({ field: 'lyrics', message: 'Lyrics cannot be more than 5000 characters' });
  }

  // Validiere Description (optional)
  if (req.body.description && req.body.description.length > 500) {
    errors.push({ field: 'description', message: 'Description cannot be more than 500 characters' });
  }

  // Validiere instrumentList (optional)
  if (req.body.instrumentList) {
    if (!Array.isArray(req.body.instrumentList)) {
      errors.push({ field: 'instrumentList', message: 'Instrument list must be an array' });
    } else if (req.body.instrumentList.length > 20) {
      errors.push({ field: 'instrumentList', message: 'Instrument list cannot contain more than 20 instruments' });
    }
  }

  // Validiere referenceTrackUrl (optional)
  if (req.body.referenceTrackUrl) {
    try {
      new URL(req.body.referenceTrackUrl);
    } catch (e) {
      errors.push({ field: 'referenceTrackUrl', message: 'Reference track URL must be a valid URL' });
    }
  }

  // Validiere keySignature (optional)
  if (req.body.keySignature) {
    const validKeySignatures = [
      'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 
      'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
      'C minor', 'C# minor', 'Db minor', 'D minor', 'D# minor', 
      'Eb minor', 'E minor', 'F minor', 'F# minor', 'Gb minor', 
      'G minor', 'G# minor', 'Ab minor', 'A minor', 'A# minor', 
      'Bb minor', 'B minor'
    ];
    if (!validKeySignatures.includes(req.body.keySignature)) {
      errors.push({ field: 'keySignature', message: `Key signature must be one of: ${validKeySignatures.join(', ')}` });
    }
  }

  // Validiere targetAudience (optional)
  if (req.body.targetAudience && req.body.targetAudience.length > 200) {
    errors.push({ field: 'targetAudience', message: 'Target audience description cannot be more than 200 characters' });
  }

  // Validiere vocalStyle (optional)
  if (req.body.vocalStyle && req.body.vocalStyle.length > 200) {
    errors.push({ field: 'vocalStyle', message: 'Vocal style description cannot be more than 200 characters' });
  }

  // Validiere structureNotes (optional)
  if (req.body.structureNotes && req.body.structureNotes.length > 500) {
    errors.push({ field: 'structureNotes', message: 'Structure notes cannot be more than 500 characters' });
  }

  // Wenn Fehler gefunden wurden, sende Fehlerantwort
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors,
      message: 'Validation failed'
    });
  }

  // Wenn keine Fehler, fahre mit dem nächsten Middleware fort
  next();
};

module.exports = validateMusicRequest;
