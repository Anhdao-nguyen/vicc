import { useState } from 'react'
import FormField from '@/components/common/FormField'
import Button from '@/components/common/Button'
import { SHIFTS, PRODUCTION_LINES, PRODUCT_SIZES } from '@/utils/constants'
import { validateShellingForm } from '@/utils/validators'
import { getTodayDate, generateId } from '@/utils/helpers'

const ShellingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    date: getTodayDate(),
    shift: '',
    qcName: '',
    line: '',
    size: '',
    sampleWeight: '',
    wholePercent: '',
    brokenPercent: '',
    shellPercent: '',
    notes: '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateShellingForm(formData)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const record = { id: generateId(), ...formData, createdAt: new Date().toISOString() }
    onSubmit(record)
    handleReset()
  }

  const handleReset = () => {
    setFormData({
      date: getTodayDate(),
      shift: '',
      qcName: '',
      line: '',
      size: '',
      sampleWeight: '',
      wholePercent: '',
      brokenPercent: '',
      shellPercent: '',
      notes: '',
    })
    setErrors({})
  }

  const total = parseFloat(formData.wholePercent || 0) + parseFloat(formData.brokenPercent || 0) + parseFloat(formData.shellPercent || 0)
  const isValid = Math.abs(total - 100) < 0.01

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <FormField label="Ngày" type="date" name="date" value={formData.date} onChange={handleChange} required error={errors.date} />
          <FormField label="Ca làm việc" type="select" name="shift" value={formData.shift} onChange={handleChange} options={SHIFTS} required error={errors.shift} />
          <FormField label="Tên QC" name="qcName" value={formData.qcName} onChange={handleChange} required error={errors.qcName} />
          <FormField label="Line" type="select" name="line" value={formData.line} onChange={handleChange} options={PRODUCTION_LINES} required error={errors.line} />
          <FormField label="Size" type="select" name="size" value={formData.size} onChange={handleChange} options={PRODUCT_SIZES} required error={errors.size} />
        </div>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Dữ liệu mẫu</h3>
        <FormField label="Khối lượng mẫu (kg)" type="number" step="0.01" name="sampleWeight" value={formData.sampleWeight} onChange={handleChange} required error={errors.sampleWeight} />
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <FormField label="% Whole" type="number" step="0.1" name="wholePercent" value={formData.wholePercent} onChange={handleChange} required error={errors.wholePercent} />
          <FormField label="% Broken" type="number" step="0.1" name="brokenPercent" value={formData.brokenPercent} onChange={handleChange} required />
          <FormField label="% Shell" type="number" step="0.1" name="shellPercent" value={formData.shellPercent} onChange={handleChange} required />
        </div>
        <div className={`p-4 mt-4 rounded-lg ${isValid ? 'bg-green-50' : 'bg-amber-50'}`}>
          <p className="font-medium">💡 Tổng: {total.toFixed(1)}% {isValid ? '✅' : '⚠️'}</p>
        </div>
        <FormField label="Ghi chú" type="textarea" name="notes" value={formData.notes} onChange={handleChange} />
      </div>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={handleReset}>🗑️ Reset</Button>
        <Button type="submit">✅ Lưu</Button>
      </div>
    </form>
  )
}

export default ShellingForm
