const mongoose = require('mongoose');

const musicRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxLength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot be more than 500 characters']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
    enum: ['pop', 'rock', 'jazz', 'classical', 'electronic', 'hip-hop', 'other']
  },
  mood: {
    type: String,
    required: [true, 'Mood is required'],
    trim: true,
    enum: ['happy', 'sad', 'energetic', 'calm', 'aggressive', 'romantic', 'other']
  },
  tempo: {
    type: Number,
    required: [true, 'Tempo is required'],
    min: [40, 'Tempo must be at least 40 BPM'],
    max: [250, 'Tempo cannot exceed 250 BPM']
  },
  lyrics: {
    type: String,
    trim: true,
    maxLength: [5000, 'Lyrics cannot be more than 5000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  audioUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index für häufig abgefragte Felder
musicRequestSchema.index({ status: 1, createdAt: -1 });
musicRequestSchema.index({ genre: 1 });

// Pre-save Hook für die Aktualisierung von updatedAt
musicRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtuals für zusätzliche berechnete Eigenschaften
musicRequestSchema.virtual('isCompleted').get(function() {
  return this.status === 'completed';
});

musicRequestSchema.virtual('processingTime').get(function() {
  if (!this.createdAt || !this.updatedAt) return null;
  return this.updatedAt - this.createdAt;
});

const MusicRequest = mongoose.model('MusicRequest', musicRequestSchema);

module.exports = MusicRequest;
