import express from 'express';
import { body } from 'express-validator';
import {
  getAllSamples,
  getSampleById,
  createSample,
  updateSample,
  deleteSample,
  getStatistics,
  getSamplesByBatch,
} from '../controllers/shellingSampleController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Validation rules for creating/updating samples
const sampleValidationRules = [
  body('sampleDate')
    .optional()
    .isISO8601()
    .withMessage('Sample date must be a valid date'),
  body('batchNo')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Batch number must be between 1 and 50 characters'),
  body('shiftNo')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Shift number must be between 1 and 3'),
  body('machineNo')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Machine number must be between 1 and 50 characters'),
  body('supplier')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Supplier name must not exceed 100 characters'),
  body('rawMaterialCode')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Raw material code must not exceed 50 characters'),
  body('moisture')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Moisture must be between 0 and 100'),
  body('wholeKernel')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Whole kernel must be between 0 and 100'),
  body('brokenKernel')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Broken kernel must be between 0 and 100'),
  body('shellContent')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Shell content must be between 0 and 100'),
  body('foreignMatter')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Foreign matter must be between 0 and 100'),
  body('totalDefects')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Total defects must be between 0 and 100'),
  body('remarks')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Remarks must not exceed 500 characters'),
];

// Public routes (no authentication required for now - add authenticateToken if needed)
// Get all samples with optional filters
router.get('/', getAllSamples);

// Get statistics
router.get('/statistics', getStatistics);

// Get samples by batch number
router.get('/batch/:batchNo', getSamplesByBatch);

// Get sample by ID
router.get('/:id', getSampleById);

// Protected routes (require authentication)
// Create new sample
router.post('/', sampleValidationRules, createSample);

// Update sample
router.put('/:id', sampleValidationRules, updateSample);

// Delete sample
router.delete('/:id', deleteSample);

export default router;
