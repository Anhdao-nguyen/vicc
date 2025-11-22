import { useState, useEffect } from 'react';
import { departmentApproverAPI } from '../../services/api';

function ApproverInputModal({ isOpen, onClose, department, onConfirm }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [existingApprovers, setExistingApprovers] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('new'); // 'new' or 'existing'

  // Load existing approvers when modal opens
  useEffect(() => {
    if (isOpen && department) {
      loadExistingApprovers();
    }
  }, [isOpen, department]);

  const loadExistingApprovers = async () => {
    try {
      const response = await departmentApproverAPI.getByDepartment(department.id, true);
      setExistingApprovers(response.data || []);
    } catch (error) {
      console.error('Error loading approvers:', error);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@intersnack\.com\.vn$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError('');
  };

  const handleSubmit = async () => {
    if (mode === 'existing') {
      if (!selectedApprover) {
        setError('Vui lòng chọn một approver');
        return;
      }
      // Use existing approver
      onConfirm(selectedApprover);
      handleClose();
      return;
    }

    // Validate new email
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email phải có định dạng @intersnack.com.vn');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create new approver
      const response = await departmentApproverAPI.create(department.id, {
        email: email,
        name: name || null,
        role: 'leader',
      });

      if (response.success) {
        onConfirm(response.data);
        handleClose();
      } else {
        setError(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error creating approver:', error);
      setError(error.message || 'Không thể thêm approver. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setName('');
    setSelectedApprover(null);
    setError('');
    setMode('new');
    onClose();
  };

  const handleSelectExisting = (approver) => {
    setSelectedApprover(approver);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slideDown">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-bold">Chỉ định người duyệt</h2>
          <p className="text-sm text-white/80 mt-1">
            Bộ phận: {department?.title}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Mode Selection */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('new')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'new'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Email mới
            </button>
            {existingApprovers.length > 0 && (
              <button
                onClick={() => setMode('existing')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  mode === 'existing'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Chọn có sẵn
              </button>
            )}
          </div>

          {/* New Email Input */}
          {mode === 'new' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email người duyệt <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="example@intersnack.com.vn"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên người duyệt (tùy chọn)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <span className="font-semibold">Lưu ý:</span> Email phải có định dạng @intersnack.com.vn
                </p>
              </div>
            </div>
          )}

          {/* Existing Approvers List */}
          {mode === 'existing' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn từ danh sách có sẵn:
              </label>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {existingApprovers.map((approver) => (
                  <button
                    key={approver.ApproverID}
                    onClick={() => handleSelectExisting(approver)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedApprover?.ApproverID === approver.ApproverID
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedApprover?.ApproverID === approver.ApproverID
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedApprover?.ApproverID === approver.ApproverID && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {approver.ApproverEmail}
                        </p>
                        {approver.ApproverName && (
                          <p className="text-sm text-gray-500">
                            {approver.ApproverName}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 capitalize">
                          {approver.ApproverRole}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:shadow-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ApproverInputModal;
