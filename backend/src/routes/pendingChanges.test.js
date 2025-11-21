import express from 'express';
import { body } from 'express-validator';
import {
  getAllPendingChanges,
  getPendingChangeById,
  createPendingChange,
  approvePendingChange,
  rejectPendingChange,
  deletePendingChange,
  getPendingChangeStatistics,
} from '../controllers/pendingChangesController.js';

const router = express.Router();

// Validation rules for creating pending changes
const pendingChangeValidationRules = [
  body('originalRecordId')
    .notEmpty()
    .withMessage('Original record ID is required')
    .isInt({ min: 1 })
    .withMessage('Original record ID must be a valid positive integer'),
  body('changeType')
    .optional()
    .isIn(['UPDATE', 'DELETE'])
    .withMessage('Change type must be either UPDATE or DELETE'),
  body('newData')
    .notEmpty()
    .withMessage('New data is required')
    .isObject()
    .withMessage('New data must be an object'),
];

// Validation rules for rejecting changes
const rejectValidationRules = [
  body('rejectReason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reject reason must not exceed 500 characters'),
];

// ===== TEMPORARY: NO AUTHENTICATION REQUIRED FOR TESTING =====
// Get statistics
router.get('/statistics', getPendingChangeStatistics);

// Get all pending changes
router.get('/', getAllPendingChanges);

// Get single pending change by ID
router.get('/:id', getPendingChangeById);

// Create new pending change - submit for approval
router.post('/', pendingChangeValidationRules, createPendingChange);

// Approve pending change (NO AUTH FOR TESTING)
router.post('/:id/approve', approvePendingChange);

// Reject pending change (NO AUTH FOR TESTING)
router.post('/:id/reject', rejectValidationRules, rejectPendingChange);

// Delete pending change
router.delete('/:id', deletePendingChange);

export default router;
