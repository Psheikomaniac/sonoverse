/**
 * Migration script for adding extended music parameters to existing music requests
 * 
 * This script updates all existing music request documents in the database
 * to include default values for the new extended music parameters fields.
 * 
 * Run this script once after deploying the updated model.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const MusicRequest = require('../models/musicRequest');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

async function migrateExtendedMusicParameters() {
  try {
    console.log('Starting migration of extended music parameters...');
    
    // Find all music requests
    const requests = await MusicRequest.find({});
    console.log(`Found ${requests.length} music requests to update`);
    
    // Default values for new fields
    const defaultValues = {
      instrumentList: [],
      referenceTrackUrl: '',
      keySignature: null,
      targetAudience: '',
      vocalStyle: '',
      structureNotes: ''
    };
    
    // Update each request with default values for new fields if they don't exist
    let updatedCount = 0;
    for (const request of requests) {
      let needsUpdate = false;
      
      // Check each field and set default value if it doesn't exist
      for (const [field, defaultValue] of Object.entries(defaultValues)) {
        if (request[field] === undefined) {
          request[field] = defaultValue;
          needsUpdate = true;
        }
      }
      
      // Save the request if it needs updating
      if (needsUpdate) {
        await request.save();
        updatedCount++;
      }
    }
    
    console.log(`Migration completed. Updated ${updatedCount} music requests.`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
migrateExtendedMusicParameters();