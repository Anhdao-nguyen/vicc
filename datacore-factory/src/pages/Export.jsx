import { useState } from 'react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import ExportForm from '@/components/import-export/ExportForm'
import { useImportExportData } from '@/hooks/useImportExportData'
import { exportToCSV, formatDate } from '@/utils/helpers'

const Export = () => {
  const { exportRecords, addExportRecord, removeExportRecord } = useImportExportData()
  const [page, setPage] = useState(1)
  const perPage = 10

  const handleSubmit = (record) => {
    addExportRecord(record)
    alert('✅ Đã lưu thông tin Export thành công!')
  }

  const total = Math.ceil(exportRecords.length / perPage)
  const start = (page - 1) * perPage
  const data = exportRecords.slice(start, start + perPage)

  return (
    <div className="space-y-6">
      <div>
        <h1>🚢 Export Management</h1>
        <p className="text-slate-600">Quản lý xuất khẩu hàng hóa</p>
      </div>

      <ExportForm onSubmit={handleSubmit} />

      <div className="border-t-4 pt-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-green-700">
              📋 Table Review ({exportRecords.length} bản ghi)
            </h2>
            <Button
              onClick={() => exportToCSV(exportRecords, 'export-data')}
              disabled={!exportRecords.length}
            >
              📥 Export CSV
            </Button>
          </div>

          {exportRecords.length === 0 ? (
            <p className="text-center py-8 text-slate-500">Chưa có dữ liệu Export</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Ngày xuất</th>
                      <th className="px-4 py-2 text-left">Container No</th>
                      <th className="px-4 py-2 text-left">Thị trường</th>
                      <th className="px-4 py-2 text-left">Grade</th>
                      <th className="px-4 py-2 text-left">Loại Container</th>
                      <th className="px-4 py-2 text-left">Số lượng</th>
                      <th className="px-4 py-2 text-left">Đơn vị</th>
                      <th className="px-4 py-2 text-left">Người KT</th>
                      <th className="px-4 py-2 text-left">Ngày đóng hàng</th>
                      <th className="px-4 py-2 text-left">Ghi chú</th>
                      <th className="px-4 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((record) => (
                      <tr key={record.id} className="border-t hover:bg-green-50">
                        <td className="px-4 py-2">{formatDate(record.date)}</td>
                        <td className="px-4 py-2 font-mono text-xs">{record.containerNo}</td>
                        <td className="px-4 py-2">{record.destination}</td>
                        <td className="px-4 py-2 font-semibold">{record.productGrade}</td>
                        <td className="px-4 py-2">{record.containerType}</td>
                        <td className="px-4 py-2 text-right font-medium">{record.quantity}</td>
                        <td className="px-4 py-2">{record.unit}</td>
                        <td className="px-4 py-2">{record.inspectorName}</td>
                        <td className="px-4 py-2">{record.packingDate ? formatDate(record.packingDate) : '-'}</td>
                        <td className="px-4 py-2 max-w-xs truncate" title={record.notes}>
                          {record.notes || '-'}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => {
                              if (confirm('Xóa bản ghi này?')) removeExportRecord(record.id)
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {total > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ←
                  </Button>
                  {[...Array(total)].map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? 'primary' : 'secondary'}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="secondary"
                    onClick={() => setPage(p => Math.min(total, p + 1))}
                    disabled={page === total}
                  >
                    →
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Export
