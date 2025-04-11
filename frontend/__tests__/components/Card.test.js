import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../../components/Card';

describe('Card Component', () => {
  const defaultProps = {
    children: <p>Test content</p>
  };

  test('renders card with content correctly', () => {
    render(<Card {...defaultProps} />);
    
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    
    const cardBody = screen.getByTestId('card-body');
    expect(cardBody).toBeInTheDocument();
    expect(cardBody).toHaveTextContent('Test content');
  });

  test('renders card with title when provided', () => {
    render(<Card {...defaultProps} title="Test Title" />);
    
    const header = screen.getByTestId('card-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Test Title');
  });

  test('does not render header when no title is provided', () => {
    render(<Card {...defaultProps} />);
    
    expect(screen.queryByTestId('card-header')).not.toBeInTheDocument();
  });

  test('renders footer when provided', () => {
    render(<Card {...defaultProps} footer={<button>Action</button>} />);
    
    const footer = screen.getByTestId('card-footer');
    expect(footer).toBeInTheDocument();
    expect(footer.querySelector('button')).toHaveTextContent('Action');
  });

  test('does not render footer when not provided', () => {
    render(<Card {...defaultProps} />);
    
    expect(screen.queryByTestId('card-footer')).not.toBeInTheDocument();
  });

  test('applies different elevation styles', () => {
    const { rerender } = render(<Card {...defaultProps} elevation="sm" />);
    
    let card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow-sm');
    
    rerender(<Card {...defaultProps} elevation="md" />);
    card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow-md');
    
    rerender(<Card {...defaultProps} elevation="lg" />);
    card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow-lg');
    
    rerender(<Card {...defaultProps} elevation="xl" />);
    card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow-xl');
    
    rerender(<Card {...defaultProps} elevation="none" />);
    card = screen.getByTestId('card');
    expect(card).not.toHaveClass('shadow-sm');
    expect(card).not.toHaveClass('shadow-md');
    expect(card).not.toHaveClass('shadow-lg');
    expect(card).not.toHaveClass('shadow-xl');
  });

  test('applies clickable styles when onClick is provided', () => {
    render(<Card {...defaultProps} onClick={() => {}} />);
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('cursor-pointer');
    expect(card).toHaveClass('hover:shadow-lg');
    expect(card).toHaveClass('transform');
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Card {...defaultProps} onClick={handleClick} />);
    
    const card = screen.getByTestId('card');
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies custom className to all sections', () => {
    render(
      <Card 
        {...defaultProps}
        title="Title"
        footer="Footer"
        className="custom-card"
        headerClassName="custom-header"
        bodyClassName="custom-body"
        footerClassName="custom-footer"
      />
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-card');
    
    const header = screen.getByTestId('card-header');
    expect(header).toHaveClass('custom-header');
    
    const body = screen.getByTestId('card-body');
    expect(body).toHaveClass('custom-body');
    
    const footer = screen.getByTestId('card-footer');
    expect(footer).toHaveClass('custom-footer');
  });
});
