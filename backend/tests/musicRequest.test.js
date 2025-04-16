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
        { ...sampleRequest, title: 'Second Song' },
        { ...sampleRequest, title: 'Third Song' }
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
});
