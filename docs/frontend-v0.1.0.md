# SonoVerse Frontend - Version 0.1.0 Dokumentation

Diese Dokumentation beschreibt die Implementierung der Frontend-Funktionen für Version 0.1.0 von SonoVerse gemäß den Anforderungen in der [Version 0.1.0 Aufgabenliste](../tasks/version-0.1.0.md).

## Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Seitenstruktur](#seitenstruktur)
3. [Komponenten](#komponenten)
4. [Datenfluss](#datenfluss)
5. [Tests](#tests)
6. [Erweiterungsmöglichkeiten](#erweiterungsmöglichkeiten)

## Übersicht

Die Frontend-Implementierung für Version 0.1.0 umfasst die folgenden Hauptfunktionen:

- Startseite mit Zugang zu den Hauptfunktionen
- Dashboard zur Anzeige und Filterung von Musikanfragen
- Detailansicht für einzelne Musikanfragen
- Mehrstufiges Formular zum Erstellen neuer Anfragen
- Admin-Dashboard zur Verwaltung aller Anfragen

Die Implementierung verwendet Next.js mit dem App Router und React-Komponenten. Für das Styling wird Tailwind CSS verwendet.

## Seitenstruktur

Die Anwendung besteht aus den folgenden Seiten:

### Startseite (`/app/page.js`)

Die Startseite dient als Einstiegspunkt in die Anwendung und bietet Zugang zu den Hauptfunktionen:
- Neue Anfrage erstellen
- Dashboard mit bestehenden Anfragen
- Admin-Bereich

### Dashboard (`/app/dashboard/page.js`)

Das Dashboard zeigt alle Musikanfragen des Benutzers an und bietet folgende Funktionen:
- Filterung nach Status und Genre
- Sortierung nach verschiedenen Kriterien
- Paginierung für große Datenmengen
- Zugang zur Detailansicht einzelner Anfragen

### Detailansicht (`/app/request/[id]/page.js`)

Die Detailansicht zeigt alle Informationen zu einer einzelnen Musikanfrage:
- Grundlegende Informationen (Titel, Genre, Status)
- Status-Verlauf
- Songtext mit Bearbeitungsmöglichkeit
- Audio-Player für fertige Tracks (nur bei abgeschlossenen Anfragen)
- Download-Funktion für Audio-Dateien

### Anfrage-Formular (`/app/request/new/page.js`)

Das Formular zum Erstellen neuer Musikanfragen ist in mehrere Schritte unterteilt:
1. Grundlegende Informationen (Titel, Genre, Beschreibung)
2. Musik-Details (Tempo, Stimmung, Referenz)
3. Songtext-Eingabe
4. Überprüfung und Absenden

Das Formular bietet:
- Validierung aller Eingabefelder
- Fortschrittsanzeige
- Navigation zwischen den Schritten

### Admin-Dashboard (`/app/admin/page.js`)

Das Admin-Dashboard ermöglicht die Verwaltung aller Musikanfragen:
- Erweiterte Filterfunktionen (Status, Genre, Suche)
- Batch-Aktionen für mehrere Anfragen
- Status-Management
- Audio-Upload-Funktion

## Komponenten

Die Anwendung verwendet die folgenden wiederverwendbaren Komponenten:

### Layout (`/components/Layout.js`)

Eine Wrapper-Komponente, die auf allen Seiten verwendet wird und das grundlegende Layout der Anwendung definiert.

### Button (`/components/Button.js`)

Eine wiederverwendbare Button-Komponente mit verschiedenen Varianten (primary, secondary, outline).

### Card (`/components/Card.js`)

Eine Komponente zur Darstellung von Inhalten in einer Card-Ansicht mit optionalem Titel.

### Input (`/components/Input.js`)

Eine Komponente für Texteingabefelder mit Label und Fehleranzeige.

### Select (`/components/Select.js`)

Eine Komponente für Dropdown-Auswahlfelder mit Label und Optionen.

### Textarea (`/components/Textarea.js`)

Eine Komponente für mehrzeilige Texteingabefelder, insbesondere für Songtexte.

### StatusBadge (`/components/StatusBadge.js`)

Eine Komponente zur Anzeige des Status einer Anfrage mit entsprechender Farbkodierung.

### AudioPlayer (`/components/AudioPlayer.js`)

Eine Komponente zum Abspielen von Audio-Dateien mit Steuerungselementen.

## Datenfluss

In der aktuellen Version werden Mock-Daten verwendet, um die Funktionalität zu demonstrieren. In einer produktiven Umgebung würden API-Aufrufe implementiert werden, um Daten vom Backend zu laden und zu speichern.

### Datenstruktur

Die Hauptdatenstruktur für Musikanfragen umfasst:

```javascript
{
  id: String,
  title: String,
  genre: String,
  status: String, // 'received', 'writing', 'recording', 'mixing', 'completed'
  createdAt: String, // ISO-Datumsformat
  updatedAt: String, // ISO-Datumsformat
  description: String,
  tempo: String,
  mood: String,
  reference: String,
  lyrics: String,
  statusHistory: Array, // Historie der Statusänderungen
  audioUrl: String, // URL zur Audio-Datei (bei abgeschlossenen Anfragen)
  user: String // Nur im Admin-Dashboard
}
```

### API-Integration

Für die Integration mit dem Backend müssen folgende API-Endpunkte implementiert werden:

- `GET /api/requests` - Alle Anfragen abrufen (mit Filterung, Sortierung, Paginierung)
- `GET /api/requests/:id` - Details einer einzelnen Anfrage abrufen
- `POST /api/requests` - Neue Anfrage erstellen
- `PUT /api/requests/:id/lyrics` - Songtext aktualisieren
- `PUT /api/requests/:id/status` - Status aktualisieren
- `POST /api/requests/:id/audio` - Audio-Datei hochladen
- `DELETE /api/requests/:id` - Anfrage löschen
- `PUT /api/requests/batch-update` - Batch-Update für mehrere Anfragen

## Tests

Die Anwendung enthält Tests für die implementierten Komponenten und Seiten. Die Tests verwenden Jest und React Testing Library.

### Teststruktur

- `/frontend/__tests__/components/` - Tests für wiederverwendbare Komponenten
- `/frontend/__tests__/pages/` - Tests für Seitenkomponenten

### Beispiel: Dashboard-Test

Der Test für die Dashboard-Seite (`/frontend/__tests__/pages/Dashboard.test.js`) demonstriert:
- Mocking von Abhängigkeiten
- Testen der Rendering-Funktionalität
- Testen der Interaktion mit der Benutzeroberfläche
- Testen von asynchronen Operationen

## Erweiterungsmöglichkeiten

Die aktuelle Implementierung bietet eine solide Grundlage für zukünftige Erweiterungen:

### Authentifizierung und Autorisierung

- Implementierung eines Login-/Registrierungssystems
- Rollenbasierte Zugriffssteuerung (Benutzer, Admin)
- Profilseite für Benutzer

### Erweiterte Audio-Funktionen

- Waveform-Visualisierung für Audio-Dateien
- Kommentare zu bestimmten Zeitpunkten in Audio-Dateien
- Mehrere Versionen einer Audio-Datei

### Erweiterte Songtext-Funktionen

- Rich-Text-Editor mit mehr Formatierungsoptionen
- Kollaborative Bearbeitung von Songtexten
- Versionierung und Vergleich von Songtexten

### Benachrichtigungen

- E-Mail-Benachrichtigungen bei Statusänderungen
- In-App-Benachrichtigungen
- Push-Benachrichtigungen

### Statistiken und Berichte

- Dashboard mit Statistiken für Administratoren
- Berichte über Anfragen und deren Status
- Nutzungsstatistiken

## Fazit

Die Frontend-Implementierung für Version 0.1.0 erfüllt alle in der Aufgabenliste definierten Anforderungen und bietet eine solide Grundlage für zukünftige Erweiterungen. Die Anwendung ist benutzerfreundlich, responsiv und folgt den Best Practices für moderne Web-Entwicklung.