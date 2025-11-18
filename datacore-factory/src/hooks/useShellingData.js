import { useState, useEffect } from 'react';
import { shellingSamplesAPI } from '@/services/api';

/**
 * Custom hook for managing shelling samples data
 * Connects to backend API instead of localStorage
 */
export const useShellingData = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load records from backend on mount
  useEffect(() => {
    loadRecords();
  }, []);

  /**
   * Load all records from backend
   */
  const loadRecords = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await shellingSamplesAPI.getAll(filters);
      if (response.success) {
        setRecords(response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load records:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new record to backend
   */
  const addRecord = async (record) => {
    setLoading(true);
    setError(null);
    try {
      const response = await shellingSamplesAPI.create(record);
      if (response.success) {
        // Add the new record to the local state
        setRecords(prev => [response.data, ...prev]);
        return response.data;
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to add record:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing record
   */
  const updateRecord = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await shellingSamplesAPI.update(id, updatedData);
      if (response.success) {
        // Update the record in local state
        setRecords(prev =>
          prev.map(record =>
            record.SampleID === id ? response.data : record
          )
        );
        return response.data;
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to update record:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove a record from backend
   */
  const removeRecord = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await shellingSamplesAPI.delete(id);
      if (response.success) {
        // Remove from local state
        setRecords(prev => prev.filter(r => r.SampleID !== id));
        return true;
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to remove record:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get statistics
   */
  const getStatistics = async (filters = {}) => {
    try {
      const response = await shellingSamplesAPI.getStatistics(filters);
      if (response.success) {
        return response.data;
      }
    } catch (err) {
      console.error('Failed to get statistics:', err);
      throw err;
    }
  };

  /**
   * Refresh records
   */
  const refresh = () => {
    loadRecords();
  };

  // Maintain backward compatibility
  const editRecord = updateRecord;

  return {
    records,
    loading,
    error,
    addRecord,
    editRecord,
    updateRecord,
    removeRecord,
    getStatistics,
    refresh,
    loadRecords,
  };
};
