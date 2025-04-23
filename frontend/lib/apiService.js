import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth token (for future use)
api.interceptors.request.use(
  (config) => {
    // Add auth token logic here when authentication is implemented
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    const errorResponse = {
      message: 'An unexpected error occurred',
      status: 500,
      data: null,
    };

    if (error.response) {
      // The server responded with a status code outside the 2xx range
      errorResponse.message = error.response.data.message || 'Server error';
      errorResponse.status = error.response.status;
      errorResponse.data = error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      errorResponse.message = 'No response from server';
      errorResponse.status = 503;
    } else {
      // Something happened in setting up the request
      errorResponse.message = error.message;
    }

    return Promise.reject(errorResponse);
  }
);

// Music Requests API methods
const musicRequestsApi = {
  // Get all music requests with optional filtering
  getAllRequests: async (page = 1, limit = 10, status = null) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      
      const response = await api.get('/requests', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single music request by ID
  getRequestById: async (id) => {
    try {
      const response = await api.get(`/requests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new music request
  createRequest: async (requestData) => {
    try {
      const response = await api.post('/requests', requestData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update an existing music request
  updateRequest: async (id, requestData) => {
    try {
      const response = await api.put(`/requests/${id}`, requestData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update just the status of a music request
  updateRequestStatus: async (id, status) => {
    try {
      const response = await api.patch(`/requests/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a music request
  deleteRequest: async (id) => {
    try {
      const response = await api.delete(`/requests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload audio file for a music request (for future implementation)
  uploadAudio: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('audio', file);
      
      const response = await api.post(`/requests/${id}/audio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default musicRequestsApi;

// React hooks for API operations
export const useApiService = () => {
  return {
    ...musicRequestsApi,
    
    // Additional helper methods can be added here
    isValidationError: (error) => {
      return error?.status === 400 && error?.data?.errors;
    },
    
    getValidationErrors: (error) => {
      if (!error?.data?.errors) return {};
      
      // Convert array of errors to object with field names as keys
      return error.data.errors.reduce((acc, curr) => {
        acc[curr.field] = curr.message;
        return acc;
      }, {});
    },
  };
};