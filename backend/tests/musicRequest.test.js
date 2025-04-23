const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const MusicRequest = require('../models/musicRequest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

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
      expect(res.body.data).toHaveProperty('status', 'pending');
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
        { ...sampleRequest, title: 'Third Song', genre: 'jazz', createdAt: new Date('2023-01-01') }
      ]);
    });

    it('should get all music requests with pagination', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .query({ page: 1, limit: 2 });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requests).toHaveLength(2);
      expect(res.body.data.pagination.total).toBe(3);
    });

    it('should filter requests by status', async () => {
      const res = await request(app)
        .get('/api/v1/requests')
        .query({ status: 'pending' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.requests.every(req => req.status === 'pending')).toBe(true);
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
      expect(res.body.data.requests).toHaveLength(3);
      expect(res.body.data.requests[0].title).toBe('Second Song');
      expect(res.body.data.requests[1].title).toBe('Test Song');
      expect(res.body.data.requests[2].title).toBe('Third Song');
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
  });

  describe('PATCH /api/v1/requests/:id/status', () => {
    let createdRequest;

    beforeEach(async () => {
      createdRequest = await MusicRequest.create(sampleRequest);
    });

    it('should update request status', async () => {
      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/status`)
        .send({ status: 'in_progress' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('status', 'in_progress');
    });

    it('should validate status values', async () => {
      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/status`)
        .send({ status: 'invalid_status' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
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
        { ...sampleRequest, title: 'Pop Hit', genre: 'pop', lyrics: '', status: 'in_progress' }
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
          status: 'in_progress'
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
      expect(res.body.data.requests).toHaveLength(4);
      expect(res.body.data.requests[0].title).toBe('Jazz Song');
      expect(res.body.data.requests[1].title).toBe('Pop Hit');
      expect(res.body.data.requests[2].title).toBe('Rock Song');
      expect(res.body.data.requests[3].title).toBe('Test Song');
    });
  });

  describe('PATCH /api/v1/requests/:id/lyrics', () => {
    let createdRequest;

    beforeEach(async () => {
      createdRequest = await MusicRequest.create(sampleRequest);
    });

    it('should update request lyrics with default formatting', async () => {
      const newLyrics = 'Updated lyrics for testing';

      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ lyrics: newLyrics });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('lyrics', newLyrics);
      expect(res.body.data).toHaveProperty('format');
      expect(res.body.data.format).toHaveProperty('structure');
      expect(res.body.data.format).toHaveProperty('styles');

      // Verify in database
      const updatedRequest = await MusicRequest.findById(createdRequest._id);
      expect(updatedRequest.lyrics).toBe(newLyrics);
      expect(updatedRequest.lyricsVersions).toBeDefined();
      expect(updatedRequest.lyricsVersions.length).toBe(1);
    });

    it('should update lyrics with structure formatting', async () => {
      const newLyrics = 'Verse 1\nThis is the first verse\n\nChorus\nThis is the chorus\n\nVerse 2\nThis is the second verse';
      const format = {
        structure: [
          { type: 'verse', startLine: 0, endLine: 1, label: 'Verse 1' },
          { type: 'chorus', startLine: 3, endLine: 4, label: 'Chorus' },
          { type: 'verse', startLine: 6, endLine: 7, label: 'Verse 2' }
        ]
      };

      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ lyrics: newLyrics, format });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('lyrics', newLyrics);
      expect(res.body.data).toHaveProperty('format');
      expect(res.body.data.format).toHaveProperty('structure');
      expect(res.body.data.format.structure).toHaveLength(3);
      expect(res.body.data.format.structure[0]).toHaveProperty('type', 'verse');
      expect(res.body.data.format.structure[1]).toHaveProperty('type', 'chorus');

      // Verify in database
      const updatedRequest = await MusicRequest.findById(createdRequest._id);
      expect(updatedRequest.lyricsVersions[0].format.structure).toHaveLength(3);
      expect(updatedRequest.lyricsVersions[0].format.structure[0].type).toBe('verse');
      expect(updatedRequest.lyricsVersions[0].format.structure[1].type).toBe('chorus');
    });

    it('should update lyrics with style formatting', async () => {
      const newLyrics = 'This is a line with bold and italic text';
      const format = {
        styles: [
          { type: 'bold', startPos: 10, endPos: 14, line: 0 },
          { type: 'italic', startPos: 19, endPos: 25, line: 0 }
        ]
      };

      const res = await request(app)
        .patch(`/api/v1/requests/${createdRequest._id}/lyrics`)
        .send({ lyrics: newLyrics, format });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('lyrics', newLyrics);
      expect(res.body.data).toHaveProperty('format');
      expect(res.body.data.format).toHaveProperty('styles');
      expect(res.body.data.format.styles).toHaveLength(2);
      expect(res.body.data.format.styles[0]).toHaveProperty('type', 'bold');
      expect(res.body.data.format.styles[1]).toHaveProperty('type', 'italic');

      // Verify in database
      const updatedRequest = await MusicRequest.findById(createdRequest._id);
      expect(updatedRequest.lyricsVersions[0].format.styles).toHaveLength(2);
      expect(updatedRequest.lyricsVersions[0].format.styles[0].type).toBe('bold');
      expect(updatedRequest.lyricsVersions[0].format.styles[1].type).toBe('italic');
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
});
