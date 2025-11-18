import { STORAGE_KEYS } from '@/utils/constants'

// Get data from localStorage
export const getStorageData = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return []
  }
}

// Save data to localStorage
export const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Error writing to localStorage:', error)
    return false
  }
}

// Shelling Storage Functions
export const getShellingRecords = () => {
  return getStorageData(STORAGE_KEYS.SHELLING_DATA)
}

export const saveShellingRecord = (record) => {
  const records = getShellingRecords()
  records.unshift(record) // Add to beginning
  return setStorageData(STORAGE_KEYS.SHELLING_DATA, records)
}

export const updateShellingRecord = (id, updatedRecord) => {
  const records = getShellingRecords()
  const index = records.findIndex(r => r.id === id)
  if (index !== -1) {
    records[index] = { ...records[index], ...updatedRecord }
    return setStorageData(STORAGE_KEYS.SHELLING_DATA, records)
  }
  return false
}

export const deleteShellingRecord = (id) => {
  const records = getShellingRecords()
  const filtered = records.filter(r => r.id !== id)
  return setStorageData(STORAGE_KEYS.SHELLING_DATA, filtered)
}

export const clearAllShellingRecords = () => {
  return setStorageData(STORAGE_KEYS.SHELLING_DATA, [])
}
