'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '../components/Button';
import Card from '../components/Card';
import Layout from '../components/Layout';

export default function Home() {
  const router = useRouter();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">SonoVerse Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card title="Neue Anfrage erstellen">
            <p className="mb-4">Erstellen Sie eine neue Musikanfrage mit Songtext und Details.</p>
            <Button 
              onClick={() => router.push('/request/new')}
              variant="primary"
              fullWidth
            >
              Neue Anfrage
            </Button>
          </Card>
          
          <Card title="Meine Anfragen">
            <p className="mb-4">Sehen Sie alle Ihre bestehenden Musikanfragen ein.</p>
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="secondary"
              fullWidth
            >
              Zum Dashboard
            </Button>
          </Card>
          
          <Card title="Admin-Bereich">
            <p className="mb-4">Verwalten Sie alle Anfragen (nur für Administratoren).</p>
            <Button 
              onClick={() => router.push('/admin')}
              variant="outline"
              fullWidth
            >
              Admin-Bereich
            </Button>
          </Card>
        </div>
        
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Willkommen bei SonoVerse</h2>
          <p className="mb-3">
            SonoVerse ist Ihre Plattform für die Erstellung personalisierter Musik basierend auf Ihren Songtexten.
          </p>
          <p>
            Beginnen Sie, indem Sie eine neue Anfrage erstellen oder sehen Sie sich Ihre bestehenden Anfragen an.
          </p>
        </div>
      </div>
    </Layout>
  );
}