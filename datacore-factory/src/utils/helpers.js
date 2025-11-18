import { QC_STATUS, STATUS_CONFIG } from './constants'

// Format date to DD/MM/YYYY
export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

// Format date for input (YYYY-MM-DD)
export const formatDateForInput = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

// Get today's date
export const getTodayDate = () => {
  return formatDateForInput(new Date())
}

// Determine QC status based on whole percentage
export const getQCStatus = (wholePercent) => {
  const percent = parseFloat(wholePercent)
  
  if (percent >= STATUS_CONFIG[QC_STATUS.PASS].threshold) {
    return QC_STATUS.PASS
  } else if (percent >= STATUS_CONFIG[QC_STATUS.WARNING].threshold) {
    return QC_STATUS.WARNING
  } else {
    return QC_STATUS.FAIL
  }
}

// Get status configuration
export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG[QC_STATUS.FAIL]
}

// Generate unique ID
export const generateId = () => {
  return `SHL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Validate percentage sum
export const isValidPercentageSum = (whole, broken, shell) => {
  const total = parseFloat(whole || 0) + parseFloat(broken || 0) + parseFloat(shell || 0)
  return Math.abs(total - 100) < 0.01
}

// Calculate statistics
export const calculateStats = (records) => {
  if (!records || records.length === 0) {
    return {
      totalRecords: 0,
      passRate: 0,
      avgWhole: 0,
      uniqueInspectors: 0,
    }
  }

  const totalRecords = records.length
  const passRecords = records.filter(r => getQCStatus(r.wholePercent) === QC_STATUS.PASS).length
  
  const totalWhole = records.reduce((sum, r) => sum + parseFloat(r.wholePercent || 0), 0)
  const avgWhole = totalRecords > 0 ? (totalWhole / totalRecords).toFixed(1) : 0
  
  const uniqueInspectors = new Set(records.map(r => r.qcName)).size

  return {
    totalRecords,
    passRate: totalRecords > 0 ? ((passRecords / totalRecords) * 100).toFixed(1) : 0,
    avgWhole: parseFloat(avgWhole),
    uniqueInspectors,
  }
}

// Export to CSV
export const exportToCSV = (records, filename = 'shelling-data.csv') => {
  if (!records || records.length === 0) {
    alert('Không có dữ liệu để export')
    return
  }

  const headers = [
    'Ngày',
    'Ca',
    'Line',
    'Size',
    'QC',
    'Khối lượng (kg)',
    '% Whole',
    '% Broken',
    '% Shell',
    'Trạng thái',
    'Ghi chú'
  ]

  const rows = records.map(record => [
    formatDate(record.date),
    record.shift,
    record.line,
    record.size,
    record.qcName,
    record.sampleWeight,
    record.wholePercent,
    record.brokenPercent,
    record.shellPercent,
    getStatusConfig(getQCStatus(record.wholePercent)).label,
    record.notes || ''
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}
