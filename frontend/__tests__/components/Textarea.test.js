import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Textarea from '../../components/Textarea';

describe('Textarea Component', () => {
  const defaultProps = {
    id: 'test-textarea',
    name: 'test-textarea',
    value: '',
    onChange: jest.fn()
  };

  test('renders textarea correctly with default props', () => {
    render(<Textarea {...defaultProps} />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('id', 'test-textarea');
    expect(textarea).toHaveAttribute('name', 'test-textarea');
    expect(textarea).toHaveAttribute('rows', '4'); // Default rows
  });

  test('renders with label when provided', () => {
    render(<Textarea {...defaultProps} label="Test Label" />);
    
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-textarea');
  });

  test('shows required indicator when required is true', () => {
    render(<Textarea {...defaultProps} label="Required Field" required />);
    
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('text-red-500');
  });

  test('renders error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<Textarea {...defaultProps} error={errorMessage} />);
    
    const errorElement = screen.getByTestId('textarea-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass('border-red-500');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby', 'test-textarea-error');
  });

  test('displays character count when maxLength is provided', () => {
    render(<Textarea {...defaultProps} value="Test value" maxLength={100} />);
    
    const charCount = screen.getByTestId('textarea-char-count');
    expect(charCount).toBeInTheDocument();
    expect(charCount).toHaveTextContent('10/100'); // "Test value" has 10 characters
  });

  test('updates character count when text changes', () => {
    const { rerender } = render(<Textarea {...defaultProps} value="" maxLength={100} />);
    
    let charCount = screen.getByTestId('textarea-char-count');
    expect(charCount).toHaveTextContent('0/100');
    
    const textarea = screen.getByTestId('textarea');
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    
    // Since we're using a mock onChange, we need to rerender with the new value
    rerender(<Textarea {...defaultProps} value="Hello world" maxLength={100} />);
    charCount = screen.getByTestId('textarea-char-count');
    expect(charCount).toHaveTextContent('11/100'); // "Hello world" has 11 characters
  });

  test('applies disabled styles when disabled prop is true', () => {
    render(<Textarea {...defaultProps} disabled />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('bg-gray-100');
    expect(textarea).toHaveClass('cursor-not-allowed');
  });

  test('handles onChange event', () => {
    const handleChange = jest.fn();
    render(<Textarea {...defaultProps} onChange={handleChange} />);
    
    const textarea = screen.getByTestId('textarea');
    fireEvent.change(textarea, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('handles onBlur event', () => {
    const handleBlur = jest.fn();
    render(<Textarea {...defaultProps} onBlur={handleBlur} />);
    
    const textarea = screen.getByTestId('textarea');
    fireEvent.blur(textarea);
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('handles onFocus event', () => {
    const handleFocus = jest.fn();
    render(<Textarea {...defaultProps} onFocus={handleFocus} />);
    
    const textarea = screen.getByTestId('textarea');
    fireEvent.focus(textarea);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  test('applies custom rows when specified', () => {
    render(<Textarea {...defaultProps} rows={8} />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('rows', '8');
  });

  test('applies custom className', () => {
    render(<Textarea {...defaultProps} className="custom-class" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass('custom-class');
  });
});
