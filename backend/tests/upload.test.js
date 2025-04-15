const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs').promises;
const app = require('../app');
const MusicRequest = require('../models/musicRequest');

let mongoServer;
const UPLOAD_DIR = 'uploads';

beforeAll(async () => {
  // Create uploads directory if it doesn't exist
  try {
    await fs.mkdir(UPLOAD_DIR);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
});

afterAll(async () => {
  // Clean up uploads directory
  const files = await fs.readdir(UPLOAD_DIR);
  await Promise.all(
    files.map(file => fs.unlink(path.join(UPLOAD_DIR, file)))
  );
});

describe('Upload API', () => {
  let musicRequest;

  beforeEach(async () => {
    // Create a test music request
    musicRequest = await MusicRequest.create({
      title: 'Test Song',
      genre: 'pop',
      mood: 'happy',
      tempo: 120
    });
  });

  afterEach(async () => {
    await MusicRequest.deleteMany({});
  });

  describe('POST /api/v1/uploads', () => {
    it('should upload an audio file', async () => {
      // Create a test audio file
      const testFilePath = path.join(UPLOAD_DIR, 'test.mp3');
      await fs.writeFile(testFilePath, 'dummy audio content');

      const res = await request(app)
        .post('/api/v1/uploads')
        .field('requestId', musicRequest._id.toString())
        .attach('file', testFilePath);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('audioUrl');
      expect(res.body.data.audioUrl).toMatch(/^\/uploads\/.+\.mp3$/);

      // Verify the music request was updated
      const updatedRequest = await MusicRequest.findById(musicRequest._id);
      expect(updatedRequest.audioUrl).toBe(res.body.data.audioUrl);

      // Clean up test file
      await fs.unlink(testFilePath);
    });

    it('should reject invalid file types', async () => {
      // Create a test text file
      const testFilePath = path.join(UPLOAD_DIR, 'test.txt');
      await fs.writeFile(testFilePath, 'not an audio file');

      const res = await request(app)
        .post('/api/v1/uploads')
        .field('requestId', musicRequest._id.toString())
        .attach('file', testFilePath);

      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toMatch(/file type/i);

      // Clean up test file
      await fs.unlink(testFilePath);
    });

    it('should require a requestId', async () => {
      // Create a test audio file
      const testFilePath = path.join(UPLOAD_DIR, 'test.mp3');
      await fs.writeFile(testFilePath, 'dummy audio content');

      const res = await request(app)
        .post('/api/v1/uploads')
        .attach('file', testFilePath);

      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toMatch(/requestId/i);

      // Clean up test file
      await fs.unlink(testFilePath);
    });

    it('should reject oversized files', async () => {
      // Create a large test file (6MB)
      const testFilePath = path.join(UPLOAD_DIR, 'large.mp3');
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 'x');
      await fs.writeFile(testFilePath, largeBuffer);

      const res = await request(app)
        .post('/api/v1/uploads')
        .field('requestId', musicRequest._id.toString())
        .attach('file', testFilePath);

      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toMatch(/file size/i);

      // Clean up test file
      await fs.unlink(testFilePath);
    });
  });

  describe('GET /api/v1/uploads/:filename', () => {
    it('should stream an audio file', async () => {
      // Create a test audio file
      const filename = 'test-stream.mp3';
      const testFilePath = path.join(UPLOAD_DIR, filename);
      await fs.writeFile(testFilePath, 'dummy audio content');

      const res = await request(app)
        .get(`/api/v1/uploads/${filename}`)
        .expect('Content-Type', /audio/);

      expect(res.statusCode).toBe(200);
      expect(res.header['content-type']).toMatch(/audio/);
      expect(res.header['content-length']).toBeDefined();
      expect(res.header['accept-ranges']).toBe('bytes');

      // Clean up test file
      await fs.unlink(testFilePath);
    });

    it('should return 404 for non-existent files', async () => {
      const res = await request(app)
        .get('/api/v1/uploads/non-existent.mp3');

      expect(res.statusCode).toBe(404);
      expect(res.body.error.code).toBe('FILE_NOT_FOUND');
      expect(res.body.error.message).toMatch(/file not found/i);
    });

    it('should protect against path traversal attacks', async () => {
      const res = await request(app)
        .get('/api/v1/uploads/../config/database.js');

      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toMatch(/invalid filename/i);
    });
  });
});
