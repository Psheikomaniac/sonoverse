'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Input from '../../components/Input';
import StatusBadge from '../../components/StatusBadge';

// Mock data for development - will be replaced with API calls
const MOCK_REQUESTS = [
  {
    id: '1',
    title: 'Sommerlied',
    genre: 'Pop',
    status: 'completed',
    createdAt: '2023-06-15T10:30:00Z',
    updatedAt: '2023-06-20T14:45:00Z',
    user: 'Max Mustermann',
  },
  {
    id: '2',
    title: 'Winterblues',
    genre: 'Jazz',
    status: 'in_progress',
    createdAt: '2023-07-05T09:15:00Z',
    updatedAt: '2023-07-10T11:20:00Z',
    user: 'Anna Schmidt',
  },
  {
    id: '3',
    title: 'Herbstmelodie',
    genre: 'Folk',
    status: 'received',
    createdAt: '2023-07-20T16:45:00Z',
    updatedAt: '2023-07-20T16:45:00Z',
    user: 'Lisa Weber',
  },
  {
    id: '4',
    title: 'Frühlingserwachen',
    genre: 'Classical',
    status: 'writing',
    createdAt: '2023-08-01T13:10:00Z',
    updatedAt: '2023-08-05T10:30:00Z',
    user: 'Thomas Becker',
  },
  {
    id: '5',
    title: 'Stadtlichter',
    genre: 'Electronic',
    status: 'mixing',
    createdAt: '2023-08-10T15:20:00Z',
    updatedAt: '2023-08-15T09:45:00Z',
    user: 'Sarah Müller',
  },
];

// Filter and sort options
const STATUS_OPTIONS = [
  { value: '', label: 'Alle Status' },
  { value: 'received', label: 'Empfangen' },
  { value: 'writing', label: 'In Bearbeitung (Text)' },
  { value: 'recording', label: 'In Aufnahme' },
  { value: 'mixing', label: 'Mixing' },
  { value: 'completed', label: 'Abgeschlossen' },
];

const GENRE_OPTIONS = [
  { value: '', label: 'Alle Genres' },
  { value: 'Pop', label: 'Pop' },
  { value: 'Rock', label: 'Rock' },
  { value: 'Jazz', label: 'Jazz' },
  { value: 'Classical', label: 'Klassik' },
  { value: 'Folk', label: 'Folk' },
  { value: 'Electronic', label: 'Elektronisch' },
];

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Neueste zuerst' },
  { value: 'createdAt_asc', label: 'Älteste zuerst' },
  { value: 'title_asc', label: 'Titel (A-Z)' },
  { value: 'title_desc', label: 'Titel (Z-A)' },
  { value: 'status_asc', label: 'Status (A-Z)' },
  { value: 'user_asc', label: 'Benutzer (A-Z)' },
];

// Status update options
const STATUS_UPDATE_OPTIONS = [
  { value: 'received', label: 'Empfangen' },
  { value: 'writing', label: 'In Bearbeitung (Text)' },
  { value: 'recording', label: 'In Aufnahme' },
  { value: 'mixing', label: 'Mixing' },
  { value: 'completed', label: 'Abgeschlossen' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('createdAt_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const itemsPerPage = 10;

  // Fetch requests (mock for now)
  useEffect(() => {
    // In a real app, this would be an API call
    setRequests(MOCK_REQUESTS);
  }, []);

  // Apply filters, search, and sorting
  useEffect(() => {
    let result = [...requests];
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(req => req.status === statusFilter);
    }
    
    // Apply genre filter
    if (genreFilter) {
      result = result.filter(req => req.genre === genreFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(req => 
        req.title.toLowerCase().includes(query) || 
        req.user.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    const [sortField, sortDirection] = sortOption.split('_');
    result.sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });
    
    // Calculate pagination
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    
    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedResult = result.slice(startIndex, startIndex + itemsPerPage);
    
    setFilteredRequests(paginatedResult);
  }, [requests, statusFilter, genreFilter, searchQuery, sortOption, currentPage]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Handle request selection
  const handleSelectRequest = (id) => {
    setSelectedRequests(prev => {
      if (prev.includes(id)) {
        return prev.filter(requestId => requestId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle select all requests
  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map(req => req.id));
    }
  };

  // Handle batch status update
  const handleBatchStatusUpdate = async () => {
    if (selectedRequests.length === 0 || !newStatus) return;
    
    setIsUpdatingStatus(true);
    
    try {
      // In a real app, this would be an API call
      // Example: await fetch('/api/requests/batch-update', { method: 'PUT', body: JSON.stringify({ ids: selectedRequests, status: newStatus }) })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setRequests(prev => 
        prev.map(req => 
          selectedRequests.includes(req.id) 
            ? { ...req, status: newStatus, updatedAt: new Date().toISOString() } 
            : req
        )
      );
      
      // Clear selection and status
      setSelectedRequests([]);
      setNewStatus('');
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (requestId) => {
    // In a real app, this would open a file dialog and upload the file
    alert(`Datei-Upload für Anfrage ${requestId} würde hier starten.`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin-Dashboard</h1>
        
        {/* Filters, search, and sorting */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              label="Suche (Titel oder Benutzer)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Suchen..."
            />
            <Select
              label="Status Filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={STATUS_OPTIONS}
            />
            <Select
              label="Genre Filter"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              options={GENRE_OPTIONS}
            />
            <Select
              label="Sortierung"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              options={SORT_OPTIONS}
            />
          </div>
        </Card>
        
        {/* Batch actions */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            <div className="flex-grow">
              <h2 className="text-lg font-semibold mb-2">Batch-Aktionen</h2>
              <p className="text-sm text-gray-600 mb-2">
                Wählen Sie mehrere Anfragen aus und führen Sie Aktionen für alle aus.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Select
                label="Status ändern zu"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={[{ value: '', label: 'Status wählen' }, ...STATUS_UPDATE_OPTIONS]}
                disabled={selectedRequests.length === 0 || isUpdatingStatus}
              />
              <Button
                onClick={handleBatchStatusUpdate}
                variant="primary"
                disabled={selectedRequests.length === 0 || !newStatus || isUpdatingStatus}
                className="mt-2 sm:mt-0"
              >
                {isUpdatingStatus ? 'Wird aktualisiert...' : 'Aktualisieren'}
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Requests table */}
        <Card>
          {filteredRequests.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              Keine Anfragen gefunden.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Benutzer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Genre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Erstellt am
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          checked={selectedRequests.includes(request.id)}
                          onChange={() => handleSelectRequest(request.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{request.user}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{request.genre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(request.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => router.push(`/admin/request/${request.id}`)}
                            variant="outline"
                            size="sm"
                          >
                            Details
                          </Button>
                          <Button
                            onClick={() => handleFileUpload(request.id)}
                            variant="secondary"
                            size="sm"
                            disabled={!['mixing', 'recording'].includes(request.status)}
                          >
                            Audio hochladen
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Zurück
                </Button>
                <span className="px-4 py-2 bg-gray-100 rounded">
                  Seite {currentPage} von {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  Weiter
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}