const mongoose = require('mongoose');
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

// Mock environment variables for testing
process.env.PORT = '5000';

// Add Jest specific matchers
expect.extend({
  toHaveStatusCode(received, expected) {
    const pass = received.statusCode === expected;
    return {
      pass,
      message: () => `expected ${received.statusCode} to be ${expected}`
    };
  }
});
