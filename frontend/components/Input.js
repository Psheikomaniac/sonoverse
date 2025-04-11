import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
  type = 'text',
  id,
  name,
  value,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  className = '',
  onChange,
  onBlur,
  onFocus
}) => {
  const baseInputClasses = 'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors';
  const stateClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white';
  const inputClasses = `${baseInputClasses} ${stateClasses} ${disabledClasses} ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className={`block mb-2 text-sm font-medium ${error ? 'text-red-500' : 'text-gray-700'}`}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputClasses}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        data-testid="input"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-500" data-testid="input-error">
          {error}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func
};

export default Input;
