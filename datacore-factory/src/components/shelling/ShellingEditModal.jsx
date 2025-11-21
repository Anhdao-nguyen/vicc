import { useState, useEffect } from 'react'
import Button from '@/components/common/Button'

const LINES = ['Line A', 'Line B1', 'Line B2', 'Line C', 'Line D']
const ORIGINS = ['Tanzania', 'IVC', 'Senegal', 'Nigeria', 'Vietnam', 'Cambodia', 'Bissau', 'India', 'Indonesia']
const SIZES = ['A++', 'A+', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E', 'E<16', 'E1', 'E2']
const SAMPLE_ORDERS = ['1', '2', '3', '4']
const OUTPUTS = ['Whole', 'Broken']
const SHIFTS = ['Ca 1', 'Ca 2', 'Ca 3']

const ShellingEditModal = ({ isOpen, onClose, record, onSave }) => {
  const [formData, setFormData] = useState({
    date: '',
    shift: '',
    qcName: '',
    lot: '',
    origin: '',
    line: '',
    size: '',
    sampleOrder: '',
    output: 'Whole',
    sampleWeight: '',
    wholePercent: '',
    brokenCornerPercent: '',
    brokenSplitPercent: '',
    knifeMarkPercent: '',
    shellPercent: '',
    totalBrokenPercent: 0,
    conclusion: '',
    notes: ''
  })

  // Load record data when modal opens
  useEffect(() => {
    if (record) {
      setFormData({
        date: record.date || '',
        shift: record.shift || '',
        qcName: record.qcName || '',
        lot: record.lot || '',
        origin: record.origin || '',
        line: record.line || '',
        size: record.size || '',
        sampleOrder: record.sampleOrder || '',
        output: record.output || 'Whole',
        sampleWeight: record.sampleWeight || '',
        wholePercent: record.wholePercent || '',
        brokenCornerPercent: record.brokenCornerPercent || '',
        brokenSplitPercent: record.brokenSplitPercent || '',
        knifeMarkPercent: record.knifeMarkPercent || '',
        shellPercent: record.shellPercent || '',
        totalBrokenPercent: record.totalBrokenPercent || 0,
        conclusion: record.conclusion || '',
        notes: record.notes || ''
      })
    }
  }, [record])

  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }

      // Auto calculate total broken %
      if (field === 'brokenCornerPercent' || field === 'brokenSplitPercent') {
        const brokenCorner = parseFloat(newData.brokenCornerPercent || 0)
        const brokenSplit = parseFloat(newData.brokenSplitPercent || 0)
        newData.totalBrokenPercent = (brokenCorner + brokenSplit).toFixed(2)
      }

      return newData
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.date || !formData.shift || !formData.qcName) {
      alert('⚠️ Vui lòng điền đầy đủ thông tin bắt buộc!')
      return
    }

    onSave({ ...record, ...formData })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800">✏️ Chỉnh sửa dữ liệu Shelling</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Checklist Section */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 text-slate-700">📋 Thông tin checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ca làm việc <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.shift}
                  onChange={(e) => handleChange('shift', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">-- Chọn ca --</option>
                  {SHIFTS.map(shift => (
                    <option key={shift} value={shift}>{shift}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tên QC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.qcName}
                  onChange={(e) => handleChange('qcName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập tên QC"
                  required
                />
              </div>
            </div>
          </div>

          {/* Sample Info Section */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 text-slate-700">🔬 Thông tin mẫu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Lot</label>
                <input
                  type="text"
                  value={formData.lot}
                  onChange={(e) => handleChange('lot', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Lot"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nguồn gốc</label>
                <select
                  value={formData.origin}
                  onChange={(e) => handleChange('origin', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">-- Chọn --</option>
                  {ORIGINS.map(origin => (
                    <option key={origin} value={origin}>{origin}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Line</label>
                <select
                  value={formData.line}
                  onChange={(e) => handleChange('line', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">-- Chọn --</option>
                  {LINES.map(line => (
                    <option key={line} value={line}>{line}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Size</label>
                <select
                  value={formData.size}
                  onChange={(e) => handleChange('size', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">-- Chọn --</option>
                  {SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Thứ tự mẫu</label>
                <select
                  value={formData.sampleOrder}
                  onChange={(e) => handleChange('sampleOrder', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">-- Chọn --</option>
                  {SAMPLE_ORDERS.map(order => (
                    <option key={order} value={order}>{order}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Output</label>
                <select
                  value={formData.output}
                  onChange={(e) => handleChange('output', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {OUTPUTS.map(output => (
                    <option key={output} value={output}>{output}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Measurements Section */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 text-slate-700">📊 Số liệu đo lường</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Khối lượng (g)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sampleWeight}
                  onChange={(e) => handleChange('sampleWeight', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Whole %</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.wholePercent}
                  onChange={(e) => handleChange('wholePercent', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Broken bể góc %</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.brokenCornerPercent}
                  onChange={(e) => handleChange('brokenCornerPercent', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bể đôi và mảnh %</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.brokenSplitPercent}
                  onChange={(e) => handleChange('brokenSplitPercent', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Vết dao %</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.knifeMarkPercent}
                  onChange={(e) => handleChange('knifeMarkPercent', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Shell %</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.shellPercent}
                  onChange={(e) => handleChange('shellPercent', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0.00"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Total Broken % <span className="text-blue-600">(Tự động tính)</span>
                </label>
                <input
                  type="text"
                  value={formData.totalBrokenPercent}
                  readOnly
                  className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg font-semibold text-blue-700"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Conclusion Section */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 text-slate-700">📝 Kết luận</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kết luận</label>
                <input
                  type="text"
                  value={formData.conclusion}
                  onChange={(e) => handleChange('conclusion', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập kết luận"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Chú thích</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập chú thích"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              💾 Lưu thay đổi
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ShellingEditModal
