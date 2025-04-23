const notificationService = require('../services/notificationService');

describe('Notification Service', () => {
  // Mock console.log to capture output
  let consoleLogSpy;
  
  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });
  
  afterEach(() => {
    consoleLogSpy.mockRestore();
  });
  
  describe('sendStatusChangeNotification', () => {
    it('should log notification details', async () => {
      // Create a mock request
      const mockRequest = {
        _id: '123456789',
        title: 'Test Song',
        status: 'writing'
      };
      
      const oldStatus = 'received';
      const newStatus = 'writing';
      const notes = 'Starting the writing process';
      
      // Call the notification service
      const result = await notificationService.sendStatusChangeNotification(
        mockRequest,
        oldStatus,
        newStatus,
        notes
      );
      
      // Verify console.log was called with the expected arguments
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[NOTIFICATION]'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('From: received'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('To: writing'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Notes: Starting the writing process'));
      
      // Verify the result
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message', 'Notification sent successfully');
      expect(result).toHaveProperty('details');
      expect(result.details).toHaveProperty('requestId', '123456789');
      expect(result.details).toHaveProperty('oldStatus', 'received');
      expect(result.details).toHaveProperty('newStatus', 'writing');
      expect(result.details).toHaveProperty('timestamp');
    });
    
    it('should handle missing notes', async () => {
      // Create a mock request
      const mockRequest = {
        _id: '123456789',
        title: 'Test Song',
        status: 'writing'
      };
      
      const oldStatus = 'received';
      const newStatus = 'writing';
      
      // Call the notification service without notes
      const result = await notificationService.sendStatusChangeNotification(
        mockRequest,
        oldStatus,
        newStatus
      );
      
      // Verify console.log was called with the expected arguments
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Notes: No notes provided'));
      
      // Verify the result
      expect(result).toHaveProperty('success', true);
    });
    
    it('should handle errors gracefully', async () => {
      // Create a mock request that will cause an error
      const mockRequest = null;
      
      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Call the notification service with invalid data
      const result = await notificationService.sendStatusChangeNotification(
        mockRequest,
        'received',
        'writing'
      );
      
      // Verify console.error was called
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      // Verify the result
      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('message', 'Failed to send notification');
      expect(result).toHaveProperty('error');
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });
});