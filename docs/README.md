# SonoVerse

SonoVerse is a web platform that enables users to request custom AI-generated music with their own lyrics.

![SonoVerse Logo](https://placeholder.com/logo)

## What is SonoVerse?

SonoVerse bridges the gap between your creative lyrics and professional music production. The platform allows you to:

- Submit music requests with specific parameters (genre, mood, tempo)
- Include your own custom lyrics for the songs
- Receive professionally produced AI-generated music through a streamlined process
- Access your music library and download your finished tracks

Behind the scenes, music producers use AI tools like Suno to transform your vision into reality, creating unique tracks tailored to your specifications.

## Key Features

- **Personalized Music Creation**: Specify genre, mood, tempo, and other parameters to get exactly the music you want
- **Lyrics Integration**: Add your own lyrics to be incorporated into the final song
- **Dashboard**: Track the status of your requests and access all your music in one place
- **Simple Workflow**: Intuitive request form and clear status updates throughout the production process

## Technical Overview

SonoVerse is built with:

- **Frontend**: Next.js with React and TailwindCSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Audio Processing**: Python microservice with FastAPI, librosa, and pydub
- **Audio Storage**: Local file system (future: AWS S3)

## Development Process

### Branching Strategy

SonoVerse follows a structured branching strategy:

- `main`: Contains production-ready code, tagged with version numbers
- `develop`: Integration branch for active development
- Feature branches: Created from `develop` as `feature/feature-name`
- Bug fixes: Created as `bugfix/bug-description`
- Hotfixes: Created from `main` as `hotfix/v0.0.x-description`

All development work should be done on feature branches and merged into `develop` via pull requests.

### Version Roadmap

Development follows an incremental approach:

1. **v0.0.1**: Foundation - Basic project setup and infrastructure
2. **v0.1.0**: MVP - Core functionality with basic features
3. **v0.2.0**: Enhancement - Improved UI and additional features
4. **v0.3.0**: Integration - Python microservice for audio processing
5. **v1.0.0**: Production - Final polishing and optimizations

Detailed tasks for each version can be found in the `/docs/tasks/` directory.

### Coding Standards

All code must adhere to the standards defined in `codebase_rules.md`. This includes:

- SOLID principles, DRY, KISS
- Consistent formatting and naming conventions
- Comprehensive testing
- Proper documentation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- Python 3.8+ (for audio processing)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/sonoverse.git
   cd sonoverse
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

4. Create environment variables
   - Create `.env` file in the backend directory
   - Add your MongoDB connection string: `MONGODB_URI=your_connection_string`

5. Start the development servers
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

6. Open your browser and navigate to `http://localhost:3000`

## License

[MIT License](LICENSE)

## Contact

For questions or support, please reach out to [your-email@example.com](mailto:your-email@example.com)