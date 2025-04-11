import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../../components/StatusBadge';

describe('StatusBadge Component', () => {
  test('renders status badge correctly with default props', () => {
    render(<StatusBadge status="success" />);
    
    const badge = screen.getByTestId('status-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('success');
    expect(badge).toHaveAttribute('data-status', 'success');
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
    
    // Dot should be visible by default
    const dot = screen.getByTestId('status-dot');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass('bg-green-500');
  });

  test('renders badge with custom text when provided', () => {
    render(<StatusBadge status="error" text="Failed" />);
    
    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveTextContent('Failed');
    expect(badge).toHaveAttribute('data-status', 'error');
    expect(badge).toHaveClass('bg-red-100');
    expect(badge).toHaveClass('text-red-800');
  });

  test('renders different status colors based on status prop', () => {
    const { rerender } = render(<StatusBadge status="success" />);
    
    let badge = screen.getByTestId('status-badge');
    let dot = screen.getByTestId('status-dot');
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
    expect(dot).toHaveClass('bg-green-500');
    
    rerender(<StatusBadge status="warning" />);
    badge = screen.getByTestId('status-badge');
    dot = screen.getByTestId('status-dot');
    expect(badge).toHaveClass('bg-yellow-100');
    expect(badge).toHaveClass('text-yellow-800');
    expect(dot).toHaveClass('bg-yellow-500');
    
    rerender(<StatusBadge status="error" />);
    badge = screen.getByTestId('status-badge');
    dot = screen.getByTestId('status-dot');
    expect(badge).toHaveClass('bg-red-100');
    expect(badge).toHaveClass('text-red-800');
    expect(dot).toHaveClass('bg-red-500');
    
    rerender(<StatusBadge status="info" />);
    badge = screen.getByTestId('status-badge');
    dot = screen.getByTestId('status-dot');
    expect(badge).toHaveClass('bg-blue-100');
    expect(badge).toHaveClass('text-blue-800');
    expect(dot).toHaveClass('bg-blue-500');
    
    rerender(<StatusBadge status="pending" />);
    badge = screen.getByTestId('status-badge');
    dot = screen.getByTestId('status-dot');
    expect(badge).toHaveClass('bg-gray-100');
    expect(badge).toHaveClass('text-gray-800');
    expect(dot).toHaveClass('bg-gray-500');
  });

  test('applies different size classes', () => {
    const { rerender } = render(<StatusBadge status="success" size="sm" />);
    
    let badge = screen.getByTestId('status-badge');
    expect(badge).toHaveClass('text-xs');
    expect(badge).toHaveClass('py-0.5');
    expect(badge).toHaveClass('px-2');
    
    rerender(<StatusBadge status="success" size="md" />);
    badge = screen.getByTestId('status-badge');
    expect(badge).toHaveClass('text-sm');
    expect(badge).toHaveClass('py-1');
    expect(badge).toHaveClass('px-3');
    
    rerender(<StatusBadge status="success" size="lg" />);
    badge = screen.getByTestId('status-badge');
    expect(badge).toHaveClass('text-base');
    expect(badge).toHaveClass('py-1.5');
    expect(badge).toHaveClass('px-4');
  });

  test('does not render dot when withDot is false', () => {
    render(<StatusBadge status="success" withDot={false} />);
    
    expect(screen.queryByTestId('status-dot')).not.toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<StatusBadge status="success" className="custom-badge" />);
    
    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveClass('custom-badge');
  });

  test('defaults to info style for unknown status', () => {
    // @ts-ignore - Testing invalid prop
    render(<StatusBadge status="unknown-status" />);
    
    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveClass('bg-blue-100');
    expect(badge).toHaveClass('text-blue-800');
    
    const dot = screen.getByTestId('status-dot');
    expect(dot).toHaveClass('bg-blue-500');
  });
});
