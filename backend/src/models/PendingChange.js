import { executeQuery } from '../config/database.js';

/**
 * PendingChange Model
 * Manages pending changes awaiting approval
 */
export class PendingChange {
  /**
   * Get all pending changes with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>}
   */
  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT
          pc.ChangeID,
          pc.OriginalRecordID,
          pc.ChangeType,
          pc.NewData,
          pc.RequestedBy,
          pc.RequestedAt,
          pc.ReviewedBy,
          pc.ReviewedAt,
          pc.Status,
          pc.RejectReason,
          pc.CreatedAt,
          pc.UpdatedAt,
          s.Lot,
          s.NguonGoc,
          s.Line,
          s.Size
        FROM PT_QC_PendingChanges pc
        LEFT JOIN PT_QC_ShellingSamples s ON pc.OriginalRecordID = s.ID
        WHERE 1=1
      `;

      const params = [];

      // Filter by status
      if (filters.status) {
        query += ` AND pc.Status = ?`;
        params.push(filters.status);
      }

      // Filter by requestedBy
      if (filters.requestedBy) {
        query += ` AND pc.RequestedBy = ?`;
        params.push(filters.requestedBy);
      }

      // Filter by change type
      if (filters.changeType) {
        query += ` AND pc.ChangeType = ?`;
        params.push(filters.changeType);
      }

      query += ` ORDER BY pc.RequestedAt DESC`;

      const result = await executeQuery(query, params);
      return result;
    } catch (error) {
      console.error('Error in PendingChange.findAll:', error);
      throw error;
    }
  }

  /**
   * Find pending change by ID
   * @param {number} changeId - Change ID
   * @returns {Promise<Object|null>}
   */
  static async findById(changeId) {
    try {
      const query = `
        SELECT
          pc.*,
          s.Lot,
          s.NguonGoc,
          s.Line,
          s.Size,
          s.KhoiLuong,
          s.WholePct,
          s.BrokenBeGocPct,
          s.BeDoiVaManhPct,
          s.VetDaoPct,
          s.ShellPct,
          s.TotalBrokenPct,
          s.KetLuan,
          s.ChuThich
        FROM PT_QC_PendingChanges pc
        LEFT JOIN PT_QC_ShellingSamples s ON pc.OriginalRecordID = s.ID
        WHERE pc.ChangeID = ?
      `;
      const result = await executeQuery(query, [changeId]);
      return result[0] || null;
    } catch (error) {
      console.error('Error in PendingChange.findById:', error);
      throw error;
    }
  }

  /**
   * Create a new pending change
   * @param {Object} changeData - Change data
   * @returns {Promise<Object>}
   */
  static async create(changeData) {
    try {
      const query = `
        INSERT INTO PT_QC_PendingChanges (
          OriginalRecordID,
          ChangeType,
          NewData,
          RequestedBy
        ) VALUES (?, ?, ?, ?)
      `;

      const params = [
        changeData.OriginalRecordID,
        changeData.ChangeType || 'UPDATE',
        JSON.stringify(changeData.NewData),
        changeData.RequestedBy,
      ];

      const result = await executeQuery(query, params);

      // Return the created record
      return await this.findById(result.insertId);
    } catch (error) {
      console.error('Error in PendingChange.create:', error);
      throw error;
    }
  }

  /**
   * Approve a pending change
   * @param {number} changeId - Change ID
   * @param {string} reviewedBy - Reviewer username/ID
   * @returns {Promise<Object>}
   */
  static async approve(changeId, reviewedBy) {
    try {
      // Get the pending change
      const pendingChange = await this.findById(changeId);

      if (!pendingChange) {
        throw new Error('Pending change not found');
      }

      if (pendingChange.Status !== 'PENDING') {
        throw new Error('This change has already been reviewed');
      }

      // Parse the new data
      const newData = JSON.parse(pendingChange.NewData);

      // Build update query dynamically based on newData
      const fields = Object.keys(newData);
      const updateFields = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => newData[field]);

      // Update the original record
      const updateQuery = `
        UPDATE PT_QC_ShellingSamples
        SET ${updateFields}
        WHERE ID = ?
      `;
      await executeQuery(updateQuery, [...values, pendingChange.OriginalRecordID]);

      // Mark pending change as approved
      const approveQuery = `
        UPDATE PT_QC_PendingChanges
        SET Status = 'APPROVED',
            ReviewedBy = ?,
            ReviewedAt = NOW()
        WHERE ChangeID = ?
      `;
      await executeQuery(approveQuery, [reviewedBy, changeId]);

      return await this.findById(changeId);
    } catch (error) {
      console.error('Error in PendingChange.approve:', error);
      throw error;
    }
  }

  /**
   * Reject a pending change
   * @param {number} changeId - Change ID
   * @param {string} reviewedBy - Reviewer username/ID
   * @param {string} rejectReason - Reason for rejection
   * @returns {Promise<Object>}
   */
  static async reject(changeId, reviewedBy, rejectReason = '') {
    try {
      const pendingChange = await this.findById(changeId);

      if (!pendingChange) {
        throw new Error('Pending change not found');
      }

      if (pendingChange.Status !== 'PENDING') {
        throw new Error('This change has already been reviewed');
      }

      const query = `
        UPDATE PT_QC_PendingChanges
        SET Status = 'REJECTED',
            ReviewedBy = ?,
            ReviewedAt = NOW(),
            RejectReason = ?
        WHERE ChangeID = ?
      `;

      await executeQuery(query, [reviewedBy, rejectReason, changeId]);

      return await this.findById(changeId);
    } catch (error) {
      console.error('Error in PendingChange.reject:', error);
      throw error;
    }
  }

  /**
   * Get pending changes count by status
   * @returns {Promise<Object>}
   */
  static async getStatistics() {
    try {
      const query = `
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN Status = 'PENDING' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN Status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN Status = 'REJECTED' THEN 1 ELSE 0 END) as rejected
        FROM PT_QC_PendingChanges
      `;

      const result = await executeQuery(query, []);
      return result[0];
    } catch (error) {
      console.error('Error in PendingChange.getStatistics:', error);
      throw error;
    }
  }

  /**
   * Delete a pending change (only if still pending)
   * @param {number} changeId - Change ID
   * @returns {Promise<boolean>}
   */
  static async delete(changeId) {
    try {
      const query = `
        DELETE FROM PT_QC_PendingChanges
        WHERE ChangeID = ? AND Status = 'PENDING'
      `;
      const result = await executeQuery(query, [changeId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in PendingChange.delete:', error);
      throw error;
    }
  }
}
