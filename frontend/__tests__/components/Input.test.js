import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../components/Input';

describe('Input Component', () => {
  const defaultProps = {
    id: 'test-input',
    name: 'test-input',
    value: '',
    onChange: jest.fn()
  };

  test('renders input field correctly with default props', () => {
    render(<Input {...defaultProps} />);
    
    const input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'test-input');
  });

  test('renders with label when provided', () => {
    render(<Input {...defaultProps} label="Test Label" />);
    
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-input');
  });

  test('shows required indicator when required is true', () => {
    render(<Input {...defaultProps} label="Required Field" required />);
    
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('text-red-500');
  });

  test('renders error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<Input {...defaultProps} error={errorMessage} />);
    
    const errorElement = screen.getByTestId('input-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('border-red-500');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
  });

  test('applies disabled styles when disabled prop is true', () => {
    render(<Input {...defaultProps} disabled />);
    
    const input = screen.getByTestId('input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('bg-gray-100');
    expect(input).toHaveClass('cursor-not-allowed');
  });

  test('handles onChange event', () => {
    const handleChange = jest.fn();
    render(<Input {...defaultProps} onChange={handleChange} />);
    
    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('handles onBlur event', () => {
    const handleBlur = jest.fn();
    render(<Input {...defaultProps} onBlur={handleBlur} />);
    
    const input = screen.getByTestId('input');
    fireEvent.blur(input);
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('handles onFocus event', () => {
    const handleFocus = jest.fn();
    render(<Input {...defaultProps} onFocus={handleFocus} />);
    
    const input = screen.getByTestId('input');
    fireEvent.focus(input);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  test('renders different input types', () => {
    const { rerender } = render(<Input {...defaultProps} type="email" />);
    
    let input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'email');
    
    rerender(<Input {...defaultProps} type="password" />);
    input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'password');
    
    rerender(<Input {...defaultProps} type="number" />);
    input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'number');
  });

  test('applies custom className', () => {
    render(<Input {...defaultProps} className="custom-class" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('custom-class');
  });
});
