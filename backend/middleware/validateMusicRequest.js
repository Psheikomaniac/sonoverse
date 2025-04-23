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