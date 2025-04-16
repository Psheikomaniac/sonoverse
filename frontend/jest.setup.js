import '@testing-library/jest-dom';

// Mock global objects that might not be available in the test environment
global.fetch = jest.fn();

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
