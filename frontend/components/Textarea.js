import React from 'react';
import PropTypes from 'prop-types';

const Textarea = ({
  id,
  name,
  value,
  placeholder,
  label,
  error,
  rows = 4,
  maxLength,
  disabled = false,
  required = false,
  className = '',
  onChange,
  onBlur,
  onFocus
}) => {
  const baseTextareaClasses = 'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors';
  const stateClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white';
  const textareaClasses = `${baseTextareaClasses} ${stateClasses} ${disabledClasses} ${className}`;

  const [charCount, setCharCount] = React.useState(value ? value.length : 0);

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (onChange) {
      onChange(e);
    }
  };

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
      <textarea
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        className={textareaClasses}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        data-testid="textarea"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      ></textarea>
      <div className="flex justify-between mt-1">
        {error && (
          <p id={`${id}-error`} className="text-sm text-red-500" data-testid="textarea-error">
            {error}
          </p>
        )}
        {maxLength && (
          <p className="text-sm text-gray-500 ml-auto" data-testid="textarea-char-count">
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

Textarea.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func
};

export default Textarea;
