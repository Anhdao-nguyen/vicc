import { useState, useMemo } from 'react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import ShellingFormNew from '@/components/shelling/ShellingFormNew'
import ShellingTable from '@/components/shelling/ShellingTable'
import ShellingEditModal from '@/components/shelling/ShellingEditModal'
import { useShellingData } from '@/hooks/useShellingData'
import { exportToCSV } from '@/utils/helpers'
import { mapFrontendToDb } from '@/utils/fieldMapping'

const Shelling = () => {
  const { records, addRecord, updateRecord, removeRecord } = useShellingData()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    date: '',
    shift: '',
    qcName: '',
    lot: '',
    origin: '',
    line: '',
    size: ''
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const perPage = 10

  const handleSubmit = async (recordsArray) => {
    try {
      // Use fieldMapping utility to convert frontend format to database format
      const mappedRecords = recordsArray.map(record => mapFrontendToDb(record));

      // Save each record to database
      let successCount = 0;
      for (const record of mappedRecords) {
        try {
          await addRecord(record);
          successCount++;
        } catch (err) {
          console.error('Error saving record:', err);
        }
      }

      if (successCount > 0) {
        alert(`✅ Đã lưu ${successCount}/${recordsArray.length} mẫu thành công!`);
      } else {
        alert('❌ Không thể lưu dữ liệu. Vui lòng kiểm tra kết nối!');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('❌ Có lỗi xảy ra khi lưu dữ liệu!');
    }
  }

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      return Object.keys(filters).every(key => {
        if (!filters[key]) return true
        const recordValue = String(record[key] || '').toLowerCase()
        const filterValue = String(filters[key]).toLowerCase()
        return recordValue.includes(filterValue)
      })
    })
  }, [records, filters])

  const total = Math.ceil(filteredRecords.length / perPage)
  const start = (page - 1) * perPage
  const data = filteredRecords.slice(start, start + perPage)

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1) // Reset to first page when filter changes
  }

  const clearFilters = () => {
    setFilters({
      date: '',
      shift: '',
      qcName: '',
      lot: '',
      origin: '',
      line: '',
      size: ''
    })
    setPage(1)
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (updatedRecord) => {
    try {
      // Convert frontend format to database format
      const mappedRecord = mapFrontendToDb(updatedRecord)

      // Update record in database
      await updateRecord(updatedRecord.id, mappedRecord)

      alert('✅ Cập nhật dữ liệu thành công!')
      setIsEditModalOpen(false)
      setEditingRecord(null)
    } catch (error) {
      console.error('Error updating record:', error)
      alert('❌ Có lỗi xảy ra khi cập nhật dữ liệu!')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>🥜 Công đoạn Shelling</h1>
        <p className="text-slate-600">Nhập dữ liệu QC - Form nhập nhiều mẫu</p>
      </div>

      <ShellingFormNew onSubmit={handleSubmit} />

      <div className="border-t-4 pt-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Table Review ({filteredRecords.length} bản ghi)</h2>
            <Button onClick={() => exportToCSV(filteredRecords)} disabled={!filteredRecords.length}>
              Export
            </Button>
          </div>

          {/* Filter Section */}
          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">Bộ lọc</h3>
              <button
                onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                placeholder="Ngày"
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                value={filters.shift}
                onChange={(e) => handleFilterChange('shift', e.target.value)}
                placeholder="Ca"
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                value={filters.qcName}
                onChange={(e) => handleFilterChange('qcName', e.target.value)}
                placeholder="Tên QC"
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                value={filters.lot}
                onChange={(e) => handleFilterChange('lot', e.target.value)}
                placeholder="Lot"
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                value={filters.origin}
                onChange={(e) => handleFilterChange('origin', e.target.value)}
                placeholder="Nguồn gốc"
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                value={filters.line}
                onChange={(e) => handleFilterChange('line', e.target.value)}
                placeholder="Line"
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                placeholder="Size"
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <ShellingTable data={data} onEdit={handleEdit} onDelete={removeRecord} />

          {total > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <Button variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>←</Button>
              {[...Array(total)].map((_, i) => (
                <Button key={i} variant={page === i + 1 ? 'primary' : 'secondary'} onClick={() => setPage(i + 1)}>{i + 1}</Button>
              ))}
              <Button variant="secondary" onClick={() => setPage(p => Math.min(total, p + 1))} disabled={page === total}>→</Button>
            </div>
          )}
        </Card>
      </div>

      {/* Edit Modal */}
      <ShellingEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingRecord(null)
        }}
        record={editingRecord}
        onSave={handleSaveEdit}
      />
    </div>
  )
}

export default Shelling