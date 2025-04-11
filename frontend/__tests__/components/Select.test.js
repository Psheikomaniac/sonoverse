import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from '../../components/Select';

describe('Select Component', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  const defaultProps = {
    id: 'test-select',
    name: 'test-select',
    value: '',
    options: defaultOptions,
    onChange: jest.fn()
  };

  test('renders select element correctly with default props', () => {
    render(<Select {...defaultProps} />);
    
    const select = screen.getByTestId('select');
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('id', 'test-select');
    expect(select).toHaveAttribute('name', 'test-select');
    
    const options = screen.getAllByTestId('select-option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Option 1');
  });

  test('renders with label when provided', () => {
    render(<Select {...defaultProps} label="Test Label" />);
    
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-select');
  });

  test('shows required indicator when required is true', () => {
    render(<Select {...defaultProps} label="Required Field" required />);
    
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('text-red-500');
  });

  test('renders placeholder option when placeholder is provided', () => {
    render(<Select {...defaultProps} placeholder="Select an option" />);
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4); // 3 regular options + placeholder
    expect(options[0]).toHaveTextContent('Select an option');
    expect(options[0]).toHaveAttribute('disabled');
  });

  test('renders error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<Select {...defaultProps} error={errorMessage} />);
    
    const errorElement = screen.getByTestId('select-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
    
    const select = screen.getByTestId('select');
    expect(select).toHaveClass('border-red-500');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAttribute('aria-describedby', 'test-select-error');
  });

  test('applies disabled styles when disabled prop is true', () => {
    render(<Select {...defaultProps} disabled />);
    
    const select = screen.getByTestId('select');
    expect(select).toBeDisabled();
    expect(select).toHaveClass('bg-gray-100');
    expect(select).toHaveClass('cursor-not-allowed');
  });

  test('handles onChange event', () => {
    const handleChange = jest.fn();
    render(<Select {...defaultProps} onChange={handleChange} />);
    
    const select = screen.getByTestId('select');
    fireEvent.change(select, { target: { value: 'option2' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('handles onBlur event', () => {
    const handleBlur = jest.fn();
    render(<Select {...defaultProps} onBlur={handleBlur} />);
    
    const select = screen.getByTestId('select');
    fireEvent.blur(select);
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('handles onFocus event', () => {
    const handleFocus = jest.fn();
    render(<Select {...defaultProps} onFocus={handleFocus} />);
    
    const select = screen.getByTestId('select');
    fireEvent.focus(select);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  test('selects correct option when value is specified', () => {
    render(<Select {...defaultProps} value="option2" />);
    
    const select = screen.getByTestId('select');
    expect(select).toHaveValue('option2');
  });

  test('applies custom className', () => {
    render(<Select {...defaultProps} className="custom-class" />);
    
    const select = screen.getByTestId('select');
    expect(select).toHaveClass('custom-class');
  });
});
