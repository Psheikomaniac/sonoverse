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
Da
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
  "status": "in_progress"
}
```

**Valid Status Values**:
- `pending`
- `in_progress`
- `completed`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "status": "in_progress",
    "updatedAt": "2025-04-12T12:00:00.000Z"
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

### Audio Uploads

#### POST /api/v1/uploads

Upload an audio file and associate it with a music request.

**Request**:
- Content-Type: multipart/form-data
- Form Fields:
  - `requestId`: ID of the music request to associate with
  - `file`: Audio file (supported formats: mp3, wav)

**Response**:
```json
{
  "success": true,
  "data": {
    "audioUrl": "/uploads/60d21b4667d0d8992e610c85-1618226400000.mp3",
    "message": "Audio file uploaded successfully"
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
| `SERVER_ERROR` | Unexpected server error |

## Future Endpoints (Coming in Later Versions)

- User authentication and management
- Advanced search and filtering
- Audio processing and manipulation
- AI music generation endpoints

---

*This API documentation is for version 0.0.1 of SonoVerse and is subject to change in future versions.*
