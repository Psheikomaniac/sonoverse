# SonoVerse API Documentation

This document provides information about the SonoVerse API endpoints, request/response formats, and examples.

## API Base URL

All API endpoints are prefixed with `/api/v1`.

## Authentication

*Note: Authentication will be implemented in future versions. Currently, all endpoints are publicly accessible.*

## Response Format

Unless otherwise specified, all successful responses will follow this format:

```json
{
  "success": true,
  "data": { /* response data */ }
}
```

Error responses will follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request or validation error
- `404 Not Found`: Resource not found
- `500 Server Error`: Unexpected server error

## Endpoints

### Health Check

#### GET /api/health

Check if the API is running.

**Response**:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Music Requests

#### GET /api/v1/requests

Get all music requests.

**Query Parameters**:
- `limit` (optional): Number of requests to return (default: 10)
- `page` (optional): Page number for pagination (default: 1)
- `status` (optional): Filter by status ('pending', 'in_progress', 'completed')
- `genre` (optional): Filter by genre
- `startDate` (optional): Filter by creation date (start date)
- `endDate` (optional): Filter by creation date (end date)
- `sortBy` (optional): Field to sort by (createdAt, title, genre, mood, tempo)
- `sortOrder` (optional): Sort order ('asc' or 'desc', default: 'desc')

**Response**:
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "60d21b4667d0d8992e610c85",
        "title": "Summer Vibes",
        "description": "An upbeat summer song",
        "genre": "pop",
        "mood": "happy",
        "tempo": 120,
        "lyrics": "Summer days and sunny rays...",
        "status": "pending",
        "createdAt": "2025-04-12T10:30:00.000Z",
        "updatedAt": "2025-04-12T10:30:00.000Z"
      },
      // More requests...
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}
```

#### GET /api/v1/requests/search

Search for music requests with various criteria.

**Query Parameters**:
- `query` (optional): Text to search in title and description
- `status` (optional): Filter by status
- `genre` (optional): Filter by genre
- `mood` (optional): Filter by mood
- `hasLyrics` (optional): Filter requests that have lyrics ('true' or 'false')
- `hasAudio` (optional): Filter requests that have audio ('true' or 'false')
- `startDate` (optional): Filter by creation date (start date)
- `endDate` (optional): Filter by creation date (end date)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of requests to return (default: 10)
- `sortField` (optional): Field to sort by (default: 'createdAt')
- `sortOrder` (optional): Sort order ('asc' or 'desc', default: 'desc')

**Response**:
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "60d21b4667d0d8992e610c85",
        "title": "Summer Vibes",
        "description": "An upbeat summer song",
        "genre": "pop",
        "mood": "happy",
        "tempo": 120,
        "lyrics": "Summer days and sunny rays...",
        "status": "pending",
        "createdAt": "2025-04-12T10:30:00.000Z",
        "updatedAt": "2025-04-12T10:30:00.000Z"
      },
      // More requests...
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}
```

#### GET /api/v1/requests/:id

Get a specific music request by ID.

**Parameters**:
- `id`: MongoDB ObjectID of the request

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "Summer Vibes",
    "description": "An upbeat summer song",
    "genre": "pop",
    "mood": "happy",
    "tempo": 120,
    "lyrics": "Summer days and sunny rays...",
    "status": "pending",
    "audioUrl": null,
    "createdAt": "2025-04-12T10:30:00.000Z",
    "updatedAt": "2025-04-12T10:30:00.000Z"
  }
}
```

**Error Response (404)**:
```json
{
  "success": false,
  "error": {
    "code": "REQUEST_NOT_FOUND",
    "message": "Music request not found"
  }
}
```

#### POST /api/v1/requests

Create a new music request.

**Request Body**:
```json
{
  "title": "Summer Vibes",
  "description": "An upbeat summer song",
  "genre": "pop",
  "mood": "happy",
  "tempo": 120,
  "lyrics": "Summer days and sunny rays..."
}
```

**Required Fields**:
- `title`: String
- `genre`: String
- `mood`: String
- `tempo`: Number

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "Summer Vibes",
    "description": "An upbeat summer song",
    "genre": "pop",
    "mood": "happy",
    "tempo": 120,
    "lyrics": "Summer days and sunny rays...",
    "status": "pending",
    "audioUrl": null,
    "createdAt": "2025-04-12T10:30:00.000Z",
    "updatedAt": "2025-04-12T10:30:00.000Z"
  }
}
```

**Error Response (400)**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required"
  }
}
```

#### PUT /api/v1/requests/:id

Update a music request.

**Parameters**:
- `id`: MongoDB ObjectID of the request

**Request Body**:
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "genre": "rock",
  "mood": "energetic",
  "tempo": 140,
  "lyrics": "Updated lyrics..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "Updated Title",
    "description": "Updated description",
    "genre": "rock",
    "mood": "energetic",
    "tempo": 140,
    "lyrics": "Updated lyrics...",
    "status": "pending",
    "audioUrl": null,
    "createdAt": "2025-04-12T10:30:00.000Z",
    "updatedAt": "2025-04-12T11:15:00.000Z"
  }
}
```

#### PATCH /api/v1/requests/:id/status

Update the status of a music request.

**Parameters**:
- `id`: MongoDB ObjectID of the request

**Request Body**:
```json
{
  "status": "writing",
  "notes": "Starting to write the music"
}
```

**Valid Status Values**:
- `pending`: Initial state when request is created
- `received`: Request has been received and is being reviewed
- `writing`: Music is being written
- `recording`: Music is being recorded
- `mixing`: Audio is being mixed and mastered
- `completed`: Request is complete and ready for delivery
- `rejected`: Request has been rejected

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "status": "writing",
    "statusHistory": [
      {
        "status": "writing",
        "timestamp": "2025-04-15T12:00:00.000Z",
        "notes": "Starting to write the music"
      },
      {
        "status": "received",
        "timestamp": "2025-04-13T10:30:00.000Z",
        "notes": "Request received and under review"
      },
      {
        "status": "pending",
        "timestamp": "2025-04-12T10:30:00.000Z",
        "notes": "Initial request created"
      }
    ],
    "updatedAt": "2025-04-15T12:00:00.000Z"
  }
}
```

**Error Response (Invalid Status Transition)**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "Cannot transition from 'pending' to 'mixing'. Valid transitions are: 'received'."
  }
}
```

#### GET /api/v1/requests/:id/status/history

Get the status history of a music request.

**Parameters**:
- `id`: MongoDB ObjectID of the request

**Response**:
```json
{
  "success": true,
  "data": {
    "requestId": "60d21b4667d0d8992e610c85",
    "title": "Summer Vibes",
    "currentStatus": "writing",
    "statusHistory": [
      {
        "status": "writing",
        "timestamp": "2025-04-15T12:00:00.000Z",
        "notes": "Starting to write the music"
      },
      {
        "status": "received",
        "timestamp": "2025-04-13T10:30:00.000Z",
        "notes": "Request received and under review"
      },
      {
        "status": "pending",
        "timestamp": "2025-04-12T10:30:00.000Z",
        "notes": "Initial request created"
      }
    ]
  }
}
```

#### DELETE /api/v1/requests/:id

Delete a music request.

**Parameters**:
- `id`: MongoDB ObjectID of the request

**Response**:
```json
{
  "success": true,
  "data": {
    "message": "Music request deleted successfully"
  }
}
```

### Lyrics Management

#### PATCH /api/v1/requests/:id/lyrics

Update the lyrics of a music request with formatting options.

**Parameters**:
- `id`: MongoDB ObjectID of the request

**Request Body**:
```json
{
  "lyrics": "Verse 1:\nThis is the first verse of my song\nWith multiple lines of text\n\nChorus:\nThis is the chorus\nIt repeats throughout the song",
  "format": {
    "structure": [
      {
        "type": "verse",
        "startLine": 0,
        "endLine": 2,
        "label": "Verse 1"
      },
      {
        "type": "chorus",
        "startLine": 4,
        "endLine": 5,
        "label": "Chorus"
      }
    ],
    "styles": [
      {
        "type": "bold",
        "startPos": 0,
        "endPos": 7,
        "line": 0
      }
    ]
  },
  "changes": "Updated the first verse and added chorus"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "lyrics": "Verse 1:\nThis is the first verse of my song\nWith multiple lines of text\n\nChorus:\nThis is the chorus\nIt repeats throughout the song",
    "format": {
      "structure": [
        {
          "type": "verse",
          "startLine": 0,
          "endLine": 2,
          "label": "Verse 1"
        },
        {
          "type": "chorus",
          "startLine": 4,
          "endLine": 5,
          "label": "Chorus"
        }
      ],
      "styles": [
        {
          "type": "bold",
          "startPos": 0,
          "endPos": 7,
          "line": 0
        }
      ]
    },
    "version": 2,
    "updatedAt": "2025-04-15T14:30:00.000Z",
    "latestVersion": {
      "version": 2,
      "text": "Verse 1:\nThis is the first verse of my song\nWith multiple lines of text\n\nChorus:\nThis is the chorus\nIt repeats throughout the song",
      "format": { /* format object */ },
      "createdAt": "2025-04-15T14:30:00.000Z",
      "changes": "Updated the first verse and added chorus"
    }
  }
}
```

#### GET /api/v1/requests/:id/lyrics/history

Get the version history of lyrics for a music request.

**Parameters**:
- `id`: MongoDB ObjectID of the request

**Response**:
```json
{
  "success": true,
  "data": {
    "requestId": "60d21b4667d0d8992e610c85",
    "title": "Summer Vibes",
    "currentVersion": 2,
    "versions": [
      {
        "version": 2,
        "text": "Updated lyrics with chorus...",
        "format": { /* format object */ },
        "createdAt": "2025-04-15T14:30:00.000Z",
        "changes": "Updated the first verse and added chorus"
      },
      {
        "version": 1,
        "text": "Original lyrics...",
        "format": { /* format object */ },
        "createdAt": "2025-04-12T10:30:00.000Z",
        "changes": "Initial lyrics"
      }
    ]
  }
}
```

#### GET /api/v1/requests/:id/lyrics/versions/:version

Get a specific version of lyrics for a music request.

**Parameters**:
- `id`: MongoDB ObjectID of the request
- `version`: Version number of the lyrics

**Response**:
```json
{
  "success": true,
  "data": {
    "requestId": "60d21b4667d0d8992e610c85",
    "title": "Summer Vibes",
    "currentVersion": 2,
    "requestedVersion": {
      "version": 1,
      "text": "Original lyrics...",
      "format": { /* format object */ },
      "createdAt": "2025-04-12T10:30:00.000Z",
      "changes": "Initial lyrics"
    }
  }
}
```

#### GET /api/v1/requests/:id/lyrics/compare

Compare two versions of lyrics for a music request.

**Parameters**:
- `id`: MongoDB ObjectID of the request

**Query Parameters**:
- `version1`: First version number to compare
- `version2`: Second version number to compare

**Response**:
```json
{
  "success": true,
  "data": {
    "requestId": "60d21b4667d0d8992e610c85",
    "title": "Summer Vibes",
    "currentVersion": 2,
    "comparison": {
      "version1": {
        "version": 1,
        "text": "Original lyrics...",
        "format": { /* format object */ },
        "createdAt": "2025-04-12T10:30:00.000Z",
        "changes": "Initial lyrics"
      },
      "version2": {
        "version": 2,
        "text": "Updated lyrics with chorus...",
        "format": { /* format object */ },
        "createdAt": "2025-04-15T14:30:00.000Z",
        "changes": "Updated the first verse and added chorus"
      }
    }
  }
}
```

### Audio Uploads

#### POST /api/v1/uploads

Upload an audio file and associate it with a music request.

**Request**:
- Content-Type: multipart/form-data
- Form Fields:
  - `requestId`: ID of the music request to associate with
  - `file`: Audio file (supported formats: MP3, WAV, OGG, FLAC, M4A)

**Response**:
```json
{
  "success": true,
  "data": {
    "audioUrl": "/uploads/60d21b4667d0d8992e610c85-1618226400000.mp3",
    "metadata": {
      "duration": 180.5,
      "format": "mp3",
      "bitrate": 320000,
      "sampleRate": 44100,
      "channels": 2,
      "fileSize": 7340032,
      "encoding": "MPEG 1 Layer 3"
    }
  }
}
```

**Error Responses**:

Invalid file type (400):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid file type. Only MP3, WAV, OGG, FLAC, and M4A files are allowed."
  }
}
```

File too large (400):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "File too large. Maximum file size is 10MB."
  }
}
```

#### GET /api/v1/uploads/:filename

Retrieve an uploaded audio file.

**Parameters**:
- `filename`: Name of the audio file

**Response**:
- The audio file will be sent as a stream with the appropriate Content-Type header.

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid input data |
| `REQUEST_NOT_FOUND` | The requested music request does not exist |
| `FILE_UPLOAD_ERROR` | Error uploading file |
| `INVALID_FILE_TYPE` | Unsupported file type |
| `FILE_NOT_FOUND` | The requested file does not exist |
| `INVALID_STATUS_TRANSITION` | Invalid status transition |
| `VERSION_NOT_FOUND` | The requested lyrics version does not exist |
| `COMPARISON_ERROR` | Error comparing lyrics versions |
| `SERVER_ERROR` | Unexpected server error |

## Future Endpoints (Coming in Later Versions)

- User authentication and management
- Audio processing and manipulation
- AI music generation endpoints
- User feedback and comments
- Collaborative editing features

---

*This API documentation is for version 0.1.0 of SonoVerse and is subject to change in future versions.*