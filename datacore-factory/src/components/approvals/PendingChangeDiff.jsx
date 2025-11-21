import { useMemo } from 'react';

/**
 * Component hiển thị sự khác biệt giữa dữ liệu cũ và mới
 * @param {Object} originalData - Dữ liệu gốc
 * @param {Object} newData - Dữ liệu mới
 */
const PendingChangeDiff = ({ originalData, newData }) => {
  // Field mapping: Database field -> Tiếng Việt
  const fieldLabels = {
    Ngay: 'Ngày',
    Ca: 'Ca',
    QC: 'QC',
    Lot: 'Lot',
    NguonGoc: 'Nguồn gốc',
    Line: 'Line',
    Size: 'Size',
    ThuTuMau: 'Thứ tự mẫu',
    OutputValue: 'Output',
    KhoiLuong: 'Khối lượng (kg)',
    WholePct: '% Whole',
    BrokenBeGocPct: '% Broken Bẹ Góc',
    BeDoiVaManhPct: '% Bẹ Đôi và Mảnh',
    VetDaoPct: '% Vết Dao',
    ShellPct: '% Shell',
    TotalBrokenPct: '% Tổng Broken',
    KetLuan: 'Kết luận',
    ChuThich: 'Chú thích',
  };

  // Tính toán các fields thay đổi
  const changedFields = useMemo(() => {
    if (!newData) return [];

    return Object.keys(newData).filter(key => {
      const oldValue = originalData?.[key];
      const newValue = newData[key];

      // So sánh giá trị (handle null/undefined)
      if (oldValue == null && newValue == null) return false;
      if (oldValue == null || newValue == null) return true;

      // Convert to string for comparison
      return String(oldValue) !== String(newValue);
    });
  }, [originalData, newData]);

  if (!newData || changedFields.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
        Không có thay đổi nào
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-700">
          Các trường thay đổi ({changedFields.length})
        </h4>
      </div>

      <div className="space-y-2">
        {changedFields.map(field => {
          const label = fieldLabels[field] || field;
          const oldValue = originalData?.[field] ?? '(Trống)';
          const newValue = newData[field] ?? '(Trống)';

          return (
            <div
              key={field}
              className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow"
            >
              <div className="font-medium text-gray-700 mb-2 text-sm">
                {label}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Old Value */}
                <div className="bg-red-50 border border-red-200 rounded p-2">
                  <div className="text-xs text-red-600 font-medium mb-1">Cũ</div>
                  <div className="text-sm text-gray-800 font-mono">
                    {String(oldValue)}
                  </div>
                </div>

                {/* New Value */}
                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <div className="text-xs text-green-600 font-medium mb-1">Mới</div>
                  <div className="text-sm text-gray-800 font-mono">
                    {String(newValue)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PendingChangeDiff;
