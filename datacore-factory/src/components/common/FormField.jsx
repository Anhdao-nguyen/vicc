const FormField = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error = null,
  options = [],
  disabled = false,
  min,
  max,
  step
}) => {
  return (
    <div className="mb-4">
      <label className="label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`input-field ${error ? 'input-error' : ''}`}
          disabled={disabled}
        >
          <option value="">-- Chọn --</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows="3"
          className={`input-field ${error ? 'input-error' : ''}`}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-field ${error ? 'input-error' : ''}`}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
        />
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-1">⚠️ {error}</p>
      )}
    </div>
  )
}

export default FormField
