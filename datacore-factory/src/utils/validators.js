// Validate required field
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} không được để trống`
  }
  return null
}

// Validate date
export const validateDate = (value) => {
  if (!value) {
    return 'Vui lòng chọn ngày'
  }
  const selectedDate = new Date(value)
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  
  if (selectedDate > today) {
    return 'Ngày không được trong tương lai'
  }
  return null
}

// Validate number
export const validateNumber = (value, fieldName, min = 0, max = Infinity) => {
  if (value === '' || value === null || value === undefined) {
    return `${fieldName} không được để trống`
  }
  
  const num = parseFloat(value)
  
  if (isNaN(num)) {
    return `${fieldName} phải là số`
  }
  
  if (num < min) {
    return `${fieldName} phải >= ${min}`
  }
  
  if (num > max) {
    return `${fieldName} phải <= ${max}`
  }
  
  return null
}

// Validate percentage
export const validatePercentage = (value, fieldName) => {
  return validateNumber(value, fieldName, 0, 100)
}

// Validate percentage sum
export const validatePercentageSum = (whole, broken, shell) => {
  const w = parseFloat(whole || 0)
  const b = parseFloat(broken || 0)
  const s = parseFloat(shell || 0)
  const total = w + b + s
  
  if (Math.abs(total - 100) > 0.01) {
    return 'Tổng phần trăm phải bằng 100%'
  }
  return null
}

// Validate shelling form
export const validateShellingForm = (formData) => {
  const errors = {}

  const dateError = validateDate(formData.date)
  if (dateError) errors.date = dateError

  const shiftError = validateRequired(formData.shift, 'Ca làm việc')
  if (shiftError) errors.shift = shiftError

  const qcError = validateRequired(formData.qcName, 'Tên QC')
  if (qcError) errors.qcName = qcError

  const lineError = validateRequired(formData.line, 'Line')
  if (lineError) errors.line = lineError

  const sizeError = validateRequired(formData.size, 'Size')
  if (sizeError) errors.size = sizeError

  const weightError = validateNumber(formData.sampleWeight, 'Khối lượng mẫu', 0.01)
  if (weightError) errors.sampleWeight = weightError

  const wholeError = validatePercentage(formData.wholePercent, '% Whole')
  if (wholeError) errors.wholePercent = wholeError

  const brokenError = validatePercentage(formData.brokenPercent, '% Broken')
  if (brokenError) errors.brokenPercent = brokenError

  const shellError = validatePercentage(formData.shellPercent, '% Shell')
  if (shellError) errors.shellPercent = shellError

  if (!wholeError && !brokenError && !shellError) {
    const sumError = validatePercentageSum(
      formData.wholePercent,
      formData.brokenPercent,
      formData.shellPercent
    )
    if (sumError) {
      errors.wholePercent = sumError
    }
  }

  return errors
}
