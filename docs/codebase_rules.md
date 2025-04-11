# SonoVerse Codebase Rules & Standards

This document outlines the coding standards and best practices for the SonoVerse project. All contributors should adhere to these guidelines to maintain consistency, readability, and quality across the codebase.

## General Principles

### SOLID Principles
- **Single Responsibility**: Each class/module should have only one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for their base types
- **Interface Segregation**: Many client-specific interfaces are better than one general-purpose interface
- **Dependency Inversion**: Depend on abstractions, not concretions

### DRY (Don't Repeat Yourself)
- Avoid code duplication
- Extract common functionality into reusable functions/modules
- Use utility functions for repeated operations

### KISS (Keep It Simple, Stupid)
- Favor simplicity over complexity
- Write code that is easy to understand and maintain
- Avoid premature optimization

### YAGNI (You Aren't Gonna Need It)
- Implement features only when needed, not when anticipated
- Avoid adding functionality until it's necessary

## Project Structure

### Backend (Node.js/Express)
```
backend/
├── config/              # Configuration files
├── controllers/         # Request handlers
├── middleware/          # Express middleware
├── models/              # Database models
├── routes/              # API routes
├── services/            # Business logic
├── utils/               # Utility functions
├── tests/               # Test files
├── uploads/             # File storage (gitignored)
├── app.js               # Application entry point
├── server.js            # Server setup
└── package.json         # Dependencies
```

### Frontend (Next.js)
```
frontend/
├── app/                 # Next.js App Router directory
│   ├── api/             # API routes
│   ├── components/      # React components
│   ├── lib/             # Utility functions
│   ├── hooks/           # Custom React hooks
│   └── [routes]/        # Page files
├── public/              # Static assets
├── styles/              # Global styles
├── next.config.js       # Next.js configuration
└── package.json         # Dependencies
```

### Python Microservice (Future)
```
python-service/
├── app/                 # Main application
│   ├── api/             # API endpoints
│   ├── core/            # Core functionality
│   ├── models/          # Data models
│   └── utils/           # Utility functions
├── tests/               # Test files
├── requirements.txt     # Dependencies
└── main.py              # Entry point
```

## Coding Standards

### JavaScript/TypeScript

#### Naming Conventions
- **Variables/Functions**: camelCase (`const userData = {}`, `function getUserData()`)
- **Classes/Components**: PascalCase (`class UserService {}`, `function UserProfile()`)
- **Constants**: UPPER_SNAKE_CASE (`const API_URL = ''`)
- **Private properties**: Use `_` prefix (`this._privateValue`)
- **Boolean variables**: Use `is`, `has`, `should` prefixes (`isActive`, `hasPermission`)
- **File naming**: lowercase-with-hyphens.js for utility files, PascalCase.jsx for React components

#### Formatting
- Use 2 spaces for indentation
- Use semicolons at the end of statements
- Keep line length under 100 characters
- Use single quotes for strings
- Add trailing commas in multiline arrays/objects

#### JavaScript Best Practices
- Prefer `const` over `let`, avoid `var`
- Use destructuring for object properties and array items
- Use spread operator for object/array manipulation
- Use template literals for string concatenation
- Use arrow functions for callbacks
- Avoid `undefined` checks with optional chaining (`user?.address?.street`)
- Use nullish coalescing for default values (`const name = user.name ?? 'Anonymous'`)

#### React Best Practices
- Use functional components with hooks
- Extract reusable logic into custom hooks
- Destructure props in function parameters
- Use fragments to avoid unnecessary divs
- Keep components small and focused
- Lift state up when needed
- Use context for global state
- Memoize expensive calculations with `useMemo`
- Optimize event handlers with `useCallback`
- Use keys for list items

### Node.js & Express

#### API Design
- Use RESTful principles for API endpoints
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Return consistent JSON responses
- Include status codes and error messages
- Version APIs using URL prefix (e.g., `/api/v1/users`)

#### Error Handling
- Use try/catch blocks for async operations
- Create custom error classes for different error types
- Use middleware for centralized error handling
- Log errors with appropriate detail
- Return user-friendly error messages

#### Middleware
- Create focused middleware for specific tasks
- Chain middleware for complex operations
- Use middleware for validation, authentication, logging

#### Database Interaction
- Use schema validation
- Create indexes for frequently queried fields
- Handle connection errors and retries
- Use transactions for multi-document operations
- Implement pagination for list endpoints

### Python (For Future Microservice)

#### Naming Conventions
- **Variables/Functions**: snake_case (`user_data`, `def get_user_data()`)
- **Classes**: PascalCase (`class UserService:`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL = ''`)
- **Private properties**: Use `_` prefix (`self._private_value`)

#### Formatting
- Follow PEP 8 guidelines
- Use 4 spaces for indentation
- Limit line length to 88 characters (Black default)
- Use docstrings for functions and classes

#### Python Best Practices
- Use type hints for function parameters and return values
- Prefer list comprehensions over `map` and `filter`
- Use context managers (`with` statement) for resource handling
- Use f-strings for string formatting
- Use `pathlib` for file path operations
- Follow the Zen of Python (`import this`)

#### FastAPI Best Practices
- Use Pydantic models for request/response validation
- Leverage dependency injection for shared logic
- Implement proper error handling with HTTPException
- Use status codes from `starlette.status`
- Document APIs with OpenAPI descriptions

## Testing Standards

### General Testing Principles
- Write tests before or alongside code (TDD/BDD)
- Test behaviors, not implementation details
- Aim for high test coverage (>80%)
- Keep tests fast and independent
- Use meaningful test descriptions

### Backend Testing
- **Unit Tests**: Test individual functions/methods
- **Integration Tests**: Test API endpoints
- **Database Tests**: Test database operations
- Use Jest for JavaScript testing
- Use Supertest for HTTP testing

### Frontend Testing
- **Unit Tests**: Test individual components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test user flows
- Use React Testing Library for component testing
- Use Cypress for E2E testing

### Python Testing
- Use pytest for testing
- Use pytest-cov for coverage reports
- Use pytest fixtures for test setup
- Mock external dependencies

## Documentation

### Code Documentation
- Add JSDoc/TSDoc comments for functions and classes
- Document function parameters and return values
- Include examples for complex functions
- Document non-obvious behaviors and edge cases

### API Documentation
- Document all API endpoints
- Include request/response examples
- Document error responses
- Use OpenAPI/Swagger for interactive documentation

## Git Workflow

### Branching Strategy

#### Main Branches
- `main`: Production-ready code that is tagged with version numbers
  - Contains only stable, tested code that is deployed to production
  - Direct commits are not allowed; changes come only from release branches or hotfixes
  - Each release to main is tagged with the appropriate version number (e.g., `v0.1.0`)
- `develop`: Integration branch for active development
  - Always contains the latest delivered development changes
  - Serves as the base for feature branches
  - Should be in a state where tests pass, even if features are incomplete

#### Supporting Branches
- `feature/*`: Used for developing new features
  - Branch from: `develop`
  - Merge back to: `develop`
  - Naming convention: `feature/feature-name` or `feature/issue-number-feature-name`
- `bugfix/*`: Used for fixing bugs in the development phase
  - Branch from: `develop`
  - Merge back to: `develop`
  - Naming convention: `bugfix/bug-description` or `bugfix/issue-number-bug-description`
- `hotfix/*`: Used for critical fixes that need to go directly to production
  - Branch from: `main`
  - Merge back to: `main` AND `develop`
  - Naming convention: `hotfix/v1.0.1-bug-description`
- `release/*`: Used for preparing a new production release
  - Branch from: `develop`
  - Merge back to: `main` AND `develop`
  - Naming convention: `release/v1.0.0`

### Workflow Process

1. **Development**:
   - Create a new feature branch from `develop`
   - Work on the feature, making regular commits
   - When feature is complete, submit a pull request to `develop`

2. **Code Review**:
   - All changes require a code review before merging
   - CI pipeline should run automatically to verify the changes
   - Address any feedback from reviewers

3. **Integration**:
   - After approval, merge the feature branch into `develop`
   - Feature branches should be deleted after successful merge

4. **Release Preparation**:
   - Create a release branch from `develop` when ready for a release
   - Only bug fixes and release-specific changes are made on this branch
   - Version numbers and documentation are updated

5. **Production Release**:
   - Merge the release branch into `main` and tag with version number
   - Merge the release branch back into `develop`
   - Deploy the tagged version to production

6. **Hotfixes**:
   - For critical production issues, create a hotfix branch from `main`
   - Fix the issue, then merge into both `main` and `develop`
   - Tag the new version on `main` (increment the patch version)

### Commit Conventions

- Write clear, concise commit messages
- Use present tense ("Add feature" not "Added feature")
- Include the component/area affected at the start: "feat(auth): Add login page"
- Reference issue numbers when applicable: "fix(player): Resolve audio stutter (#42)"
- Follow the conventional commits specification:
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation only changes
  - `style`: Changes that do not affect the meaning of the code
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `perf`: A code change that improves performance
  - `test`: Adding missing tests or correcting existing tests
  - `chore`: Changes to the build process or auxiliary tools

### Tagging and Versioning

- Use semantic versioning (MAJOR.MINOR.PATCH)
- Tag all releases on the `main` branch
- Format: `v1.0.0`
- Include release notes with each tag

### Pull Requests

- Provide detailed descriptions
- Include screenshots for UI changes
- Reference related issues
- Ensure all tests pass
- Require code review before merging
- Use pull request templates when available

## Continuous Integration

### Automated Checks
- Linting (ESLint, Flake8)
- Code formatting (Prettier, Black)
- Type checking (TypeScript, mypy)
- Test running
- Coverage reporting

### Pre-commit Hooks
- Lint staged files
- Format code
- Run relevant tests

## Security

### Best Practices
- Validate all input data
- Sanitize output to prevent XSS
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Use HTTPS for all connections
- Follow OWASP guidelines

## Performance

### Optimization Techniques
- Use pagination for large datasets
- Implement caching where appropriate
- Optimize database queries with proper indexes
- Lazy load components and modules
- Minimize bundle size with code splitting
- Use performance monitoring tools

## Deployment

### Environment Configuration
- Use environment variables for configuration
- Keep secrets out of code
- Use different configurations for development, testing, and production

### Containerization
- Use Docker for consistent environments
- Create optimized production images
- Use multi-stage builds to reduce image size

### CI/CD Pipeline
- Automate testing and deployment
- Use staging environments
- Implement blue-green deployments for zero downtime

## Monitoring and Logging

### Logging Standards
- Use structured logging (JSON format)
- Include relevant context with logs
- Use appropriate log levels (debug, info, warn, error)
- Avoid logging sensitive information
- Implement centralized log collection

### Monitoring
- Track key performance metrics
- Set up alerts for critical issues
- Monitor error rates and response times
- Use health checks for services