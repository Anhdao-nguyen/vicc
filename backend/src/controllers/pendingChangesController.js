import { PendingChange } from '../models/PendingChange.js';
import { ShellingSample } from '../models/ShellingSample.js';
import { validationResult } from 'express-validator';

/**
 * Get all pending changes with optional filters
 */
export const getAllPendingChanges = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      requestedBy: req.query.requestedBy,
      changeType: req.query.changeType,
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) delete filters[key];
    });

    const pendingChanges = await PendingChange.findAll(filters);

    res.json({
      success: true,
      count: pendingChanges.length,
      data: pendingChanges,
    });
  } catch (error) {
    console.error('Error in getAllPendingChanges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending changes',
      error: error.message,
    });
  }
};

/**
 * Get a single pending change by ID
 */
export const getPendingChangeById = async (req, res) => {
  try {
    const { id } = req.params;
    const pendingChange = await PendingChange.findById(id);

    if (!pendingChange) {
      return res.status(404).json({
        success: false,
        message: 'Pending change not found',
      });
    }

    res.json({
      success: true,
      data: pendingChange,
    });
  } catch (error) {
    console.error('Error in getPendingChangeById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending change',
      error: error.message,
    });
  }
};

/**
 * Create a new pending change (submit for approval)
 */
export const createPendingChange = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { originalRecordId, changeType, newData } = req.body;

    // Check if original record exists
    const originalRecord = await ShellingSample.findById(originalRecordId);
    if (!originalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Original record not found',
      });
    }

    // Get username from authenticated user
    const requestedBy = req.user?.username || req.user?.userId?.toString() || 'unknown';

    const changeData = {
      OriginalRecordID: originalRecordId,
      ChangeType: changeType || 'UPDATE',
      NewData: newData,
      RequestedBy: requestedBy,
    };

    const newPendingChange = await PendingChange.create(changeData);

    res.status(201).json({
      success: true,
      message: 'Change submitted for approval successfully',
      data: newPendingChange,
    });
  } catch (error) {
    console.error('Error in createPendingChange:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create pending change',
      error: error.message,
    });
  }
};

/**
 * Approve a pending change (Leader only)
 */
export const approvePendingChange = async (req, res) => {
  try {
    const { id } = req.params;

    // Get username from authenticated user
    const reviewedBy = req.user?.username || req.user?.userId?.toString() || 'unknown';

    const approvedChange = await PendingChange.approve(id, reviewedBy);

    res.json({
      success: true,
      message: 'Change approved and applied successfully',
      data: approvedChange,
    });
  } catch (error) {
    console.error('Error in approvePendingChange:', error);

    if (error.message === 'Pending change not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === 'This change has already been reviewed') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to approve change',
      error: error.message,
    });
  }
};

/**
 * Reject a pending change (Leader only)
 */
export const rejectPendingChange = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectReason } = req.body;

    // Get username from authenticated user
    const reviewedBy = req.user?.username || req.user?.userId?.toString() || 'unknown';

    const rejectedChange = await PendingChange.reject(id, reviewedBy, rejectReason);

    res.json({
      success: true,
      message: 'Change rejected successfully',
      data: rejectedChange,
    });
  } catch (error) {
    console.error('Error in rejectPendingChange:', error);

    if (error.message === 'Pending change not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === 'This change has already been reviewed') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to reject change',
      error: error.message,
    });
  }
};

/**
 * Delete a pending change (only if still pending)
 */
export const deletePendingChange = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PendingChange.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Pending change not found or already reviewed',
      });
    }

    res.json({
      success: true,
      message: 'Pending change deleted successfully',
    });
  } catch (error) {
    console.error('Error in deletePendingChange:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pending change',
      error: error.message,
    });
  }
};

/**
 * Get statistics for pending changes
 */
export const getPendingChangeStatistics = async (req, res) => {
  try {
    const statistics = await PendingChange.getStatistics();

    res.json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error('Error in getPendingChangeStatistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
};
