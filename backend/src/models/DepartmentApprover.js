import { executeQuery } from '../config/database.js';

/**
 * DepartmentApprover Model
 * Manages approvers for each department
 */
export class DepartmentApprover {
  /**
   * Get all approvers for a specific department
   * @param {string} departmentId - Department ID (qc, hr, hse, maintenance)
   * @param {boolean} activeOnly - Return only active approvers
   * @returns {Promise<Array>}
   */
  static async findByDepartment(departmentId, activeOnly = true) {
    try {
      let query = `
        SELECT
          ApproverID,
          DepartmentID,
          DepartmentName,
          ApproverEmail,
          ApproverName,
          ApproverRole,
          IsActive,
          CreatedBy,
          CreatedAt,
          UpdatedAt
        FROM PT_QC_DepartmentApprovers
        WHERE DepartmentID = ?
      `;

      const params = [departmentId];

      if (activeOnly) {
        query += ` AND IsActive = TRUE`;
      }

      query += ` ORDER BY CreatedAt DESC`;

      const result = await executeQuery(query, params);
      return result;
    } catch (error) {
      console.error('Error in DepartmentApprover.findByDepartment:', error);
      throw error;
    }
  }

  /**
   * Find approver by ID
   * @param {number} approverId - Approver ID
   * @returns {Promise<Object|null>}
   */
  static async findById(approverId) {
    try {
      const query = `
        SELECT *
        FROM PT_QC_DepartmentApprovers
        WHERE ApproverID = ?
      `;
      const result = await executeQuery(query, [approverId]);
      return result[0] || null;
    } catch (error) {
      console.error('Error in DepartmentApprover.findById:', error);
      throw error;
    }
  }

  /**
   * Check if email already exists as approver for department
   * @param {string} departmentId - Department ID
   * @param {string} email - Email to check
   * @returns {Promise<boolean>}
   */
  static async emailExists(departmentId, email) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM PT_QC_DepartmentApprovers
        WHERE DepartmentID = ? AND ApproverEmail = ?
      `;
      const result = await executeQuery(query, [departmentId, email]);
      return result[0].count > 0;
    } catch (error) {
      console.error('Error in DepartmentApprover.emailExists:', error);
      throw error;
    }
  }

  /**
   * Create a new approver
   * @param {Object} approverData - Approver data
   * @returns {Promise<Object>}
   */
  static async create(approverData) {
    try {
      // Validate email domain (must be @intersnack.com.vn)
      const emailRegex = /^[a-zA-Z0-9._-]+@intersnack\.com\.vn$/;
      if (!emailRegex.test(approverData.ApproverEmail)) {
        throw new Error('Email phải có định dạng @intersnack.com.vn');
      }

      // Check if email already exists for this department
      const exists = await this.emailExists(
        approverData.DepartmentID,
        approverData.ApproverEmail
      );

      if (exists) {
        throw new Error('Email này đã được thêm vào danh sách approvers');
      }

      const query = `
        INSERT INTO PT_QC_DepartmentApprovers (
          DepartmentID,
          DepartmentName,
          ApproverEmail,
          ApproverName,
          ApproverRole,
          IsActive,
          CreatedBy
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        approverData.DepartmentID,
        approverData.DepartmentName,
        approverData.ApproverEmail,
        approverData.ApproverName || null,
        approverData.ApproverRole || 'leader',
        approverData.IsActive !== undefined ? approverData.IsActive : true,
        approverData.CreatedBy || null,
      ];

      const result = await executeQuery(query, params);

      // Return the created record
      return await this.findById(result.insertId);
    } catch (error) {
      console.error('Error in DepartmentApprover.create:', error);
      throw error;
    }
  }

  /**
   * Update an approver
   * @param {number} approverId - Approver ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>}
   */
  static async update(approverId, updateData) {
    try {
      const fields = [];
      const params = [];

      if (updateData.ApproverEmail !== undefined) {
        // Validate email domain
        const emailRegex = /^[a-zA-Z0-9._-]+@intersnack\.com\.vn$/;
        if (!emailRegex.test(updateData.ApproverEmail)) {
          throw new Error('Email phải có định dạng @intersnack.com.vn');
        }
        fields.push('ApproverEmail = ?');
        params.push(updateData.ApproverEmail);
      }

      if (updateData.ApproverName !== undefined) {
        fields.push('ApproverName = ?');
        params.push(updateData.ApproverName);
      }

      if (updateData.ApproverRole !== undefined) {
        fields.push('ApproverRole = ?');
        params.push(updateData.ApproverRole);
      }

      if (updateData.IsActive !== undefined) {
        fields.push('IsActive = ?');
        params.push(updateData.IsActive);
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      const query = `
        UPDATE PT_QC_DepartmentApprovers
        SET ${fields.join(', ')}
        WHERE ApproverID = ?
      `;

      params.push(approverId);

      await executeQuery(query, params);

      return await this.findById(approverId);
    } catch (error) {
      console.error('Error in DepartmentApprover.update:', error);
      throw error;
    }
  }

  /**
   * Delete an approver
   * @param {number} approverId - Approver ID
   * @returns {Promise<boolean>}
   */
  static async delete(approverId) {
    try {
      const query = `
        DELETE FROM PT_QC_DepartmentApprovers
        WHERE ApproverID = ?
      `;
      const result = await executeQuery(query, [approverId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in DepartmentApprover.delete:', error);
      throw error;
    }
  }

  /**
   * Deactivate an approver (soft delete)
   * @param {number} approverId - Approver ID
   * @returns {Promise<Object>}
   */
  static async deactivate(approverId) {
    try {
      return await this.update(approverId, { IsActive: false });
    } catch (error) {
      console.error('Error in DepartmentApprover.deactivate:', error);
      throw error;
    }
  }

  /**
   * Get statistics for all departments
   * @returns {Promise<Object>}
   */
  static async getStatistics() {
    try {
      const query = `
        SELECT
          DepartmentID,
          DepartmentName,
          COUNT(*) as totalApprovers,
          SUM(CASE WHEN IsActive = TRUE THEN 1 ELSE 0 END) as activeApprovers
        FROM PT_QC_DepartmentApprovers
        GROUP BY DepartmentID, DepartmentName
      `;
      const result = await executeQuery(query, []);
      return result;
    } catch (error) {
      console.error('Error in DepartmentApprover.getStatistics:', error);
      throw error;
    }
  }
}
