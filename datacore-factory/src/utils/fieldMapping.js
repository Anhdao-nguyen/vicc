/**
 * Field mapping between database and frontend
 * Maps database field names to frontend display names
 */

// Database field -> Frontend field mapping
export const dbToFrontend = {
  ID: 'id',
  Date: 'date',
  Shift: 'shift',
  QCName: 'qcName',
  Lot: 'lot',
  NguonGoc: 'origin',
  Line: 'line',
  Size: 'size',
  ThuTuMau: 'sampleOrder',
  OutputValue: 'output',
  KhoiLuong: 'sampleWeight',
  WholePct: 'wholePercent',
  BrokenBeGocPct: 'brokenCornerPercent',
  BeDoiVaManhPct: 'brokenSplitPercent',
  VetDaoPct: 'knifeMarkPercent',
  ShellPct: 'shellPercent',
  TotalBrokenPct: 'totalBrokenPercent',
  KetLuan: 'conclusion',
  ChuThich: 'notes',
  CreatedAt: 'createdAt',
  UpdatedAt: 'updatedAt',
};

// Frontend field -> Database field mapping
export const frontendToDb = {
  id: 'ID',
  date: 'Date',
  shift: 'Shift',
  qcName: 'QCName',
  lot: 'Lot',
  origin: 'NguonGoc',
  line: 'Line',
  size: 'Size',
  sampleOrder: 'ThuTuMau',
  output: 'OutputValue',
  sampleWeight: 'KhoiLuong',
  wholePercent: 'WholePct',
  brokenCornerPercent: 'BrokenBeGocPct',
  brokenSplitPercent: 'BeDoiVaManhPct',
  knifeMarkPercent: 'VetDaoPct',
  shellPercent: 'ShellPct',
  totalBrokenPercent: 'TotalBrokenPct',
  conclusion: 'KetLuan',
  notes: 'ChuThich',
};

/**
 * Map database record to frontend format
 * @param {Object} dbRecord - Record from database
 * @returns {Object} - Record in frontend format
 */
export function mapDbToFrontend(dbRecord) {
  const mapped = {};

  for (const [dbField, frontendField] of Object.entries(dbToFrontend)) {
    if (dbRecord.hasOwnProperty(dbField)) {
      mapped[frontendField] = dbRecord[dbField];
    }
  }

  // Note: Date, Shift, QCName are now separate fields in database
  // No longer need to extract from ChuThich

  return mapped;
}

/**
 * Map frontend record to database format
 * @param {Object} frontendRecord - Record from frontend
 * @returns {Object} - Record in database format
 */
export function mapFrontendToDb(frontendRecord) {
  const mapped = {};

  for (const [frontendField, dbField] of Object.entries(frontendToDb)) {
    if (frontendRecord.hasOwnProperty(frontendField)) {
      const value = frontendRecord[frontendField];

      // Parse numbers
      if (['KhoiLuong', 'WholePct', 'BrokenBeGocPct', 'BeDoiVaManhPct', 'VetDaoPct', 'ShellPct', 'TotalBrokenPct'].includes(dbField)) {
        mapped[dbField] = value ? parseFloat(value) : null;
      } else {
        mapped[dbField] = value || null;
      }
    }
  }

  // Date, Shift, QCName are now separate fields
  // ChuThich is just for notes
  if (frontendRecord.notes) {
    mapped.ChuThich = frontendRecord.notes;
  }

  // Add STT if id exists
  if (frontendRecord.id) {
    mapped.STT = frontendRecord.id;
  }

  return mapped;
}

/**
 * Map array of database records to frontend format
 * @param {Array} dbRecords - Array of database records
 * @returns {Array} - Array of frontend records
 */
export function mapDbArrayToFrontend(dbRecords) {
  return dbRecords.map(mapDbToFrontend);
}

/**
 * Map array of frontend records to database format
 * @param {Array} frontendRecords - Array of frontend records
 * @returns {Array} - Array of database records
 */
export function mapFrontendArrayToDb(frontendRecords) {
  return frontendRecords.map(mapFrontendToDb);
}
