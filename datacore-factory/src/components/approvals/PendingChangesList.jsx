import { useState } from 'react';
import Button from '@/components/common/Button';

/**
 * Component hiển thị danh sách pending changes
 * @param {Array} pendingChanges - Danh sách pending changes
 * @param {Function} onView - Callback khi click xem chi tiết
 * @param {boolean} isLoading - Loading state
 */
const PendingChangesList = ({ pendingChanges = [], onView, isLoading = false }) => {
  const [filterStatus, setFilterStatus] = useState('PENDING');

  // Filter pending changes by status
  const filteredChanges = pendingChanges.filter(
    change => filterStatus === 'ALL' || change.Status === filterStatus
  );

  // Status badge style
  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Change type badge style
  const getChangeTypeBadge = (type) => {
    const styles = {
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'ALL' ? 'Tất cả' : status}
            {status !== 'ALL' && (
              <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-30 rounded-full text-xs">
                {pendingChanges.filter(c => c.Status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Pending Changes List */}
      {filteredChanges.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Không có thay đổi nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredChanges.map(change => (
            <div
              key={change.ChangeID}
              className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                {/* Left side - Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      #{change.ChangeID}
                    </span>
                    {getChangeTypeBadge(change.ChangeType)}
                    {getStatusBadge(change.Status)}
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                    <div>
                      <strong>Record ID:</strong> {change.OriginalRecordID}
                    </div>
                    <div>
                      <strong>Lot:</strong> {change.Lot || 'N/A'}
                    </div>
                    <div>
                      <strong>Line:</strong> {change.Line || 'N/A'}
                    </div>
                    <div>
                      <strong>Size:</strong> {change.Size || 'N/A'}
                    </div>
                    <div>
                      <strong>Người yêu cầu:</strong> {change.RequestedBy}
                    </div>
                    <div>
                      <strong>Thời gian:</strong>{' '}
                      {new Date(change.RequestedAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>

                    {/* Reviewed info (if applicable) */}
                    {change.Status !== 'PENDING' && (
                      <>
                        <div>
                          <strong>Người duyệt:</strong> {change.ReviewedBy || 'N/A'}
                        </div>
                        <div>
                          <strong>Thời gian duyệt:</strong>{' '}
                          {change.ReviewedAt
                            ? new Date(change.ReviewedAt).toLocaleString('vi-VN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'N/A'}
                        </div>
                      </>
                    )}

                    {/* Reject reason */}
                    {change.Status === 'REJECTED' && change.RejectReason && (
                      <div className="col-span-2">
                        <strong>Lý do reject:</strong>{' '}
                        <span className="text-red-600">{change.RejectReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - Action */}
                <div className="ml-4">
                  <Button
                    variant="primary"
                    onClick={() => onView(change)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingChangesList;