import { ShellingSample } from '../models/ShellingSample.js';
import { validationResult } from 'express-validator';

/**
 * Get all shelling samples with optional filters
 */
export const getAllSamples = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      batchNo: req.query.batchNo,
      shiftNo: req.query.shiftNo,
      machineNo: req.query.machineNo,
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) delete filters[key];
    });

    const samples = await ShellingSample.findAll(filters);

    res.json({
      success: true,
      count: samples.length,
      data: samples,
    });
  } catch (error) {
    console.error('Error in getAllSamples:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shelling samples',
      error: error.message,
    });
  }
};

/**
 * Get a single shelling sample by ID
 */
export const getSampleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sample = await ShellingSample.findById(id);

    if (!sample) {
      return res.status(404).json({
        success: false,
        message: 'Shelling sample not found',
      });
    }

    res.json({
      success: true,
      data: sample,
    });
  } catch (error) {
    console.error('Error in getSampleById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shelling sample',
      error: error.message,
    });
  }
};

/**
 * Create a new shelling sample
 */
export const createSample = async (req, res) => {
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

    const sampleData = {
      ...req.body,
      createdBy: req.user?.username || 'system', // From auth middleware
    };

    const newSample = await ShellingSample.create(sampleData);

    res.status(201).json({
      success: true,
      message: 'Shelling sample created successfully',
      data: newSample,
    });
  } catch (error) {
    console.error('Error in createSample:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create shelling sample',
      error: error.message,
    });
  }
};

/**
 * Update a shelling sample
 */
export const updateSample = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    // Check if sample exists
    const existingSample = await ShellingSample.findById(id);
    if (!existingSample) {
      return res.status(404).json({
        success: false,
        message: 'Shelling sample not found',
      });
    }

    const sampleData = {
      ...req.body,
      updatedBy: req.user?.username || 'system', // From auth middleware
    };

    const updatedSample = await ShellingSample.update(id, sampleData);

    res.json({
      success: true,
      message: 'Shelling sample updated successfully',
      data: updatedSample,
    });
  } catch (error) {
    console.error('Error in updateSample:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shelling sample',
      error: error.message,
    });
  }
};

/**
 * Delete a shelling sample
 */
export const deleteSample = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if sample exists
    const existingSample = await ShellingSample.findById(id);
    if (!existingSample) {
      return res.status(404).json({
        success: false,
        message: 'Shelling sample not found',
      });
    }

    await ShellingSample.delete(id);

    res.json({
      success: true,
      message: 'Shelling sample deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteSample:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete shelling sample',
      error: error.message,
    });
  }
};

/**
 * Get statistics for dashboard
 */
export const getStatistics = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) delete filters[key];
    });

    const statistics = await ShellingSample.getStatistics(filters);

    res.json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error('Error in getStatistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
};

/**
 * Get samples by batch number (Lot)
 */
export const getSamplesByBatch = async (req, res) => {
  try {
    const { batchNo } = req.params;
    const samples = await ShellingSample.findByLot(batchNo);

    res.json({
      success: true,
      count: samples.length,
      data: samples,
    });
  } catch (error) {
    console.error('Error in getSamplesByBatch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch samples by batch',
      error: error.message,
    });
  }
};
