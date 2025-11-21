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
import { authenticate, authorize } from '../middleware/auth.js';

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

// Get statistics (requires authentication)
router.get('/statistics', authenticate, getPendingChangeStatistics);

// Get all pending changes (requires authentication)
// Users can see their own, leaders/admins can see all
router.get('/', authenticate, getAllPendingChanges);

// Get single pending change by ID (requires authentication)
router.get('/:id', authenticate, getPendingChangeById);

// Create new pending change - submit for approval (requires authentication)
router.post('/', authenticate, pendingChangeValidationRules, createPendingChange);

// Approve pending change (requires leader or admin role)
router.post('/:id/approve', authenticate, authorize('admin', 'leader'), approvePendingChange);

// Reject pending change (requires leader or admin role)
router.post('/:id/reject', authenticate, authorize('admin', 'leader'), rejectValidationRules, rejectPendingChange);

// Delete pending change (only if still pending)
router.delete('/:id', authenticate, deletePendingChange);

export default router;
