import { useState } from 'react';
import Button from '@/components/common/Button';
import PendingChangeDiff from './PendingChangeDiff';

/**
 * Modal để approve hoặc reject pending changes
 * @param {Object} pendingChange - Pending change object
 * @param {Function} onApprove - Callback khi approve
 * @param {Function} onReject - Callback khi reject
 * @param {Function} onClose - Callback khi đóng modal
 * @param {boolean} isLoading - Loading state
 */
const ApprovalModal = ({ pendingChange, onApprove, onReject, onClose, isLoading = false }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!pendingChange) return null;

  // Parse newData từ JSON string
  const newData = typeof pendingChange.NewData === 'string'
    ? JSON.parse(pendingChange.NewData)
    : pendingChange.NewData;

  // Tạo originalData object từ pending change
  const originalData = {
    Ngay: pendingChange.Ngay,
    Ca: pendingChange.Ca,
    QC: pendingChange.QC,
    Lot: pendingChange.Lot,
    NguonGoc: pendingChange.NguonGoc,
    Line: pendingChange.Line,
    Size: pendingChange.Size,
    ThuTuMau: pendingChange.ThuTuMau,
    OutputValue: pendingChange.OutputValue,
    KhoiLuong: pendingChange.KhoiLuong,
    WholePct: pendingChange.WholePct,
    BrokenBeGocPct: pendingChange.BrokenBeGocPct,
    BeDoiVaManhPct: pendingChange.BeDoiVaManhPct,
    VetDaoPct: pendingChange.VetDaoPct,
    ShellPct: pendingChange.ShellPct,
    TotalBrokenPct: pendingChange.TotalBrokenPct,
    KetLuan: pendingChange.KetLuan,
    ChuThich: pendingChange.ChuThich,
  };

  const handleApprove = () => {
    if (window.confirm('Bạn có chắc muốn approve thay đổi này?')) {
      onApprove(pendingChange.ChangeID);
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do reject');
      return;
    }

    if (window.confirm('Bạn có chắc muốn reject thay đổi này?')) {
      onReject(pendingChange.ChangeID, rejectReason);
      setShowRejectForm(false);
      setRejectReason('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">
              Xem xét thay đổi #{pendingChange.ChangeID}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          {/* Change Info */}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            <span>
              <strong>Record ID:</strong> {pendingChange.OriginalRecordID}
            </span>
            <span>
              <strong>Loại:</strong>{' '}
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                pendingChange.ChangeType === 'UPDATE'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {pendingChange.ChangeType}
              </span>
            </span>
            <span>
              <strong>Người yêu cầu:</strong> {pendingChange.RequestedBy}
            </span>
            <span>
              <strong>Thời gian:</strong>{' '}
              {new Date(pendingChange.RequestedAt).toLocaleString('vi-VN')}
            </span>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <PendingChangeDiff originalData={originalData} newData={newData} />

          {/* Reject Form */}
          {showRejectForm && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do từ chối *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="3"
                placeholder="Nhập lý do reject..."
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        {/* Footer - Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          {!showRejectForm ? (
            <>
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Đóng
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowRejectForm(true)}
                disabled={isLoading}
              >
                ❌ Reject
              </Button>
              <Button
                variant="success"
                onClick={handleApprove}
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : '✅ Approve'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectReason('');
                }}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                disabled={isLoading || !rejectReason.trim()}
              >
                {isLoading ? 'Đang xử lý...' : 'Xác nhận Reject'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
