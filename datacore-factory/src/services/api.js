// API Base URL - change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic API request handler
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Shelling Samples API
 */
export const shellingSamplesAPI = {
  /**
   * Get all shelling samples with optional filters
   * @param {Object} filters - Query filters (startDate, endDate, batchNo, etc.)
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/shelling-samples${queryString ? `?${queryString}` : ''}`;

    return apiRequest(endpoint);
  },

  /**
   * Get a single sample by ID
   * @param {number} id - Sample ID
   */
  getById: async (id) => {
    return apiRequest(`/shelling-samples/${id}`);
  },

  /**
   * Create a new shelling sample
   * @param {Object} sampleData - Sample data
   */
  create: async (sampleData) => {
    return apiRequest('/shelling-samples', {
      method: 'POST',
      body: JSON.stringify(sampleData),
    });
  },

  /**
   * Update an existing shelling sample
   * @param {number} id - Sample ID
   * @param {Object} sampleData - Updated sample data
   */
  update: async (id, sampleData) => {
    return apiRequest(`/shelling-samples/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sampleData),
    });
  },

  /**
   * Delete a shelling sample
   * @param {number} id - Sample ID
   */
  delete: async (id) => {
    return apiRequest(`/shelling-samples/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get statistics for dashboard
   * @param {Object} filters - Date range filters
   */
  getStatistics: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    if (filters.startDate) {
      queryParams.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      queryParams.append('endDate', filters.endDate);
    }

    const queryString = queryParams.toString();
    const endpoint = `/shelling-samples/statistics${queryString ? `?${queryString}` : ''}`;

    return apiRequest(endpoint);
  },

  /**
   * Get samples by batch number
   * @param {string} batchNo - Batch number
   */
  getByBatch: async (batchNo) => {
    return apiRequest(`/shelling-samples/batch/${batchNo}`);
  },
};

/**
 * Auth API (if needed)
 */
export const authAPI = {
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },
};

export default {
  shellingSamples: shellingSamplesAPI,
  auth: authAPI,
};
