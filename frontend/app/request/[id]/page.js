'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import StatusBadge from '../../../components/StatusBadge';
import AudioPlayer from '../../../components/AudioPlayer';
import Textarea from '../../../components/Textarea';

// Mock data for development - will be replaced with API calls
const MOCK_REQUEST = {
  id: '1',
  title: 'Sommerlied',
  genre: 'Pop',
  status: 'completed',
  createdAt: '2023-06-15T10:30:00Z',
  updatedAt: '2023-06-20T14:45:00Z',
  description: 'Ein fröhliches Lied über den Sommer und die Freude am Leben.',
  tempo: 'Medium',
  mood: 'Happy',
  reference: 'Ähnlich wie "Walking on Sunshine" von Katrina and the Waves',
  lyrics: `Verse 1:
Die Sonne scheint, der Himmel blau,
Die Welt erstrahlt in hellem Tau.
Der Sommer ist nun endlich da,
Mit Freude und mit Gloria.

Chorus:
Oh Sommertag, oh Sommernacht,
Du hast die Freude mir gebracht.
Ich tanze durch den goldnen Schein,
Und lass die Sorgen kleiner sein.

Verse 2:
Die Vögel singen froh ihr Lied,
Der Winter ist schon lang vorbei.
Die Blumen blühen überall,
Mit Farben wie ein Feuerball.

Chorus:
Oh Sommertag, oh Sommernacht,
Du hast die Freude mir gebracht.
Ich tanze durch den goldnen Schein,
Und lass die Sorgen kleiner sein.

Bridge:
Und wenn die Nacht hereinbricht,
Verlischt das Sonnenlicht nicht.
Es lebt in meinem Herzen weiter,
Macht meine Seele froh und heiter.

Chorus:
Oh Sommertag, oh Sommernacht,
Du hast die Freude mir gebracht.
Ich tanze durch den goldnen Schein,
Und lass die Sorgen kleiner sein.`,
  statusHistory: [
    { status: 'received', timestamp: '2023-06-15T10:30:00Z' },
    { status: 'writing', timestamp: '2023-06-16T09:45:00Z' },
    { status: 'recording', timestamp: '2023-06-18T14:20:00Z' },
    { status: 'mixing', timestamp: '2023-06-19T11:30:00Z' },
    { status: 'completed', timestamp: '2023-06-20T14:45:00Z' },
  ],
  audioUrl: '/mock-audio/sommerlied.mp3', // This would be a real URL in production
};

export default function RequestDetail({ params }) {
  const router = useRouter();
  const { id } = params;
  const [request, setRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLyrics, setEditedLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch request data
  useEffect(() => {
    // In a real app, this would be an API call
    // Example: fetch(`/api/requests/${id}`).then(...)
    setTimeout(() => {
      setRequest(MOCK_REQUEST);
      setEditedLyrics(MOCK_REQUEST.lyrics);
      setIsLoading(false);
    }, 500); // Simulate loading
  }, [id]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEditLyrics = () => {
    setIsEditing(true);
  };

  const handleSaveLyrics = () => {
    // In a real app, this would be an API call to update the lyrics
    // Example: fetch(`/api/requests/${id}/lyrics`, { method: 'PUT', body: JSON.stringify({ lyrics: editedLyrics }) })
    setRequest(prev => ({ ...prev, lyrics: editedLyrics }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedLyrics(request.lyrics);
    setIsEditing(false);
  };

  const handleDownload = () => {
    // In a real app, this would trigger a download of the audio file
    alert('Download würde hier starten. In der echten App würde die Audiodatei heruntergeladen werden.');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">Lade Anfrage...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !request) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-red-500 mb-4">Fehler beim Laden der Anfrage</h2>
              <p className="mb-4">{error || 'Die Anfrage konnte nicht gefunden werden.'}</p>
              <Button onClick={() => router.push('/dashboard')} variant="primary">
                Zurück zum Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{request.title}</h1>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            Zurück zum Dashboard
          </Button>
        </div>

        {/* Request details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card title="Anfrage-Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Genre</p>
                  <p className="font-medium">{request.genre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <StatusBadge status={request.status} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Erstellt am</p>
                  <p className="font-medium">{formatDate(request.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Zuletzt aktualisiert</p>
                  <p className="font-medium">{formatDate(request.updatedAt)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Beschreibung</p>
                  <p className="font-medium">{request.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tempo</p>
                  <p className="font-medium">{request.tempo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stimmung</p>
                  <p className="font-medium">{request.mood}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Referenz</p>
                  <p className="font-medium">{request.reference}</p>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card title="Status-Verlauf">
              <div className="space-y-3">
                {request.statusHistory.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-2"></div>
                    <div>
                      <StatusBadge status={item.status} />
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(item.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Lyrics section */}
        <Card title="Songtext" className="mb-6">
          <div className="mb-4">
            {isEditing ? (
              <div>
                <Textarea
                  value={editedLyrics}
                  onChange={(e) => setEditedLyrics(e.target.value)}
                  rows={15}
                  className="font-mono"
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <Button onClick={handleCancelEdit} variant="outline">
                    Abbrechen
                  </Button>
                  <Button onClick={handleSaveLyrics} variant="primary">
                    Speichern
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <pre className="whitespace-pre-wrap font-sans bg-gray-50 p-4 rounded-lg">
                  {request.lyrics}
                </pre>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleEditLyrics} variant="secondary">
                    Songtext bearbeiten
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Audio player section - only shown for completed requests */}
        {request.status === 'completed' && (
          <Card title="Fertige Aufnahme" className="mb-6">
            <div className="mb-4">
              <AudioPlayer src={request.audioUrl} />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleDownload} variant="primary">
                Audiodatei herunterladen
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}