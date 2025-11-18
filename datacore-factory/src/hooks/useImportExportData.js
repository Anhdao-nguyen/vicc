import { useState, useEffect } from 'react'

const STORAGE_KEY_IMPORT = 'importData'
const STORAGE_KEY_EXPORT = 'exportData'

export const useImportExportData = () => {
  const [importRecords, setImportRecords] = useState([])
  const [exportRecords, setExportRecords] = useState([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedImport = localStorage.getItem(STORAGE_KEY_IMPORT)
    const savedExport = localStorage.getItem(STORAGE_KEY_EXPORT)

    if (savedImport) {
      try {
        setImportRecords(JSON.parse(savedImport))
      } catch (e) {
        console.error('Error loading import data:', e)
      }
    }

    if (savedExport) {
      try {
        setExportRecords(JSON.parse(savedExport))
      } catch (e) {
        console.error('Error loading export data:', e)
      }
    }
  }, [])

  // Save import records to localStorage
  useEffect(() => {
    if (importRecords.length > 0) {
      localStorage.setItem(STORAGE_KEY_IMPORT, JSON.stringify(importRecords))
    }
  }, [importRecords])

  // Save export records to localStorage
  useEffect(() => {
    if (exportRecords.length > 0) {
      localStorage.setItem(STORAGE_KEY_EXPORT, JSON.stringify(exportRecords))
    }
  }, [exportRecords])

  // Import functions
  const addImportRecord = (record) => {
    setImportRecords(prev => [record, ...prev])
  }

  const removeImportRecord = (id) => {
    setImportRecords(prev => prev.filter(r => r.id !== id))
  }

  // Export functions
  const addExportRecord = (record) => {
    setExportRecords(prev => [record, ...prev])
  }

  const removeExportRecord = (id) => {
    setExportRecords(prev => prev.filter(r => r.id !== id))
  }

  return {
    importRecords,
    exportRecords,
    addImportRecord,
    removeImportRecord,
    addExportRecord,
    removeExportRecord
  }
}
