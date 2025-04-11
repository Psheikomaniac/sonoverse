import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Card Component for displaying items in lists
 * @param {React.ReactNode} children - Card content
 * @param {boolean} clickable - Whether the card is clickable
 * @param {Function} onClick - Click event handler
 * @param {boolean} hoverable - Whether the card has hover effects
 * @param {string} className - Additional CSS classes to apply
 */
const Card = ({ 
  children, 
  clickable = false, 
  onClick,
  hoverable = true,
  className = "" 
}) => {
  const baseStyles = "bg-white rounded-lg shadow-md p-4 mb-4";
  const hoverStyles = hoverable ? "transition-shadow duration-300 hover:shadow-lg" : "";
  const clickableStyles = clickable ? "cursor-pointer" : "";

  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={clickable && onClick ? onClick : undefined}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  hoverable: PropTypes.bool,
  className: PropTypes.string,
};

export default Card;
