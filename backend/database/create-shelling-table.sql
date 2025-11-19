-- Create PT_QC_ShellingSamples table for Shelling QC data
-- Run this SQL in your MySQL database: tripsmgm-mydb002

CREATE TABLE IF NOT EXISTS PT_QC_ShellingSamples (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  STT INT NULL COMMENT 'Số thứ tự',
  Lot VARCHAR(50) NULL COMMENT 'Số Lot',
  NguonGoc VARCHAR(100) NULL COMMENT 'Nguồn gốc',
  Line VARCHAR(50) NULL COMMENT 'Chuyền sản xuất',
  Size VARCHAR(50) NULL COMMENT 'Kích cỡ',
  ThuTuMau INT NULL COMMENT 'Thứ tự mẫu',
  OutputValue VARCHAR(50) NULL COMMENT 'Output',
  KhoiLuong DECIMAL(10,2) NULL COMMENT 'Khối lượng (g)',
  WholePct DECIMAL(5,2) NULL COMMENT '% Whole',
  BrokenBeGocPct DECIMAL(5,2) NULL COMMENT '% Broken - Bể góc',
  BeDoiVaManhPct DECIMAL(5,2) NULL COMMENT '% Bể đôi và mảnh',
  VetDaoPct DECIMAL(5,2) NULL COMMENT '% Vết dao',
  ShellPct DECIMAL(5,2) NULL COMMENT '% Shell',
  TotalBrokenPct DECIMAL(5,2) NULL COMMENT '% Tổng broken',
  KetLuan VARCHAR(100) NULL COMMENT 'Kết luận',
  ChuThich TEXT NULL COMMENT 'Ghi chú (date - shift - qcName - notes)',
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_lot (Lot),
  INDEX idx_created_at (CreatedAt),
  INDEX idx_line (Line),
  INDEX idx_size (Size)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Shelling QC Samples Data';

-- Sample query to verify table structure
-- SELECT * FROM PT_QC_ShellingSamples LIMIT 10;
