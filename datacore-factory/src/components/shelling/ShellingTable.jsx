import Table from '@/components/common/Table'
import { formatDate } from '@/utils/helpers'
import { mapDbToFrontend } from '@/utils/fieldMapping'

const ShellingTable = ({ data, onDelete }) => {
  // Use fieldMapping utility to convert database format to frontend format
  const mappedData = data.map(record => mapDbToFrontend(record));

  const columns = [
    { key: 'date', label: 'Ngày', render: (val) => formatDate(val) },
    { key: 'shift', label: 'Ca' },
    { key: 'qcName', label: 'QC' },
    { key: 'lot', label: 'Lot' },
    { key: 'origin', label: 'Nguồn gốc' },
    { key: 'line', label: 'Line' },
    { key: 'size', label: 'Size' },
    { key: 'sampleOrder', label: 'Thứ tự' },
    { key: 'output', label: 'Output' },
    { key: 'sampleWeight', label: 'KL(g)', render: (val) => val ? parseFloat(val).toFixed(1) : '-' },
    { key: 'wholePercent', label: '%Whole', render: (val) => val ? parseFloat(val).toFixed(2) : '-' },
    { key: 'brokenCornerPercent', label: '%Bể góc', render: (val) => val ? parseFloat(val).toFixed(2) : '-' },
    { key: 'brokenSplitPercent', label: '%Bể mảnh', render: (val) => val ? parseFloat(val).toFixed(2) : '-' },
    { key: 'knifeMarkPercent', label: '%Vết dao', render: (val) => val ? parseFloat(val).toFixed(2) : '-' },
    { key: 'shellPercent', label: '%Shell', render: (val) => val ? parseFloat(val).toFixed(2) : '-' },
    { key: 'totalBrokenPercent', label: '%Total Broken', render: (val) => (
      <span className="font-semibold text-blue-700">{val ? parseFloat(val).toFixed(2) : '-'}</span>
    )},
    { key: 'conclusion', label: 'Kết luận' },
    { key: 'notes', label: 'Chú thích' },
  ]

  const handleDelete = (row) => {
    if (confirm(`Xác nhận xóa dữ liệu QC?`)) {
      onDelete(row.id)
    }
  }

  return <Table columns={columns} data={mappedData} onDelete={handleDelete} />
}

export default ShellingTable
