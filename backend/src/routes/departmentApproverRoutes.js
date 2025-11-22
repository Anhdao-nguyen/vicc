import express from 'express';
import {
  getApproversByDepartment,
  getApproverById,
  createApprover,
  updateApprover,
  deleteApprover,
  deactivateApprover,
  getApproverStatistics,
} from '../controllers/departmentApproverController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * Department Approver Routes
 */

// Get statistics for all departments
// GET /api/departments/approvers/statistics
router.get('/approvers/statistics', optionalAuth, getApproverStatistics);

// Get all approvers for a specific department
// GET /api/departments/:departmentId/approvers?activeOnly=true
router.get('/:departmentId/approvers', optionalAuth, getApproversByDepartment);

// Create new approver for a department
// POST /api/departments/:departmentId/approvers
router.post('/:departmentId/approvers', optionalAuth, createApprover);

// Get single approver by ID
// GET /api/departments/approvers/:approverId
router.get('/approvers/:approverId', optionalAuth, getApproverById);

// Update approver
// PUT /api/departments/approvers/:approverId
router.put('/approvers/:approverId', optionalAuth, updateApprover);

// Deactivate approver (soft delete)
// PATCH /api/departments/approvers/:approverId/deactivate
router.patch('/approvers/:approverId/deactivate', optionalAuth, deactivateApprover);

// Delete approver permanently
// DELETE /api/departments/approvers/:approverId
router.delete('/approvers/:approverId', optionalAuth, deleteApprover);

export default router;
