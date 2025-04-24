import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../../app/dashboard/page';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the components used in Dashboard
jest.mock('../../components/Layout', () => {
  return function MockLayout({ children }) {
    return <div data-testid="mock-layout">{children}</div>;
  };
});

jest.mock('../../components/Card', () => {
  return function MockCard({ children, title }) {
    return (
      <div data-testid="mock-card">
        {title && <div data-testid="card-title">{title}</div>}
        {children}
      </div>
    );
  };
});

jest.mock('../../components/Button', () => {
  return function MockButton({ children, onClick, variant, disabled }) {
    return (
      <button 
        data-testid="mock-button"
        data-variant={variant}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };
});

jest.mock('../../components/Select', () => {
  return function MockSelect({ label, options, value, onChange }) {
    return (
      <div data-testid="mock-select">
        <label>{label}</label>
        <select value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

jest.mock('../../components/StatusBadge', () => {
  return function MockStatusBadge({ status }) {
    return <span data-testid="mock-status-badge">{status}</span>;
  };
});

describe('Dashboard Page', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the dashboard page with title', () => {
    render(<Dashboard />);
    
    // Check if the title is rendered
    expect(screen.getByText('Meine Musikanfragen')).toBeInTheDocument();
  });

  it('renders the "Neue Anfrage" button', () => {
    render(<Dashboard />);
    
    // Check if the button is rendered
    const newRequestButton = screen.getByText('Neue Anfrage');
    expect(newRequestButton).toBeInTheDocument();
  });

  it('renders filter and sort options', () => {
    render(<Dashboard />);
    
    // Check if filter and sort options are rendered
    const statusFilter = screen.getByText('Status Filter');
    const genreFilter = screen.getByText('Genre Filter');
    const sortOption = screen.getByText('Sortierung');
    
    expect(statusFilter).toBeInTheDocument();
    expect(genreFilter).toBeInTheDocument();
    expect(sortOption).toBeInTheDocument();
  });

  it('displays mock requests after loading', async () => {
    render(<Dashboard />);
    
    // Wait for the mock data to be loaded
    await waitFor(() => {
      // Check if at least one request title is rendered
      expect(screen.getByText('Sommerlied')).toBeInTheDocument();
    });
    
    // Check if other request titles are rendered
    expect(screen.getByText('Winterblues')).toBeInTheDocument();
    expect(screen.getByText('Herbstmelodie')).toBeInTheDocument();
    expect(screen.getByText('Frühlingserwachen')).toBeInTheDocument();
  });

  it('displays status badges for each request', async () => {
    render(<Dashboard />);
    
    // Wait for the mock data to be loaded
    await waitFor(() => {
      // Check if status badges are rendered
      const statusBadges = screen.getAllByTestId('mock-status-badge');
      expect(statusBadges.length).toBeGreaterThan(0);
    });
  });

  it('displays "Details anzeigen" buttons for each request', async () => {
    render(<Dashboard />);
    
    // Wait for the mock data to be loaded
    await waitFor(() => {
      // Check if "Details anzeigen" buttons are rendered
      const detailButtons = screen.getAllByText('Details anzeigen');
      expect(detailButtons.length).toBeGreaterThan(0);
    });
  });

  it('displays a message when no requests are found', async () => {
    // Mock the useState to return empty requests
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [[], jest.fn()]);
    
    render(<Dashboard />);
    
    // Check if the "no requests" message is rendered
    expect(screen.getByText('Keine Anfragen gefunden. Erstellen Sie eine neue Anfrage, um loszulegen.')).toBeInTheDocument();
  });
});