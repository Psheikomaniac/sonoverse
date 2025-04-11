import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  title,
  children,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  elevation = 'md',
  onClick
}) => {
  const baseCardClasses = 'bg-white rounded-lg overflow-hidden transition-shadow';
  
  const elevationClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };
  
  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-transform' : '';
  
  const cardClasses = `${baseCardClasses} ${elevationClasses[elevation]} ${clickableClasses} ${className}`;

  return (
    <div 
      className={cardClasses} 
      onClick={onClick} 
      data-testid="card"
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {title && (
        <div 
          className={`px-6 py-4 border-b border-gray-200 font-medium text-lg ${headerClassName}`}
          data-testid="card-header"
        >
          {title}
        </div>
      )}
      <div 
        className={`px-6 py-4 ${bodyClassName}`}
        data-testid="card-body"
      >
        {children}
      </div>
      {footer && (
        <div 
          className={`px-6 py-3 bg-gray-50 border-t border-gray-200 ${footerClassName}`}
          data-testid="card-footer"
        >
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  elevation: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  onClick: PropTypes.func
};

export default Card;
