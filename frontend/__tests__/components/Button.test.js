import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/Button';

describe('Button Component', () => {
  test('renders button with default props', () => {
    render(<Button>Click Me</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click Me');
    expect(button).toHaveAttribute('type', 'button');
    expect(button.classList.contains('bg-blue-600')).toBe(true); // primary variant
  });

  test('renders button with different variants', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    
    let button = screen.getByTestId('button');
    expect(button.classList.contains('bg-gray-200')).toBe(true);
    
    rerender(<Button variant="danger">Danger</Button>);
    button = screen.getByTestId('button');
    expect(button.classList.contains('bg-red-600')).toBe(true);
    
    rerender(<Button variant="success">Success</Button>);
    button = screen.getByTestId('button');
    expect(button.classList.contains('bg-green-600')).toBe(true);
    
    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByTestId('button');
    expect(button.classList.contains('bg-transparent')).toBe(true);
    expect(button.classList.contains('border')).toBe(true);
  });

  test('renders button with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    
    let button = screen.getByTestId('button');
    expect(button.classList.contains('text-sm')).toBe(true);
    
    rerender(<Button size="md">Medium</Button>);
    button = screen.getByTestId('button');
    expect(button.classList.contains('text-base')).toBe(true);
    
    rerender(<Button size="lg">Large</Button>);
    button = screen.getByTestId('button');
    expect(button.classList.contains('text-lg')).toBe(true);
  });

  test('renders disabled button', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toBeDisabled();
    expect(button.classList.contains('opacity-50')).toBe(true);
    expect(button.classList.contains('cursor-not-allowed')).toBe(true);
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const button = screen.getByTestId('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not trigger click when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Click Me</Button>);
    
    const button = screen.getByTestId('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByTestId('button');
    expect(button.classList.contains('custom-class')).toBe(true);
  });

  test('renders as submit type button', () => {
    render(<Button type="submit">Submit</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
