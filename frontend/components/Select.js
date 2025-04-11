import React from 'react';
import PropTypes from 'prop-types';

const Select = ({
  id,
  name,
  value,
  options,
  label,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = '',
  onChange,
  onBlur,
  onFocus
}) => {
  const baseSelectClasses = 'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors appearance-none bg-white';
  const stateClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '';
  const selectClasses = `${baseSelectClasses} ${stateClasses} ${disabledClasses} ${className}`;

  return (
    <div className="mb-4 relative">
      {label && (
        <label 
          htmlFor={id} 
          className={`block mb-2 text-sm font-medium ${error ? 'text-red-500' : 'text-gray-700'}`}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          disabled={disabled}
          required={required}
          className={selectClasses}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          data-testid="select"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} data-testid="select-option">
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-500" data-testid="select-error">
          {error}
        </p>
      )}
    </div>
  );
};

Select.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func
};

export default Select;
