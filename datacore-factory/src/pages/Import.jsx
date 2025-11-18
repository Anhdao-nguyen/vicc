import { useState } from 'react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import ImportForm from '@/components/import-export/ImportForm'
import { useImportExportData } from '@/hooks/useImportExportData'
import { exportToCSV, formatDate } from '@/utils/helpers'

const Import = () => {
  const { importRecords, addImportRecord, removeImportRecord } = useImportExportData()
  const [page, setPage] = useState(1)
  const perPage = 10

  const handleSubmit = (record) => {
    addImportRecord(record)
    alert('✅ Đã lưu thông tin Import thành công!')
  }

  const total = Math.ceil(importRecords.length / perPage)
  const start = (page - 1) * perPage
  const data = importRecords.slice(start, start + perPage)

  return (
    <div className="space-y-6">
      <div>
        <h1>📦 Import Management</h1>
        <p className="text-slate-600">Quản lý nhập khẩu hàng hóa</p>
      </div>

      <ImportForm onSubmit={handleSubmit} />

      <div className="border-t-4 pt-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-700">
              📋 Table Review ({importRecords.length} bản ghi)
            </h2>
            <Button
              onClick={() => exportToCSV(importRecords, 'import-data')}
              disabled={!importRecords.length}
            >
              📥 Export CSV
            </Button>
          </div>

          {importRecords.length === 0 ? (
            <p className="text-center py-8 text-slate-500">Chưa có dữ liệu Import</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Ngày</th>
                      <th className="px-4 py-2 text-left">Container No</th>
                      <th className="px-4 py-2 text-left">Nhà cung cấp</th>
                      <th className="px-4 py-2 text-left">Sản phẩm</th>
                      <th className="px-4 py-2 text-left">Loại Container</th>
                      <th className="px-4 py-2 text-left">Số lượng</th>
                      <th className="px-4 py-2 text-left">Đơn vị</th>
                      <th className="px-4 py-2 text-left">Người KT</th>
                      <th className="px-4 py-2 text-left">Chất lượng</th>
                      <th className="px-4 py-2 text-left">Ghi chú</th>
                      <th className="px-4 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((record) => (
                      <tr key={record.id} className="border-t hover:bg-blue-50">
                        <td className="px-4 py-2">{formatDate(record.date)}</td>
                        <td className="px-4 py-2 font-mono text-xs">{record.containerNo}</td>
                        <td className="px-4 py-2">{record.supplier}</td>
                        <td className="px-4 py-2">{record.productType}</td>
                        <td className="px-4 py-2">{record.containerType}</td>
                        <td className="px-4 py-2 text-right font-medium">{record.quantity}</td>
                        <td className="px-4 py-2">{record.unit}</td>
                        <td className="px-4 py-2">{record.inspectorName}</td>
                        <td className="px-4 py-2">
                          {record.quality && (
                            <span className={`px-2 py-1 text-xs rounded ${
                              record.quality === 'Excellent' ? 'bg-green-100 text-green-700' :
                              record.quality === 'Good' ? 'bg-blue-100 text-blue-700' :
                              record.quality === 'Average' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {record.quality}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 max-w-xs truncate" title={record.notes}>
                          {record.notes || '-'}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => {
                              if (confirm('Xóa bản ghi này?')) removeImportRecord(record.id)
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

export default Import
