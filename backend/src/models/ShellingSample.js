import { executeQuery } from '../config/database.js';

export class ShellingSample {
  /**
   * Get all shelling samples with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>}
   */
  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT
          ID,
          STT,
          Lot,
          NguonGoc,
          Line,
          Size,
          ThuTuMau,
          OutputValue,
          KhoiLuong,
          WholePct,
          BrokenBeGocPct,
          BeDoiVaManhPct,
          VetDaoPct,
          ShellPct,
          TotalBrokenPct,
          KetLuan,
          ChuThich,
          CreatedAt,
          UpdatedAt
        FROM PT_QC_ShellingSamples
        WHERE 1=1
      `;

      const params = [];

      // Add filters
      if (filters.lot) {
        query += ` AND Lot = ?`;
        params.push(filters.lot);
      }

      if (filters.nguonGoc) {
        query += ` AND NguonGoc = ?`;
        params.push(filters.nguonGoc);
      }

      if (filters.line) {
        query += ` AND Line = ?`;
        params.push(filters.line);
      }

      if (filters.size) {
        query += ` AND Size = ?`;
        params.push(filters.size);
      }

      query += ` ORDER BY CreatedAt DESC, ID DESC`;

      const result = await executeQuery(query, params);
      return result;
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
      const query = `SELECT * FROM PT_QC_ShellingSamples WHERE ID = ?`;
      const result = await executeQuery(query, [id]);
      return result[0] || null;
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
          STT,
          Lot,
          NguonGoc,
          Line,
          Size,
          ThuTuMau,
          OutputValue,
          KhoiLuong,
          WholePct,
          BrokenBeGocPct,
          BeDoiVaManhPct,
          VetDaoPct,
          ShellPct,
          TotalBrokenPct,
          KetLuan,
          ChuThich
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        sampleData.STT || null,
        sampleData.Lot || null,
        sampleData.NguonGoc || null,
        sampleData.Line || null,
        sampleData.Size || null,
        sampleData.ThuTuMau || null,
        sampleData.OutputValue || null,
        sampleData.KhoiLuong || null,
        sampleData.WholePct || null,
        sampleData.BrokenBeGocPct || null,
        sampleData.BeDoiVaManhPct || null,
        sampleData.VetDaoPct || null,
        sampleData.ShellPct || null,
        sampleData.TotalBrokenPct || null,
        sampleData.KetLuan || null,
        sampleData.ChuThich || null,
      ];

      const result = await executeQuery(query, params);

      // Return the created record
      return await this.findById(result.insertId);
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
          STT = COALESCE(?, STT),
          Lot = COALESCE(?, Lot),
          NguonGoc = COALESCE(?, NguonGoc),
          Line = COALESCE(?, Line),
          Size = COALESCE(?, Size),
          ThuTuMau = COALESCE(?, ThuTuMau),
          OutputValue = COALESCE(?, OutputValue),
          KhoiLuong = COALESCE(?, KhoiLuong),
          WholePct = COALESCE(?, WholePct),
          BrokenBeGocPct = COALESCE(?, BrokenBeGocPct),
          BeDoiVaManhPct = COALESCE(?, BeDoiVaManhPct),
          VetDaoPct = COALESCE(?, VetDaoPct),
          ShellPct = COALESCE(?, ShellPct),
          TotalBrokenPct = COALESCE(?, TotalBrokenPct),
          KetLuan = COALESCE(?, KetLuan),
          ChuThich = COALESCE(?, ChuThich)
        WHERE ID = ?
      `;

      const params = [
        sampleData.STT,
        sampleData.Lot,
        sampleData.NguonGoc,
        sampleData.Line,
        sampleData.Size,
        sampleData.ThuTuMau,
        sampleData.OutputValue,
        sampleData.KhoiLuong,
        sampleData.WholePct,
        sampleData.BrokenBeGocPct,
        sampleData.BeDoiVaManhPct,
        sampleData.VetDaoPct,
        sampleData.ShellPct,
        sampleData.TotalBrokenPct,
        sampleData.KetLuan,
        sampleData.ChuThich,
        id,
      ];

      await executeQuery(query, params);

      // Return the updated record
      return await this.findById(id);
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
      const query = `DELETE FROM PT_QC_ShellingSamples WHERE ID = ?`;
      await executeQuery(query, [id]);
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
      const query = `
        SELECT
          COUNT(*) as totalSamples,
          AVG(KhoiLuong) as avgKhoiLuong,
          AVG(WholePct) as avgWholePct,
          AVG(BrokenBeGocPct) as avgBrokenBeGocPct,
          AVG(BeDoiVaManhPct) as avgBeDoiVaManhPct,
          AVG(VetDaoPct) as avgVetDaoPct,
          AVG(ShellPct) as avgShellPct,
          AVG(TotalBrokenPct) as avgTotalBrokenPct,
          MIN(CreatedAt) as earliestSample,
          MAX(CreatedAt) as latestSample
        FROM PT_QC_ShellingSamples
      `;

      const result = await executeQuery(query, []);
      return result[0];
    } catch (error) {
      console.error('Error in getStatistics:', error);
      throw error;
    }
  }

  /**
   * Get samples by Lot
   * @param {string} lot - Lot number
   * @returns {Promise<Array>}
   */
  static async findByLot(lot) {
    try {
      const query = `
        SELECT * FROM PT_QC_ShellingSamples
        WHERE Lot = ?
        ORDER BY CreatedAt DESC
      `;

      const result = await executeQuery(query, [lot]);
      return result;
    } catch (error) {
      console.error('Error in findByLot:', error);
      throw error;
    }
  }
}
