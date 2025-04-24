const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const MusicRequest = require('../models/musicRequest');

beforeEach(async () => {
  await MusicRequest.deleteMany({});
});

describe('Music Request API', () => {
  const sampleRequest = {
    title: 'Test Song',
    description: 'A test song description',
    genre: 'pop',
    mood: 'happy',
    tempo: 120,
    lyrics: 'Test lyrics'
  };

  describe('POST /api/v1/requests', () => {
    it('should create a new music request', async () => {
      const res = await request(app)
        .post('/api/v1/requests')
        .send(sampleRequest);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('title', sampleRequest.title);
      expect(res.body.data).toHaveProperty('status', 'received');
    });

    it('should create a music request with extended parameters', async () => {
      const extendedRequest = {
        ...sampleRequest,
        instrumentList: ['guitar', 'piano', 'drums'],
        referenceTrackUrl: 'https://example.com/reference.mp3',
        keySignature: 'C minor',
        targetAudience: 'Young adults',
        vocalStyle: 'Soft and melodic',
        structureNotes: 'Verse-Chorus-Verse-Chorus-Bridge-Chorus'
      };

      const res = await request(app)
        .post('/api/v1/requests')
        .send(extendedRequest);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('title', extendedRequest.title);
      expect(res.body.data).toHaveProperty('instrumentList');
      expect(res.body.data.instrumentList).toEqual(extendedRequest.instrumentList);
      expect(res.body.data).toHaveProperty('referenceTrackUrl', extendedRequest.referenceTrackUrl);
      expect(res.body.data).toHaveProperty('keySignature', extendedRequest.keySignature);
      expect(res.body.data).toHaveProperty('targetAudience', extendedRequest.targetAudience);
      expect(res.body.data).toHaveProperty('vocalStyle', extendedRequest.vocalStyle);
      expect(res.body.data).toHaveProperty('structureNotes', extendedRequest.structureNotes);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/v1/requests')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/requests', () => {
    beforeEach(async () => {
      await MusicRequest.create([
        sampleRequest,
        { ...sampleRequest, title: 'Second Song', genre: 'rock' },
        { ...sampleRequest, title: 'Third Song', genre: 'jazz', createdAt: new Date('2023-01-01') },
        { 
          ...sampleRequest, 
          title: 'Extended Song', 
          genre: 'electronic', 
          instrumentList: ['synthesizer', 'drums', 'bass'],
          keySignature: 'A minor',
          targetAudience: 'Young adults',
          vocalStyle: 'Electronic vocals',
          structureNotes: 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro'
        }
      ]);
    });

    it('should get all music requests with pagination', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .query({ page: 1, limit: 2 });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(2);
      expect(res.body.data.pagination.total).toBe(4);
    });

    it('should filter requests by status', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .query({ status: 'received' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.requests.every(req => req.status === 'received')).toBe(true);
    });

    it('should filter requests by genre', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .query({ genre: 'rock' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(1);
      expect(res.body.data.requests[0].genre).toBe('rock');
    });

    it('should filter requests by date range', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .query({ 
          startDate: '2023-01-01', 
          endDate: '2023-01-31' 
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(1);
      expect(res.body.data.requests[0].title).toBe('Third Song');
    });

    it('should sort requests by specified field', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .query({ 
          sortBy: 'title',
          sortOrder: 'asc'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(4);
      expect(res.body.data.requests[0].title).toBe('Extended Song');
      expect(res.body.data.requests[1].title).toBe('Second Song');
      expect(res.body.data.requests[2].title).toBe('Test Song');
      expect(res.body.data.requests[3].title).toBe('Third Song');
    });

    it('should filter requests by instrumentList', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .query({ instrumentList: ['synthesizer'] });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(1);
      expect(res.body.data.requests[0].title).toBe('Extended Song');
    });

    it('should filter requests by keySignature', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .query({ keySignature: 'A minor' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(1);
      expect(res.body.data.requests[0].title).toBe('Extended Song');
    });

    it('should filter requests by targetAudience', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .query({ targetAudience: 'Young' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(1);
      expect(res.body.data.requests[0].title).toBe('Extended Song');
    });

    it('should filter requests by vocalStyle', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .query({ vocalStyle: 'Electronic' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(1);
      expect(res.body.data.requests[0].title).toBe('Extended Song');
    });

    it('should filter requests by structureNotes', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .query({ structureNotes: 'Bridge' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(1);
      expect(res.body.data.requests[0].title).toBe('Extended Song');
    });

    it('should sort requests by keySignature', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .query({ 
          sortBy: 'keySignature',
          sortOrder: 'asc'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(4);
      // The request with keySignature 'A minor' should be first in ascending order
      expect(res.body.data.requests[0].title).toBe('Extended Song');
    });
  });

  describe('GET /api/v1/requests/:id', () => {
    let createdRequest;

    beforeEach(async () => {
      createdRequest = await MusicRequest.create(sampleRequest);
    });

    it('should get a specific music request', async () => {
      const res = await request(app)
        .get(`/api/v1/requests/${createdRequest._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('title', sampleRequest.title);
    });

    it('should return 404 for non-existent request', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/v1/requests/${nonExistentId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error.code).toBe('REQUEST_NOT_FOUND');
    });
  });

  describe('PUT /api/v1/requests/:id', () => {
    let createdRequest;

    beforeEach(async () => {
      createdRequest = await MusicRequest.create(sampleRequest);
    });

    it('should update a music request', async () => {
      const updates = {
        title: 'Updated Title',
        tempo: 140
      };

      const res = await request(app)
        .put(`/api/v1/requests/${createdRequest._id}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('title', updates.title);
      expect(res.body.data).toHaveProperty('tempo', updates.tempo);
    });

    it('should update a music request with extended parameters', async () => {
      const updates = {
        title: 'Extended Update',
        instrumentList: ['violin', 'cello', 'piano'],
        referenceTrackUrl: 'https://example.com/updated-reference.mp3',
        keySignature: 'D minor',
        targetAudience: 'Classical music enthusiasts',
        vocalStyle: 'Operatic',
        structureNotes: 'Sonata form with development section'
      };

      const res = await request(app)
        .put(`/api/v1/requests/${createdRequest._id}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('title', updates.title);
      expect(res.body.data).toHaveProperty('instrumentList');
      expect(res.body.data.instrumentList).toEqual(updates.instrumentList);
      expect(res.body.data).toHaveProperty('referenceTrackUrl', updates.referenceTrackUrl);
      expect(res.body.data).toHaveProperty('keySignature', updates.keySignature);
      expect(res.body.data).toHaveProperty('targetAudience', updates.targetAudience);
      expect(res.body.data).toHaveProperty('vocalStyle', updates.vocalStyle);
      expect(res.body.data).toHaveProperty('structureNotes', updates.structureNotes);
    });
  });

  describe('PATCH /api/v1/requests/:id/status', () => {
    let createdRequest;

    beforeEach(async () => {
      createdRequest = await MusicRequest.create(sampleRequest);
    });

    it('should update request status and add to history', async () => {
      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/status`)
        .send({ status: 'writing', notes: 'Starting the writing process' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('status', 'writing');
      expect(res.body.data).toHaveProperty('statusHistory');
      expect(res.body.data.statusHistory).toHaveLength(1);
      expect(res.body.data.statusHistory[0]).toHaveProperty('status', 'writing');
      expect(res.body.data.statusHistory[0]).toHaveProperty('notes', 'Starting the writing process');
      expect(res.body.data.statusHistory[0]).toHaveProperty('timestamp');
    });

    it('should validate status values', async () => {
      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/status`)
        .send({ status: 'invalid_status' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate status transitions', async () => {
      // First update to 'writing'
      await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/status`)
        .send({ status: 'writing' });

      // Try to update to 'completed' (invalid transition)
      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/status`)
        .send({ status: 'completed' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toMatch(/Invalid status transition/);
    });

    it('should allow valid status transitions', async () => {
      // Update to 'writing'
      await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/status`)
        .send({ status: 'writing' });

      // Update to 'recording' (valid transition)
      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/status`)
        .send({ status: 'recording' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('status', 'recording');
      expect(res.body.data.statusHistory).toHaveLength(2);
    });
  });

  describe('GET /api/v1/requests/:id/status/history', () => {
    let createdRequest;

    beforeEach(async () => {
      createdRequest = await MusicRequest.create(sampleRequest);

      // Add some status history
      await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/status`)
        .send({ status: 'writing', notes: 'Starting the writing process' });

      await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/status`)
        .send({ status: 'recording', notes: 'Moving to recording phase' });
    });

    it('should get status history', async () => {
      const res = await request(app)
        .get(`/api/v1/requests/${createdRequest._id}/status/history`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('currentStatus', 'recording');
      expect(res.body.data).toHaveProperty('statusHistory');
      expect(res.body.data.statusHistory).toHaveLength(2);
      expect(res.body.data.statusHistory[0]).toHaveProperty('status', 'writing');
      expect(res.body.data.statusHistory[1]).toHaveProperty('status', 'recording');
    });

    it('should return 404 for non-existent request', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/v1/requests/${nonExistentId}/status/history`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error.code).toBe('REQUEST_NOT_FOUND');
    });
  });

  describe('DELETE /api/v1/requests/:id', () => {
    let createdRequest;

    beforeEach(async () => {
      createdRequest = await MusicRequest.create(sampleRequest);
    });

    it('should delete a music request', async () => {
      const res = await request(app)
        .delete(`/api/v1/requests/${createdRequest._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const deletedRequest = await MusicRequest.findById(createdRequest._id);
      expect(deletedRequest).toBeNull();
    });
  });

  describe('GET /api/v1/requests/search', () => {
    beforeEach(async () => {
      await MusicRequest.create([
        sampleRequest,
        { ...sampleRequest, title: 'Rock Song', genre: 'rock', description: 'A rock song' },
        { ...sampleRequest, title: 'Jazz Song', genre: 'jazz', mood: 'calm' },
        { ...sampleRequest, title: 'Pop Hit', genre: 'pop', lyrics: '', status: 'writing' },
        { 
          ...sampleRequest, 
          title: 'Extended Song', 
          genre: 'electronic', 
          instrumentList: ['synthesizer', 'drums', 'bass'],
          keySignature: 'C minor',
          targetAudience: 'Young adults',
          vocalStyle: 'Electronic vocals',
          structureNotes: 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro'
        }
      ]);
    });

    it('should search requests by query string', async () => {
      const res = await request(app)
        .get('/api/v1/requests/search')
        .query({ query: 'rock' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(1);
      expect(res.body.data.requests[0].title).toBe('Rock Song');
    });

    it('should filter search results by multiple criteria', async () => {
      const res = await request(app)
        .get('/api/v1/requests/search')
        .query({ 
          genre: 'pop',
          status: 'writing'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(1);
      expect(res.body.data.requests[0].title).toBe('Pop Hit');
    });

    it('should filter by hasLyrics flag', async () => {
      const res = await request(app)
        .get('/api/v1/requests/search')
        .query({ hasLyrics: 'true' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests.every(req => req.lyrics && req.lyrics.length > 0)).toBe(true);
      expect(res.body.data.requests).toHaveLength(3); // All except 'Pop Hit'
    });

    it('should sort search results', async () => {
      const res = await request(app)
        .get('/api/v1/requests/search')
        .query({ 
          sortField: 'title',
          sortOrder: 'asc'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(5);
      expect(res.body.data.requests[0].title).toBe('Extended Song');
      expect(res.body.data.requests[1].title).toBe('Jazz Song');
      expect(res.body.data.requests[2].title).toBe('Pop Hit');
      expect(res.body.data.requests[3].title).toBe('Rock Song');
      expect(res.body.data.requests[4].title).toBe('Test Song');
    });

    it('should filter by extended parameters', async () => {
      // Test filtering by instrumentList
      let res = await request(app)
        .get('/api/v1/requests/search')
        .query({ 
          filters: {
            instrumentList: ['synthesizer']
          }
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(1);
      expect(res.body.data.requests[0].title).toBe('Extended Song');

      // Test filtering by keySignature
      res = await request(app)
        .get('/api/v1/requests/search')
        .query({ 
          filters: {
            keySignature: 'C minor'
          }
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(1);
      expect(res.body.data.requests[0].title).toBe('Extended Song');

      // Test filtering by targetAudience (partial match)
      res = await request(app)
        .get('/api/v1/requests/search')
        .query({ 
          filters: {
            targetAudience: 'Young'
          }
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(1);
      expect(res.body.data.requests[0].title).toBe('Extended Song');

      // Test filtering by vocalStyle (partial match)
      res = await request(app)
        .get('/api/v1/requests/search')
        .query({ 
          filters: {
            vocalStyle: 'Electronic'
          }
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(1);
      expect(res.body.data.requests[0].title).toBe('Extended Song');

      // Test filtering by structureNotes (partial match)
      res = await request(app)
        .get('/api/v1/requests/search')
        .query({ 
          filters: {
            structureNotes: 'Bridge'
          }
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(1);
      expect(res.body.data.requests[0].title).toBe('Extended Song');
    });
  });

  describe('PATCH /api/v1/requests/:id/lyrics', () => {
    let createdRequest;

    beforeEach(async () => {
      createdRequest = await MusicRequest.create(sampleRequest);
    });

    it('should update request lyrics with formatting', async () => {
      const newLyrics = 'Updated lyrics for testing';
      const format = {
        structure: [
          { type: 'verse', startLine: 0, endLine: 0, label: 'Verse 1' }
        ],
        styles: [
          { type: 'bold', startPos: 0, endPos: 7, line: 0 }
        ]
      };
      const changes = 'Updated the lyrics with formatting';

      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ lyrics: newLyrics, format, changes });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('lyrics', newLyrics);
      expect(res.body.data).toHaveProperty('format');
      expect(res.body.data).toHaveProperty('version');
      expect(res.body.data.format).toHaveProperty('structure');
      expect(res.body.data.format).toHaveProperty('styles');
      expect(res.body.data.latestVersion).toHaveProperty('changes', changes);

      // Verify in database
      const updatedRequest = await MusicRequest.findById(createdRequest._id);
      expect(updatedRequest.lyrics).toBe(newLyrics);
      expect(updatedRequest.lyricsVersions).toHaveLength(1);
      expect(updatedRequest.lyricsVersions[0].text).toBe(newLyrics);
    });

    it('should validate lyrics are provided', async () => {
      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate maximum lyrics length', async () => {
      // Create lyrics that exceed the 5000 character limit
      const longLyrics = 'a'.repeat(5001);

      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ lyrics: longLyrics });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate minimum lyrics length', async () => {
      // Create lyrics that are too short (less than 10 characters)
      const shortLyrics = 'abc';

      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ lyrics: shortLyrics });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('at least 10 characters');
    });

    it('should validate lyrics structure (minimum lines)', async () => {
      // Create lyrics with only one line
      const singleLineLyrics = 'This is just a single line with no line breaks';

      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ lyrics: singleLineLyrics });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('at least 2 lines');
    });

    it('should validate lyrics format (excessive repetition)', async () => {
      // Create lyrics with excessive repetition
      const repetitiveLyrics = 'Same line\nSame line\nSame line\nSame line\nSame line\nSame line\nSame line\nSame line\nSame line\nSame line';

      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ lyrics: repetitiveLyrics });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('repetitive lines');
    });

    it('should validate lyrics for invalid characters or patterns', async () => {
      // Create lyrics with invalid characters (line with only special characters)
      const invalidLyrics = 'This is a valid line\n@#$%^&*()!@#$%^&*()';

      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ lyrics: invalidLyrics });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('invalid characters or patterns');
    });
  });

  describe('GET /api/v1/requests/:id/lyrics/history', () => {
    let createdRequest;

    beforeEach(async () => {
      // Create a request with multiple lyrics versions
      createdRequest = await MusicRequest.create(sampleRequest);

      // Add first version
      await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ 
          lyrics: 'First version of lyrics',
          changes: 'Initial lyrics'
        });

      // Add second version
      await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ 
          lyrics: 'Second version of lyrics',
          changes: 'Updated lyrics'
        });
    });

    it('should get lyrics version history', async () => {
      const res = await request(app)
        .get(`/api/v1/requests/${createdRequest._id}/lyrics/history`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('versions');
      expect(res.body.data.versions).toHaveLength(2);
      expect(res.body.data.versions[0].version).toBe(2); // Latest version first
      expect(res.body.data.versions[1].version).toBe(1);
      expect(res.body.data.versions[0].text).toBe('Second version of lyrics');
      expect(res.body.data.versions[1].text).toBe('First version of lyrics');
      expect(res.body.data.versions[0].changes).toBe('Updated lyrics');
      expect(res.body.data.versions[1].changes).toBe('Initial lyrics');
    });

    it('should return empty array for request with no lyrics versions', async () => {
      // Create a new request without lyrics versions
      const newRequest = await MusicRequest.create({
        title: 'No Lyrics',
        genre: 'pop',
        mood: 'happy',
        tempo: 120
      });

      const res = await request(app)
        .get(`/api/v1/requests/${newRequest._id}/lyrics/history`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('versions');
      expect(res.body.data.versions).toHaveLength(0);
    });

    it('should return 404 for non-existent request', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/v1/requests/${nonExistentId}/lyrics/history`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error.code).toBe('REQUEST_NOT_FOUND');
    });
  });

  describe('GET /api/v1/requests/:id/lyrics/versions/:version', () => {
    let createdRequest;

    beforeEach(async () => {
      // Create a request with multiple lyrics versions
      createdRequest = await MusicRequest.create(sampleRequest);

      // Add first version
      await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ 
          lyrics: 'First version of lyrics',
          changes: 'Initial lyrics'
        });

      // Add second version
      await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ 
          lyrics: 'Second version of lyrics',
          changes: 'Updated lyrics'
        });
    });

    it('should get a specific lyrics version', async () => {
      const res = await request(app)
        .get(`/api/v1/requests/${createdRequest._id}/lyrics/versions/1`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('requestedVersion');
      expect(res.body.data.requestedVersion.version).toBe(1);
      expect(res.body.data.requestedVersion.text).toBe('First version of lyrics');
      expect(res.body.data.requestedVersion.changes).toBe('Initial lyrics');
    });

    it('should return 404 for non-existent version', async () => {
      const res = await request(app)
        .get(`/api/v1/requests/${createdRequest._id}/lyrics/versions/999`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error.code).toBe('VERSION_NOT_FOUND');
    });

    it('should return 404 for non-existent request', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/v1/requests/${nonExistentId}/lyrics/versions/1`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error.code).toBe('REQUEST_NOT_FOUND');
    });
  });

  describe('GET /api/v1/requests/:id/lyrics/compare', () => {
    let createdRequest;

    beforeEach(async () => {
      // Create a request with multiple lyrics versions
      createdRequest = await MusicRequest.create(sampleRequest);

      // Add first version
      await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ 
          lyrics: 'First version of lyrics',
          changes: 'Initial lyrics'
        });

      // Add second version
      await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ 
          lyrics: 'Second version of lyrics',
          changes: 'Updated lyrics'
        });
    });

    it('should compare two lyrics versions', async () => {
      const res = await request(app)
        .get(`/api/v1/requests/${createdRequest._id}/lyrics/compare`)
        .query({ version1: 1, version2: 2 });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('comparison');
      expect(res.body.data.comparison).toHaveProperty('version1');
      expect(res.body.data.comparison).toHaveProperty('version2');
      expect(res.body.data.comparison.version1.version).toBe(1);
      expect(res.body.data.comparison.version2.version).toBe(2);
      expect(res.body.data.comparison.version1.text).toBe('First version of lyrics');
      expect(res.body.data.comparison.version2.text).toBe('Second version of lyrics');
    });

    it('should validate that both version parameters are provided', async () => {
      const res = await request(app)
        .get(`/api/v1/requests/${createdRequest._id}/lyrics/compare`)
        .query({ version1: 1 }); // Missing version2

      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 404 for non-existent version', async () => {
      const res = await request(app)
        .get(`/api/v1/requests/${createdRequest._id}/lyrics/compare`)
        .query({ version1: 1, version2: 999 });

      expect(res.statusCode).toBe(404);
      expect(res.body.error.code).toBe('VERSION_NOT_FOUND');
    });

    it('should return 404 for non-existent request', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/v1/requests/${nonExistentId}/lyrics/compare`)
        .query({ version1: 1, version2: 2 });

      expect(res.statusCode).toBe(404);
      expect(res.body.error.code).toBe('REQUEST_NOT_FOUND');
    });
  });
});
