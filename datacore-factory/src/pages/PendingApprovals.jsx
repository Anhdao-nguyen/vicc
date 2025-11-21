import { useState, useEffect } from 'react';
import { pendingChangesAPI } from '@/services/api';
import PendingChangesList from '@/components/approvals/PendingChangesList';
import ApprovalModal from '@/components/approvals/ApprovalModal';

const PendingApprovals = () => {
  const [pendingChanges, setPendingChanges] = useState([]);
  const [selectedChange, setSelectedChange] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);

  // Load pending changes
  const loadPendingChanges = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await pendingChangesAPI.getAll();
      setPendingChanges(response.data || []);
    } catch (err) {
      console.error('Error loading pending changes:', err);
      setError(err.message || 'Không thể tải danh sách thay đổi');
    } finally {
      setIsLoading(false);
    }
  };

  // Load statistics
  const loadStatistics = async () => {
    try {
      const response = await pendingChangesAPI.getStatistics();
      setStatistics(response.data);
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  // Initial load
  useEffect(() => {
    loadPendingChanges();
    loadStatistics();
  }, []);

  // Handle view detail
  const handleView = (change) => {
    setSelectedChange(change);
  };

  // Handle approve
  const handleApprove = async (changeId) => {
    setIsProcessing(true);
    try {
      await pendingChangesAPI.approve(changeId);
      alert('✅ Đã approve thay đổi thành công!');
      setSelectedChange(null);
      await loadPendingChanges();
      await loadStatistics();
    } catch (err) {
      console.error('Error approving change:', err);
      alert('❌ Lỗi khi approve: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle reject
  const handleReject = async (changeId, rejectReason) => {
    setIsProcessing(true);
    try {
      await pendingChangesAPI.reject(changeId, rejectReason);
      alert('✅ Đã reject thay đổi!');
      setSelectedChange(null);
      await loadPendingChanges();
      await loadStatistics();
    } catch (err) {
      console.error('Error rejecting change:', err);
      alert('❌ Lỗi khi reject: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setSelectedChange(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Duyệt thay đổi
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Quản lý các yêu cầu thay đổi dữ liệu từ người dùng
          </p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => {
            loadPendingChanges();
            loadStatistics();
          }}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-400">
            <div className="text-2xl font-bold text-gray-900">{statistics.total || 0}</div>
            <div className="text-sm text-gray-600">Tổng số</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-400">
            <div className="text-2xl font-bold text-yellow-600">{statistics.pending || 0}</div>
            <div className="text-sm text-gray-600">Chờ duyệt</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-400">
            <div className="text-2xl font-bold text-green-600">{statistics.approved || 0}</div>
            <div className="text-sm text-gray-600">Đã duyệt</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-400">
            <div className="text-2xl font-bold text-red-600">{statistics.rejected || 0}</div>
            <div className="text-sm text-gray-600">Đã từ chối</div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <strong>Lỗi:</strong> {error}
        </div>
      )}

      {/* Pending Changes List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <PendingChangesList
          pendingChanges={pendingChanges}
          onView={handleView}
          isLoading={isLoading}
        />
      </div>

      {/* Approval Modal */}
      {selectedChange && (
        <ApprovalModal
          pendingChange={selectedChange}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={handleCloseModal}
          isLoading={isProcessing}
        />
      )}
    </div>
  );
};

export default PendingApprovals;
