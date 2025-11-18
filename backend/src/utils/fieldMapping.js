// Mapping giữa tên database và tên hiển thị tiếng Việt
export const fieldMapping = {
  ID: 'ID',
  Ngay: 'NGÀY',
  Ca: 'CA',
  QC: 'QC',
  Lot: 'LOT',
  NguonGoc: 'NGUỒN GỐC',
  Line: 'LINE',
  Size: 'SIZE',
  ThuTuMau: 'THỨ TỰ',
  OutputValue: 'OUTPUT',
  KhoiLuong: 'KL(G)',
  WholePct: '%WHOLE',
  BrokenBeGocPct: '%BỂ GÓC',
  BeDoiVaManhPct: '%BỂ MẢNH',
  VetDaoPct: '%VẾT DAO',
  ShellPct: '%SHELL',
  TotalBrokenPct: '%TOTAL BROKEN',
  KetLuan: 'KẾT LUẬN',
  ChuThich: 'CHÚ THÍCH'
};

// Reverse mapping: Display name -> Database field
export const reverseFieldMapping = Object.fromEntries(
  Object.entries(fieldMapping).map(([key, value]) => [value, key])
);

// Danh sách các fields cho form (theo thứ tự hiển thị)
export const formFields = [
  { dbName: 'Ngay', label: 'NGÀY', type: 'date' },
  { dbName: 'Ca', label: 'CA', type: 'text' },
  { dbName: 'QC', label: 'QC', type: 'text' },
  { dbName: 'Lot', label: 'LOT', type: 'text' },
  { dbName: 'NguonGoc', label: 'NGUỒN GỐC', type: 'text' },
  { dbName: 'Line', label: 'LINE', type: 'text' },
  { dbName: 'Size', label: 'SIZE', type: 'text' },
  { dbName: 'ThuTuMau', label: 'THỨ TỰ', type: 'number' },
  { dbName: 'OutputValue', label: 'OUTPUT', type: 'text' },
  { dbName: 'KhoiLuong', label: 'KL(G)', type: 'number', step: '0.01' },
  { dbName: 'WholePct', label: '%WHOLE', type: 'number', step: '0.01' },
  { dbName: 'BrokenBeGocPct', label: '%BỂ GÓC', type: 'number', step: '0.01' },
  { dbName: 'BeDoiVaManhPct', label: '%BỂ MẢNH', type: 'number', step: '0.01' },
  { dbName: 'VetDaoPct', label: '%VẾT DAO', type: 'number', step: '0.01' },
  { dbName: 'ShellPct', label: '%SHELL', type: 'number', step: '0.01' },
  { dbName: 'TotalBrokenPct', label: '%TOTAL BROKEN', type: 'number', step: '0.01' },
  { dbName: 'KetLuan', label: 'KẾT LUẬN', type: 'text' },
  { dbName: 'ChuThich', label: 'CHÚ THÍCH', type: 'textarea' }
];

// Columns cho table hiển thị (không bao gồm ID, CreatedAt, UpdatedAt)
export const tableColumns = [
  'Ngay', 'Ca', 'QC', 'Lot', 'NguonGoc', 'Line', 'Size', 'ThuTuMau',
  'OutputValue', 'KhoiLuong', 'WholePct', 'BrokenBeGocPct', 'BeDoiVaManhPct',
  'VetDaoPct', 'ShellPct', 'TotalBrokenPct', 'KetLuan', 'ChuThich'
];

// Initial form state (dùng để reset form)
export const initialFormState = {
  Ngay: '',
  Ca: '',
  QC: '',
  Lot: '',
  NguonGoc: '',
  Line: '',
  Size: '',
  ThuTuMau: '',
  OutputValue: '',
  KhoiLuong: '',
  WholePct: '',
  BrokenBeGocPct: '',
  BeDoiVaManhPct: '',
  VetDaoPct: '',
  ShellPct: '',
  TotalBrokenPct: '',
  KetLuan: '',
  ChuThich: ''
};
