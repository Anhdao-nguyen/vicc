import { sql, executeQuery } from '../config/database.js';

export class ShellingSample {
  /**
   * Get all shelling samples with optional filters
   * @param {Object} filters - Filter options (date range, batch, etc.)
   * @returns {Promise<Array>}
   */
  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT
          SampleID,
          SampleDate,
          BatchNo,
          ShiftNo,
          MachineNo,
          Supplier,
          RawMaterialCode,
          Moisture,
          WholeKernel,
          BrokenKernel,
          ShellContent,
          ForeignMatter,
          TotalDefects,
          Remarks,
          CreatedBy,
          CreatedAt,
          UpdatedBy,
          UpdatedAt
        FROM PT_QC_ShellingSamples
        WHERE 1=1
      `;

      const params = {};

      // Add date range filter
      if (filters.startDate) {
        query += ` AND SampleDate >= @startDate`;
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        query += ` AND SampleDate <= @endDate`;
        params.endDate = filters.endDate;
      }

      // Add batch filter
      if (filters.batchNo) {
        query += ` AND BatchNo = @batchNo`;
        params.batchNo = filters.batchNo;
      }

      // Add shift filter
      if (filters.shiftNo) {
        query += ` AND ShiftNo = @shiftNo`;
        params.shiftNo = filters.shiftNo;
      }

      // Add machine filter
      if (filters.machineNo) {
        query += ` AND MachineNo = @machineNo`;
        params.machineNo = filters.machineNo;
      }

      query += ` ORDER BY SampleDate DESC, SampleID DESC`;

      const result = await executeQuery(query, params);
      return result.recordset;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  /**
   * Find sample by ID
   * @param {number} id - Sample ID
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    try {
      const query = `
        SELECT * FROM PT_QC_ShellingSamples
        WHERE SampleID = @id
      `;

      const result = await executeQuery(query, { id });
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  /**
   * Create a new shelling sample
   * @param {Object} sampleData - Sample data
   * @returns {Promise<Object>}
   */
  static async create(sampleData) {
    try {
      const query = `
        INSERT INTO PT_QC_ShellingSamples (
          SampleDate,
          BatchNo,
          ShiftNo,
          MachineNo,
          Supplier,
          RawMaterialCode,
          Moisture,
          WholeKernel,
          BrokenKernel,
          ShellContent,
          ForeignMatter,
          TotalDefects,
          Remarks,
          CreatedBy,
          CreatedAt
        )
        OUTPUT INSERTED.*
        VALUES (
          @sampleDate,
          @batchNo,
          @shiftNo,
          @machineNo,
          @supplier,
          @rawMaterialCode,
          @moisture,
          @wholeKernel,
          @brokenKernel,
          @shellContent,
          @foreignMatter,
          @totalDefects,
          @remarks,
          @createdBy,
          GETDATE()
        )
      `;

      const result = await executeQuery(query, {
        sampleDate: sampleData.sampleDate,
        batchNo: sampleData.batchNo,
        shiftNo: sampleData.shiftNo,
        machineNo: sampleData.machineNo,
        supplier: sampleData.supplier,
        rawMaterialCode: sampleData.rawMaterialCode,
        moisture: sampleData.moisture,
        wholeKernel: sampleData.wholeKernel,
        brokenKernel: sampleData.brokenKernel,
        shellContent: sampleData.shellContent,
        foreignMatter: sampleData.foreignMatter,
        totalDefects: sampleData.totalDefects,
        remarks: sampleData.remarks,
        createdBy: sampleData.createdBy,
      });

      return result.recordset[0];
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  /**
   * Update a shelling sample
   * @param {number} id - Sample ID
   * @param {Object} sampleData - Updated sample data
   * @returns {Promise<Object>}
   */
  static async update(id, sampleData) {
    try {
      const query = `
        UPDATE PT_QC_ShellingSamples
        SET
          SampleDate = COALESCE(@sampleDate, SampleDate),
          BatchNo = COALESCE(@batchNo, BatchNo),
          ShiftNo = COALESCE(@shiftNo, ShiftNo),
          MachineNo = COALESCE(@machineNo, MachineNo),
          Supplier = COALESCE(@supplier, Supplier),
          RawMaterialCode = COALESCE(@rawMaterialCode, RawMaterialCode),
          Moisture = COALESCE(@moisture, Moisture),
          WholeKernel = COALESCE(@wholeKernel, WholeKernel),
          BrokenKernel = COALESCE(@brokenKernel, BrokenKernel),
          ShellContent = COALESCE(@shellContent, ShellContent),
          ForeignMatter = COALESCE(@foreignMatter, ForeignMatter),
          TotalDefects = COALESCE(@totalDefects, TotalDefects),
          Remarks = COALESCE(@remarks, Remarks),
          UpdatedBy = @updatedBy,
          UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE SampleID = @id
      `;

      const result = await executeQuery(query, {
        id,
        sampleDate: sampleData.sampleDate,
        batchNo: sampleData.batchNo,
        shiftNo: sampleData.shiftNo,
        machineNo: sampleData.machineNo,
        supplier: sampleData.supplier,
        rawMaterialCode: sampleData.rawMaterialCode,
        moisture: sampleData.moisture,
        wholeKernel: sampleData.wholeKernel,
        brokenKernel: sampleData.brokenKernel,
        shellContent: sampleData.shellContent,
        foreignMatter: sampleData.foreignMatter,
        totalDefects: sampleData.totalDefects,
        remarks: sampleData.remarks,
        updatedBy: sampleData.updatedBy,
      });

      return result.recordset[0];
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  /**
   * Delete a shelling sample
   * @param {number} id - Sample ID
   * @returns {Promise<boolean>}
   */
  static async delete(id) {
    try {
      const query = `
        DELETE FROM PT_QC_ShellingSamples
        WHERE SampleID = @id
      `;

      await executeQuery(query, { id });
      return true;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  /**
   * Get statistics for dashboard
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>}
   */
  static async getStatistics(filters = {}) {
    try {
      const params = {};
      let whereClause = 'WHERE 1=1';

      if (filters.startDate) {
        whereClause += ` AND SampleDate >= @startDate`;
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        whereClause += ` AND SampleDate <= @endDate`;
        params.endDate = filters.endDate;
      }

      const query = `
        SELECT
          COUNT(*) as totalSamples,
          AVG(Moisture) as avgMoisture,
          AVG(WholeKernel) as avgWholeKernel,
          AVG(BrokenKernel) as avgBrokenKernel,
          AVG(ShellContent) as avgShellContent,
          AVG(ForeignMatter) as avgForeignMatter,
          AVG(TotalDefects) as avgTotalDefects,
          MIN(SampleDate) as earliestSample,
          MAX(SampleDate) as latestSample
        FROM PT_QC_ShellingSamples
        ${whereClause}
      `;

      const result = await executeQuery(query, params);
      return result.recordset[0];
    } catch (error) {
      console.error('Error in getStatistics:', error);
      throw error;
    }
  }

  /**
   * Get samples by batch number
   * @param {string} batchNo - Batch number
   * @returns {Promise<Array>}
   */
  static async findByBatch(batchNo) {
    try {
      const query = `
        SELECT * FROM PT_QC_ShellingSamples
        WHERE BatchNo = @batchNo
        ORDER BY SampleDate DESC
      `;

      const result = await executeQuery(query, { batchNo });
      return result.recordset;
    } catch (error) {
      console.error('Error in findByBatch:', error);
      throw error;
    }
  }
}
