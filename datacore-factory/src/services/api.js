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

/**
 * Pending Changes API
 */
export const pendingChangesAPI = {
  /**
   * Get all pending changes with optional filters
   * @param {Object} filters - Query filters (status, requestedBy, changeType)
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/pending-changes${queryString ? `?${queryString}` : ''}`;

    return apiRequest(endpoint);
  },

  /**
   * Get a single pending change by ID
   * @param {number} id - Change ID
   */
  getById: async (id) => {
    return apiRequest(`/pending-changes/${id}`);
  },

  /**
   * Submit a change for approval
   * @param {Object} changeData - Change data (originalRecordId, changeType, newData)
   */
  create: async (changeData) => {
    return apiRequest('/pending-changes', {
      method: 'POST',
      body: JSON.stringify(changeData),
    });
  },

  /**
   * Approve a pending change
   * @param {number} id - Change ID
   */
  approve: async (id) => {
    return apiRequest(`/pending-changes/${id}/approve`, {
      method: 'POST',
    });
  },

  /**
   * Reject a pending change
   * @param {number} id - Change ID
   * @param {string} rejectReason - Reason for rejection
   */
  reject: async (id, rejectReason = '') => {
    return apiRequest(`/pending-changes/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ rejectReason }),
    });
  },

  /**
   * Delete a pending change
   * @param {number} id - Change ID
   */
  delete: async (id) => {
    return apiRequest(`/pending-changes/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get statistics for pending changes
   */
  getStatistics: async () => {
    return apiRequest('/pending-changes/statistics');
  },
};

/**
 * Department Approver API
 */
export const departmentApproverAPI = {
  /**
   * Get all approvers for a department
   * @param {string} departmentId - Department ID (qc, hr, hse, maintenance)
   * @param {boolean} activeOnly - Return only active approvers
   */
  getByDepartment: async (departmentId, activeOnly = true) => {
    const queryParams = new URLSearchParams();
    queryParams.append('activeOnly', activeOnly);
    const queryString = queryParams.toString();
    const endpoint = `/departments/${departmentId}/approvers?${queryString}`;
    return apiRequest(endpoint);
  },

  /**
   * Get single approver by ID
   * @param {number} approverId - Approver ID
   */
  getById: async (approverId) => {
    return apiRequest(`/departments/approvers/${approverId}`);
  },

  /**
   * Create new approver for a department
   * @param {string} departmentId - Department ID
   * @param {Object} approverData - Approver data (email, name, role)
   */
  create: async (departmentId, approverData) => {
    return apiRequest(`/departments/${departmentId}/approvers`, {
      method: 'POST',
      body: JSON.stringify(approverData),
    });
  },

  /**
   * Update an approver
   * @param {number} approverId - Approver ID
   * @param {Object} updateData - Data to update
   */
  update: async (approverId, updateData) => {
    return apiRequest(`/departments/approvers/${approverId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Deactivate an approver (soft delete)
   * @param {number} approverId - Approver ID
   */
  deactivate: async (approverId) => {
    return apiRequest(`/departments/approvers/${approverId}/deactivate`, {
      method: 'PATCH',
    });
  },

  /**
   * Delete an approver permanently
   * @param {number} approverId - Approver ID
   */
  delete: async (approverId) => {
    return apiRequest(`/departments/approvers/${approverId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get statistics for all departments
   */
  getStatistics: async () => {
    return apiRequest('/departments/approvers/statistics');
  },
};

export default {
  shellingSamples: shellingSamplesAPI,
  auth: authAPI,
  pendingChanges: pendingChangesAPI,
  departmentApprover: departmentApproverAPI,
};