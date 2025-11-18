// App Info
export const APP_NAME = 'Datacore Factory'
export const APP_VERSION = '1.0.0'

// Process Stages - 10 công đoạn
export const PROCESS_STAGES = [
  { id: 'calibration', name: 'Calibration', status: 'coming', path: '#' },
  { id: 'steaming', name: 'Steaming', status: 'coming', path: '#' },
  { id: 'shelling', name: 'Shelling', status: 'active', path: '/shelling' },
  { id: 'borma', name: 'Borma', status: 'coming', path: '#' },
  { id: 'cooling', name: 'Cooling', status: 'coming', path: '#' },
  { id: 'peeling', name: 'Peeling', status: 'coming', path: '#' },
  { id: 'color-sorter', name: 'Color Sorter', status: 'coming', path: '#' },
  { id: 'remoisture', name: 'Remoisture', status: 'coming', path: '#' },
  { id: 'packing', name: 'Packing', status: 'coming', path: '#' },
]

// Shelling Form Options
export const SHIFTS = [
  { value: 'Ca 1', label: 'Ca 1 (6:00 - 14:00)' },
  { value: 'Ca 2', label: 'Ca 2 (14:00 - 22:00)' },
  { value: 'Ca 3', label: 'Ca 3 (22:00 - 6:00)' },
]

export const PRODUCTION_LINES = [
  { value: 'Line 1', label: 'Line 1' },
  { value: 'Line 2', label: 'Line 2' },
  { value: 'Line 3', label: 'Line 3' },
  { value: 'Line 4', label: 'Line 4' },
]

export const PRODUCT_SIZES = [
  { value: 'Small', label: 'Small (S)' },
  { value: 'Medium', label: 'Medium (M)' },
  { value: 'Large', label: 'Large (L)' },
  { value: 'Extra Large', label: 'Extra Large (XL)' },
]

// QC Status
export const QC_STATUS = {
  PASS: 'pass',
  WARNING: 'warning',
  FAIL: 'fail',
}

export const STATUS_CONFIG = {
  [QC_STATUS.PASS]: {
    label: 'Đạt',
    icon: '✅',
    class: 'badge-success',
    threshold: 85,
  },
  [QC_STATUS.WARNING]: {
    label: 'Cảnh báo',
    icon: '⚠️',
    class: 'badge-warning',
    threshold: 70,
  },
  [QC_STATUS.FAIL]: {
    label: 'Không đạt',
    icon: '❌',
    class: 'badge-danger',
    threshold: 0,
  },
}

// Storage Keys
export const STORAGE_KEYS = {
  SHELLING_DATA: 'datacore_shelling_records',
}
