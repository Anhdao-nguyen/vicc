import { useState } from 'react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import ImportForm from '@/components/import-export/ImportForm'
import ExportForm from '@/components/import-export/ExportForm'
import { useImportExportData } from '@/hooks/useImportExportData'
import { exportToCSV, formatDate } from '@/utils/helpers'

const ImportExport = () => {
  const {
    importRecords,
    exportRecords,
    addImportRecord,
    removeImportRecord,
    addExportRecord,
    removeExportRecord
  } = useImportExportData()

  const [importPage, setImportPage] = useState(1)
  const [exportPage, setExportPage] = useState(1)
  const perPage = 10

  const handleImportSubmit = (record) => {
    addImportRecord(record)
    alert('✅ Đã lưu thông tin Import thành công!')
  }

  const handleExportSubmit = (record) => {
    addExportRecord(record)
    alert('✅ Đã lưu thông tin Export thành công!')
  }

  // Import pagination
  const importTotal = Math.ceil(importRecords.length / perPage)
  const importStart = (importPage - 1) * perPage
  const importData = importRecords.slice(importStart, importStart + perPage)

  // Export pagination
  const exportTotal = Math.ceil(exportRecords.length / perPage)
  const exportStart = (exportPage - 1) * perPage
  const exportData = exportRecords.slice(exportStart, exportStart + perPage)

  return (
    <div className="space-y-6">
      <div>
        <h1>🚢 Import-Export Management</h1>
        <p className="text-slate-600">Quản lý xuất nhập khẩu hàng hóa</p>
      </div>

      {/* IMPORT SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-blue-500 rounded"></div>
          <h2 className="text-2xl font-bold text-blue-700">IMPORT</h2>
        </div>

        <ImportForm onSubmit={handleImportSubmit} />

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-blue-700">
              📋 Table Review Import ({importRecords.length} bản ghi)
            </h3>
            <Button
              onClick={() => exportToCSV(importRecords, 'import-data')}
              disabled={!importRecords.length}
              variant="secondary"
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
                      <th className="px-4 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importData.map((record) => (
                      <tr key={record.id} className="border-t hover:bg-blue-50">
                        <td className="px-4 py-2">{formatDate(record.date)}</td>
                        <td className="px-4 py-2 font-mono">{record.containerNo}</td>
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

              {importTotal > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setImportPage(p => Math.max(1, p - 1))}
                    disabled={importPage === 1}
                  >
                    ←
                  </Button>
                  {[...Array(importTotal)].map((_, i) => (
                    <Button
                      key={i}
                      variant={importPage === i + 1 ? 'primary' : 'secondary'}
                      onClick={() => setImportPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="secondary"
                    onClick={() => setImportPage(p => Math.min(importTotal, p + 1))}
                    disabled={importPage === importTotal}
                  >
                    →
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* EXPORT SECTION */}
      <div className="space-y-4 pt-8 border-t-4 border-green-200">
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-green-500 rounded"></div>
          <h2 className="text-2xl font-bold text-green-700">EXPORT</h2>
        </div>

        <ExportForm onSubmit={handleExportSubmit} />

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-green-700">
              📋 Table Review Export ({exportRecords.length} bản ghi)
            </h3>
            <Button
              onClick={() => exportToCSV(exportRecords, 'export-data')}
              disabled={!exportRecords.length}
              variant="secondary"
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
                      <th className="px-4 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exportData.map((record) => (
                      <tr key={record.id} className="border-t hover:bg-green-50">
                        <td className="px-4 py-2">{formatDate(record.date)}</td>
                        <td className="px-4 py-2 font-mono">{record.containerNo}</td>
                        <td className="px-4 py-2">{record.destination}</td>
                        <td className="px-4 py-2 font-semibold">{record.productGrade}</td>
                        <td className="px-4 py-2">{record.containerType}</td>
                        <td className="px-4 py-2 text-right font-medium">{record.quantity}</td>
                        <td className="px-4 py-2">{record.unit}</td>
                        <td className="px-4 py-2">{record.inspectorName}</td>
                        <td className="px-4 py-2">{record.packingDate ? formatDate(record.packingDate) : '-'}</td>
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

              {exportTotal > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setExportPage(p => Math.max(1, p - 1))}
                    disabled={exportPage === 1}
                  >
                    ←
                  </Button>
                  {[...Array(exportTotal)].map((_, i) => (
                    <Button
                      key={i}
                      variant={exportPage === i + 1 ? 'primary' : 'secondary'}
                      onClick={() => setExportPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="secondary"
                    onClick={() => setExportPage(p => Math.min(exportTotal, p + 1))}
                    disabled={exportPage === exportTotal}
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

export default ImportExport
