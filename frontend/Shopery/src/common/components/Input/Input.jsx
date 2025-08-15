// Shared Input Component - Dùng chung cho Admin và Client
import React, { forwardRef } from 'react'
import './Input.css'

const Input = forwardRef(({ 
  label,
  type = 'text',
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const inputClass = `input ${error ? 'input--error' : ''} ${disabled ? 'input--disabled' : ''} ${className}`

  return (
    <div className={`input-container ${containerClassName}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={inputClass}
        disabled={disabled}
        {...props}
      />
      
      {error && <span className="input-error-message">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
