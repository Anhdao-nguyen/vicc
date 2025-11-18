import { useState } from 'react'
import Button from '@/components/common/Button'
import { getTodayDate, generateId } from '@/utils/helpers'

const LINES = ['Line A', 'Line B1', 'Line B2', 'Line C', 'Line D']
const ORIGINS = ['Tanzania', 'IVC', 'Senegal', 'Nigeria', 'Vietnam', 'Cambodia', 'Bissau', 'India', 'Indonesia']
const SIZES = ['A++', 'A+', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E', 'E<16', 'E1', 'E2']
const SAMPLE_ORDERS = ['1', '2', '3', '4']
const OUTPUTS = ['Whole', 'Broken']
const SHIFTS = ['Ca 1', 'Ca 2', 'Ca 3']

const ShellingFormNew = ({ onSubmit }) => {
  const [checklistData, setChecklistData] = useState({
    date: getTodayDate(),
    shift: '',
    qcName: ''
  })

  const initialSample = {
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
  }

  const [samples, setSamples] = useState(Array(6).fill(null).map(() => ({ ...initialSample })))

  const handleChecklistChange = (e) => {
    const { name, value } = e.target
    setChecklistData(prev => ({ ...prev, [name]: value }))
  }

  const handleSampleChange = (index, field, value) => {
    setSamples(prev => {
      const newSamples = [...prev]
      newSamples[index] = { ...newSamples[index], [field]: value }

      // Auto calculate total broken %
      if (field === 'brokenCornerPercent' || field === 'brokenSplitPercent') {
        const brokenCorner = parseFloat(newSamples[index].brokenCornerPercent || 0)
        const brokenSplit = parseFloat(newSamples[index].brokenSplitPercent || 0)
        newSamples[index].totalBrokenPercent = (brokenCorner + brokenSplit).toFixed(2)
      }

      return newSamples
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate checklist
    if (!checklistData.date || !checklistData.shift || !checklistData.qcName) {
      alert('⚠️ Vui lòng điền đầy đủ thông tin checklist!')
      return
    }

    // Validate at least one sample
    const filledSamples = samples.filter(s => s.lot || s.origin || s.line)
    if (filledSamples.length === 0) {
      alert('⚠️ Vui lòng nhập ít nhất 1 mẫu!')
      return
    }

    // Create records for each filled sample
    const records = filledSamples.map(sample => ({
      id: generateId(),
      ...checklistData,
      ...sample,
      createdAt: new Date().toISOString()
    }))

    onSubmit(records)
    handleReset()
  }

  const handleReset = () => {
    setChecklistData({
      date: getTodayDate(),
      shift: '',
      qcName: ''
    })
    setSamples(Array(6).fill(null).map(() => ({ ...initialSample })))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Checklist Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">📋 Thông tin checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ngày <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={checklistData.date}
              onChange={handleChecklistChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ca làm việc <span className="text-red-500">*</span>
            </label>
            <select
              name="shift"
              value={checklistData.shift}
              onChange={handleChecklistChange}
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
              name="qcName"
              value={checklistData.qcName}
              onChange={handleChecklistChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Nhập tên QC"
              required
            />
          </div>
        </div>
      </div>

      {/* Sample Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">🔬 Thông tin mẫu (nhập tối đa 6 mẫu)</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[80px]">STT</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[100px]">Lot</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[120px]">Nguồn gốc</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[100px]">Line</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[100px]">Size</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[100px]">Thứ tự mẫu</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[100px]">Output</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[120px]">Khối lượng (g)</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[100px]">Whole %</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[120px]">Broken bể góc %</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[140px]">Bể đôi và mảnh %</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[100px]">Vết dao %</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[100px]">Shell %</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[120px] bg-blue-50">Total broken %</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[120px]">Kết luận</th>
                <th className="border border-slate-300 px-2 py-2 text-left min-w-[120px]">Chú thích</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((sample, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="border border-slate-300 px-2 py-2 text-center font-medium">{index + 1}</td>
                  <td className="border border-slate-300 px-2 py-2">
                    <input
                      type="text"
                      value={sample.lot}
                      onChange={(e) => handleSampleChange(index, 'lot', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="Lot"
                    />
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    <select
                      value={sample.origin}
                      onChange={(e) => handleSampleChange(index, 'origin', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="">-- Chọn --</option>
                      {ORIGINS.map(origin => (
                        <option key={origin} value={origin}>{origin}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    <select
                      value={sample.line}
                      onChange={(e) => handleSampleChange(index, 'line', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="">-- Chọn --</option>
                      {LINES.map(line => (
                        <option key={line} value={line}>{line}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    <select
                      value={sample.size}
                      onChange={(e) => handleSampleChange(index, 'size', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="">-- Chọn --</option>
                      {SIZES.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    <select
                      value={sample.sampleOrder}
                      onChange={(e) => handleSampleChange(index, 'sampleOrder', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="">-- Chọn --</option>
                      {SAMPLE_ORDERS.map(order => (
                        <option key={order} value={order}>{order}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    <select
                      value={sample.output}
                      onChange={(e) => handleSampleChange(index, 'output', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      {OUTPUTS.map(output => (
                        <option key={output} value={output}>{output}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={sample.sampleWeight}
                      onChange={(e) => handleSampleChange(index, 'sampleWeight', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={sample.wholePercent}
                      onChange={(e) => handleSampleChange(index, 'wholePercent', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={sample.brokenCornerPercent}
                      onChange={(e) => handleSampleChange(index, 'brokenCornerPercent', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={sample.brokenSplitPercent}
                      onChange={(e) => handleSampleChange(index, 'brokenSplitPercent', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={sample.knifeMarkPercent}
                      onChange={(e) => handleSampleChange(index, 'knifeMarkPercent', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={sample.shellPercent}
                      onChange={(e) => handleSampleChange(index, 'shellPercent', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="border border-slate-300 px-2 py-2 bg-blue-50">
                    <input
                      type="text"
                      value={sample.totalBrokenPercent}
                      readOnly
                      className="w-full px-2 py-1 bg-blue-100 border border-blue-200 rounded font-semibold text-blue-700"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    <input
                      type="text"
                      value={sample.conclusion}
                      onChange={(e) => handleSampleChange(index, 'conclusion', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="Kết luận"
                    />
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    <input
                      type="text"
                      value={sample.notes}
                      onChange={(e) => handleSampleChange(index, 'notes', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="Chú thích"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={handleReset}>
          Reset
        </Button>
        <Button type="submit">
          Lưu tất cả mẫu
        </Button>
      </div>
    </form>
  )
}

export default ShellingFormNew
