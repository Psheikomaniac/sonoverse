'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import Textarea from '../../../components/Textarea';

// Form steps
const STEPS = {
  BASIC_INFO: 0,
  MUSIC_DETAILS: 1,
  LYRICS: 2,
  REVIEW: 3,
};

// Genre options
const GENRE_OPTIONS = [
  { value: '', label: 'Bitte wählen' },
  { value: 'Pop', label: 'Pop' },
  { value: 'Rock', label: 'Rock' },
  { value: 'Jazz', label: 'Jazz' },
  { value: 'Classical', label: 'Klassik' },
  { value: 'Folk', label: 'Folk' },
  { value: 'Electronic', label: 'Elektronisch' },
  { value: 'Hip-Hop', label: 'Hip-Hop' },
  { value: 'R&B', label: 'R&B' },
  { value: 'Country', label: 'Country' },
];

// Tempo options
const TEMPO_OPTIONS = [
  { value: '', label: 'Bitte wählen' },
  { value: 'Slow', label: 'Langsam' },
  { value: 'Medium', label: 'Mittel' },
  { value: 'Fast', label: 'Schnell' },
  { value: 'Very Fast', label: 'Sehr schnell' },
];

// Mood options
const MOOD_OPTIONS = [
  { value: '', label: 'Bitte wählen' },
  { value: 'Happy', label: 'Fröhlich' },
  { value: 'Sad', label: 'Traurig' },
  { value: 'Energetic', label: 'Energetisch' },
  { value: 'Calm', label: 'Ruhig' },
  { value: 'Romantic', label: 'Romantisch' },
  { value: 'Angry', label: 'Wütend' },
  { value: 'Nostalgic', label: 'Nostalgisch' },
];

export default function NewRequest() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(STEPS.BASIC_INFO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    description: '',
    tempo: '',
    mood: '',
    reference: '',
    lyrics: '',
  });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === STEPS.BASIC_INFO) {
      if (!formData.title.trim()) newErrors.title = 'Titel ist erforderlich';
      if (!formData.genre) newErrors.genre = 'Genre ist erforderlich';
      if (!formData.description.trim()) newErrors.description = 'Beschreibung ist erforderlich';
    } else if (currentStep === STEPS.MUSIC_DETAILS) {
      if (!formData.tempo) newErrors.tempo = 'Tempo ist erforderlich';
      if (!formData.mood) newErrors.mood = 'Stimmung ist erforderlich';
    } else if (currentStep === STEPS.LYRICS) {
      if (!formData.lyrics.trim()) newErrors.lyrics = 'Songtext ist erforderlich';
      else if (formData.lyrics.trim().length < 50) newErrors.lyrics = 'Songtext sollte mindestens 50 Zeichen lang sein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateStep()) {
      setIsSubmitting(true);
      
      try {
        // In a real app, this would be an API call to create the request
        // Example: await fetch('/api/requests', { method: 'POST', body: JSON.stringify(formData) })
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to dashboard after successful submission
        router.push('/dashboard');
      } catch (error) {
        console.error('Error submitting request:', error);
        setIsSubmitting(false);
      }
    }
  };

  // Render progress bar
  const renderProgressBar = () => {
    const progress = ((currentStep + 1) / (Object.keys(STEPS).length)) * 100;
    
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Schritt {currentStep + 1} von {Object.keys(STEPS).length}</span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.BASIC_INFO:
        return (
          <Card title="Grundlegende Informationen">
            <div className="space-y-4">
              <Input
                label="Titel der Anfrage"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                required
              />
              
              <Select
                label="Genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                options={GENRE_OPTIONS}
                error={errors.genre}
                required
              />
              
              <Textarea
                label="Beschreibung"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Beschreiben Sie Ihre Anfrage..."
                rows={4}
                error={errors.description}
                required
              />
            </div>
          </Card>
        );
        
      case STEPS.MUSIC_DETAILS:
        return (
          <Card title="Musik-Details">
            <div className="space-y-4">
              <Select
                label="Tempo"
                name="tempo"
                value={formData.tempo}
                onChange={handleChange}
                options={TEMPO_OPTIONS}
                error={errors.tempo}
                required
              />
              
              <Select
                label="Stimmung"
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                options={MOOD_OPTIONS}
                error={errors.mood}
                required
              />
              
              <Textarea
                label="Referenz (optional)"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Ähnlich wie... (Künstler, Song, Stil)"
                rows={3}
                error={errors.reference}
              />
            </div>
          </Card>
        );
        
      case STEPS.LYRICS:
        return (
          <Card title="Songtext">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                Geben Sie hier Ihren Songtext ein. Sie können die Struktur mit Bezeichnungen wie "Verse 1:", "Chorus:", etc. kennzeichnen.
              </p>
              
              <Textarea
                label="Songtext"
                name="lyrics"
                value={formData.lyrics}
                onChange={handleChange}
                placeholder="Verse 1:\nHier kommt Ihr Songtext...\n\nChorus:\nDer Refrain..."
                rows={15}
                error={errors.lyrics}
                required
              />
            </div>
          </Card>
        );
        
      case STEPS.REVIEW:
        return (
          <Card title="Überprüfung">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Grundlegende Informationen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Titel</p>
                    <p className="font-medium">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Genre</p>
                    <p className="font-medium">{formData.genre}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Beschreibung</p>
                    <p className="font-medium">{formData.description}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Musik-Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tempo</p>
                    <p className="font-medium">{formData.tempo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stimmung</p>
                    <p className="font-medium">{formData.mood}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Referenz</p>
                    <p className="font-medium">{formData.reference || 'Keine Angabe'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Songtext</h3>
                <pre className="whitespace-pre-wrap font-sans bg-gray-50 p-4 rounded-lg">
                  {formData.lyrics}
                </pre>
              </div>
            </div>
          </Card>
        );
        
      default:
        return null;
    }
  };

  // Render navigation buttons
  const renderNavigation = () => {
    return (
      <div className="flex justify-between mt-6">
        {currentStep > 0 ? (
          <Button 
            onClick={handlePrevious} 
            variant="outline"
            disabled={isSubmitting}
          >
            Zurück
          </Button>
        ) : (
          <Button 
            onClick={() => router.push('/')} 
            variant="outline"
            disabled={isSubmitting}
          >
            Abbrechen
          </Button>
        )}
        
        {currentStep < STEPS.REVIEW ? (
          <Button 
            onClick={handleNext} 
            variant="primary"
            disabled={isSubmitting}
          >
            Weiter
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Wird gesendet...' : 'Anfrage senden'}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Neue Musikanfrage erstellen</h1>
        
        {renderProgressBar()}
        {renderStepContent()}
        {renderNavigation()}
      </div>
    </Layout>
  );
}