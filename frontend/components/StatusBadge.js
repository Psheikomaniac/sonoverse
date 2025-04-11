import React from 'react';
import PropTypes from 'prop-types';

const StatusBadge = ({
  status,
  text,
  size = 'md',
  className = '',
  withDot = true
}) => {
  // If text is provided, use it instead of the status
  const displayText = text || status;
  
  // Define color variants based on status
  const statusColors = {
    success: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      dot: 'bg-green-500'
    },
    warning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      dot: 'bg-yellow-500'
    },
    error: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      dot: 'bg-red-500'
    },
    info: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      dot: 'bg-blue-500'
    },
    pending: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      dot: 'bg-gray-500'
    }
  };

  // Default to "info" if status isn't in our predefined list
  const colorScheme = statusColors[status] || statusColors.info;
  
  // Size variants
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-3',
    lg: 'text-base py-1.5 px-4'
  };

  return (
    <span 
      className={`
        inline-flex items-center rounded-full
        ${colorScheme.bg} ${colorScheme.text} ${sizeClasses[size]} ${className}
      `}
      data-testid="status-badge"
      data-status={status}
    >
      {withDot && (
        <span 
          className={`w-2 h-2 mr-1.5 rounded-full ${colorScheme.dot}`}
          data-testid="status-dot"
        ></span>
      )}
      {displayText}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'pending']).isRequired,
  text: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  withDot: PropTypes.bool
};

export default StatusBadge;
