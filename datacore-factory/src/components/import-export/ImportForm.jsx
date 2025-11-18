import { useState } from 'react'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import { getTodayDate, generateId } from '@/utils/helpers'

const SUPPLIERS = ['Tanzania', 'IVC', 'Senegal', 'Nigeria', 'Vietnam', 'Cambodia', 'Bissau', 'India', 'Indonesia']
const PRODUCT_TYPES = ['RCN', 'Kernel', 'Shell', 'Other']
const CONTAINER_TYPES = ['20ft', '40ft', '40ft HC']

const ImportForm = ({ onSubmit }) => {
  const initialFormData = {
    date: getTodayDate(),
    containerNo: '',
    supplier: '',
    productType: '',
    containerType: '',
    quantity: '',
    unit: 'MT',
    inspectorName: '',
    quality: '',
    notes: ''
  }

  const [formData, setFormData] = useState(initialFormData)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.containerNo || !formData.supplier || !formData.quantity) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc!')
      return
    }

    const record = {
      ...formData,
      id: generateId(),
      timestamp: new Date().toISOString()
    }

    onSubmit(record)
    setFormData(initialFormData)
  }

  return (
    <Card title="📦 Nhập liệu Import" className="bg-blue-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ngày nhập <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Số Container <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="containerNo"
              value={formData.containerNo}
              onChange={handleChange}
              required
              placeholder="VD: ABCD1234567"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nhà cung cấp <span className="text-red-500">*</span></label>
            <select
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn nhà cung cấp</option>
              {SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Loại sản phẩm <span className="text-red-500">*</span></label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn loại</option>
              {PRODUCT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Loại Container</label>
            <select
              name="containerType"
              value={formData.containerType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn loại</option>
              {CONTAINER_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Số lượng <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                step="0.01"
                placeholder="0.00"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-20 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MT">MT</option>
                <option value="KG">KG</option>
                <option value="LBS">LBS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Người kiểm tra</label>
            <input
              type="text"
              name="inspectorName"
              value={formData.inspectorName}
              onChange={handleChange}
              placeholder="Tên người kiểm tra"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Đánh giá chất lượng</label>
            <select
              name="quality"
              value={formData.quality}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn đánh giá</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-1">Ghi chú</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Ghi chú thêm..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            💾 Lưu Import
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default ImportForm
