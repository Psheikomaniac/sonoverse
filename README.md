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

Detailed tasks for each version can be found in the `/tasks/` directory.

### Coding Standards

All code must adhere to the standards defined in `codebase_rules.md`. This includes:

- SOLID principles, DRY, KISS
- Consistent formatting and naming conventions
- Comprehensive testing
- Proper documentation

## Development

### Project Setup

#### Prerequisites
- Node.js (v14.x or higher)
- npm (v7.x or higher)
- MongoDB (v4.4 or higher)

#### Installation
1. Clone the repository:
```bash
git clone https://github.com/Psheikomaniac/sonoverse.git
cd sonoverse
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Setup environment variables:
   - Create `.env` file in the backend directory based on `.env.example`
   - Set your MongoDB connection string and other required variables

### Testing
#### Backend Tests
Backend tests are implemented using Jest and Supertest. The test suite includes:
- Unit tests for music request operations
- Integration tests for API endpoints
- File upload functionality tests

To run the tests:
```bash
# Run all tests
cd backend && npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

The tests use mongodb-memory-server to run an in-memory MongoDB instance, ensuring tests are isolated and don't affect your development database.

#### Frontend Tests
Frontend tests are implemented using Jest and React Testing Library. The test suite includes:
- Unit tests for React components
- Tests for UI behavior and interactions

To run the tests:
```bash
# Run all tests
cd frontend && npm test

# Run tests in watch mode
npm run test:watch
```

### API Documentation
API documentation is available in `docs/api.md`. It includes detailed information about:
- Available endpoints
- Request/response formats
- Authentication (future versions)
- Error handling
- Example requests and responses for all endpoints
- Error codes and their descriptions

### Running the Application
```bash
# Start backend
cd backend
npm start

# Start frontend in a new terminal
cd frontend
npm run dev
```

Open your browser and navigate to `http://localhost:3000`

### Project Structure

```
sonoverse/
├── backend/               # Express.js backend application
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── services/          # Business logic layer
├── frontend/              # Next.js frontend application
│   ├── app/               # Next.js app router pages
│   ├── components/        # Reusable React components
│   ├── lib/               # Utility functions and services
│   └── __tests__/         # Frontend tests
├── docs/                  # Project documentation
│   ├── api.md             # API documentation
│   ├── changelog.md       # Project changelog
│   └── codebase_rules.md  # Coding standards and guidelines
└── tasks/                 # Development task lists
    ├── roadmap.md         # Overall development roadmap
    └── version-*.md       # Version-specific task lists
```

### Development Workflow

1. **Starting a new feature**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Making changes**:
   - Implement your changes following the project's coding standards
   - Add comprehensive tests for your changes
   - Update documentation as needed

3. **Committing your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   Follow the [conventional commits](https://www.conventionalcommits.org/) format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation updates
   - `test:` for test additions or updates
   - `refactor:` for code changes that neither fix bugs nor add features

4. **Pushing your changes**:
   ```bash
   git push -u origin feature/your-feature-name
   ```

5. **Creating a Pull Request**:
   - Go to the GitHub repository
   - Create a new Pull Request from your feature branch to `develop`
   - Complete the PR template with details about your changes
   - Request reviews from team members

## License

[MIT License](LICENSE)

## Contact

For questions or support, please reach out to [your-email@example.com](mailto:your-email@example.com)
