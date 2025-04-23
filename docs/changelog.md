# Changelog

All notable changes to the SonoVerse project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-05-10

### Added
- **Extended Request API**:
  - Advanced filtering, sorting, and pagination for music requests
  - Search functionality with multiple criteria
  - Ability to delete requests
  - Improved error handling and validation

- **Improved Audio Upload System**:
  - Support for multiple audio formats (MP3, WAV, OGG, FLAC, M4A)
  - Audio metadata extraction (duration, format, bitrate, etc.)
  - File size validation and security enhancements
  - Improved error handling for uploads

- **Lyrics Management**:
  - Comprehensive lyrics validation (length, format, structure)
  - Lyrics versioning with history tracking
  - Formatting options for lyrics (structure, styles)
  - Specialized API endpoints for lyrics operations:
    - Update lyrics with formatting
    - View lyrics history
    - Compare different versions
    - Retrieve specific versions

- **Status Management System**:
  - Detailed status stages for request workflow
  - Status transition validation
  - Status change history tracking
  - Preparation for automatic notifications on status changes

### Technical
- Enhanced model schemas with support for metadata and versioning
- Implemented specialized middleware for validation
- Added comprehensive test coverage for new features
- Improved security measures for file uploads
- Optimized database queries with proper indexing

## [0.0.1] - 2025-04-12

### Added
- Initial project setup
- Basic Express.js backend with MongoDB connection
- Next.js frontend with TailwindCSS
- Core models for music requests with lyrics support
- Basic API routes for CRUD operations
- Simple frontend pages:
  - Home/landing page
  - Dashboard for viewing requests
  - Form for submitting new music requests with lyrics
  - Admin page for managing requests
- Audio upload and playback functionality
- Minimal error handling
- Basic styling with TailwindCSS

### Technical
- Set up project structure for both frontend and backend
- Implemented API endpoints for request management
- Created MongoDB schemas for data storage
- Set up file storage for audio uploads
- Configured development environment
