'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Select from '../../components/Select';
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
  },
  {
    id: '2',
    title: 'Winterblues',
    genre: 'Jazz',
    status: 'in_progress',
    createdAt: '2023-07-05T09:15:00Z',
    updatedAt: '2023-07-10T11:20:00Z',
  },
  {
    id: '3',
    title: 'Herbstmelodie',
    genre: 'Folk',
    status: 'received',
    createdAt: '2023-07-20T16:45:00Z',
    updatedAt: '2023-07-20T16:45:00Z',
  },
  {
    id: '4',
    title: 'Frühlingserwachen',
    genre: 'Classical',
    status: 'writing',
    createdAt: '2023-08-01T13:10:00Z',
    updatedAt: '2023-08-05T10:30:00Z',
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
];

export default function Dashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [sortOption, setSortOption] = useState('createdAt_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch requests (mock for now)
  useEffect(() => {
    // In a real app, this would be an API call
    setRequests(MOCK_REQUESTS);
  }, []);

  // Apply filters and sorting
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
  }, [requests, statusFilter, genreFilter, sortOption, currentPage]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Meine Musikanfragen</h1>
          <Button 
            onClick={() => router.push('/request/new')}
            variant="primary"
          >
            Neue Anfrage
          </Button>
        </div>
        
        {/* Filters and sorting */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Status Filter"
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Select
              label="Genre Filter"
              options={GENRE_OPTIONS}
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            />
            <Select
              label="Sortierung"
              options={SORT_OPTIONS}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            />
          </div>
        </div>
        
        {/* Requests list */}
        {filteredRequests.length === 0 ? (
          <Card>
            <p className="text-center py-8 text-gray-500">
              Keine Anfragen gefunden. Erstellen Sie eine neue Anfrage, um loszulegen.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{request.title}</h2>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                        {request.genre}
                      </span>
                      <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                        Erstellt: {formatDate(request.createdAt)}
                      </span>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Button
                      onClick={() => router.push(`/request/${request.id}`)}
                      variant="secondary"
                    >
                      Details anzeigen
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
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
      </div>
    </Layout>
  );
}