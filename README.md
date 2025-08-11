# NX Nest Angular Boilerplate

[🔗 Live Preview: featstack.com](https://featstack.com)

A modern full-stack application boilerplate built with NX monorepo, NestJS backend, Angular frontend, and comprehensive DevOps tooling.

## Tech Stack

### Frontend
- **Angular 20** - Modern web framework
- **TailwindCSS 4** - Utility-first CSS framework
- **Storybook** - Component development environment

### Backend
- **NestJS** - Scalable Node.js framework
- **Prisma** - Type-safe database ORM
- **JWT Authentication** - Secure authentication system
- **Passport.js** - Authentication middleware

### Database & Infrastructure
- **PostgreSQL** - Relational database
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy and load balancer
- **Terraform** - Infrastructure as Code

### Development & DevOps
- **NX** - Smart monorepo build system
- **Jest** - Testing framework
- **Playwright** - E2E testing
- **ESLint & Prettier** - Code quality and formatting
- **Husky & lint-staged** - Pre-commit hooks

## Project Structure

```
nx-nest-angular-boilerplate/
├── apps/
│   ├── api/                    # NestJS backend application
│   ├── api-e2e/               # API end-to-end tests
│   ├── web-app/               # Angular frontend application
│   ├── web-app-admin/         # Admin panel (placeholder)
│   └── web-app-e2e/          # Frontend E2E tests
├── libs/
│   ├── shared/
│   │   ├── auth/              # Authentication module
│   │   │   ├── api/           # Auth API layer
│   │   │   ├── data-access/   # Auth data access
│   │   │   ├── domain/        # Auth domain logic
│   │   │   ├── feature/       # Auth features
│   │   │   ├── infrastructure/# Database & Prisma
│   │   │   └── ui/            # Auth UI components
│   │   ├── environments/      # Environment configurations
│   │   ├── notifications/     # Notification system
│   │   ├── ui-components/     # Shared UI components
│   │   └── utils/             # Utility functions
├── docker/
│   └── featstack/
│       ├── local/             # Local development setup
│       └── prod/              # Production deployment
└── infrastructure/            # Terraform configurations
    ├── environments/
    └── modules/
```

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (optional for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd nx-nest-angular-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm ci --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   # Root level
   cp .env.example .env
   
   # API level
   cp apps/api/.env.example apps/api/.env.local
   
   # Docker level
   cp docker/featstack/local/.env.example docker/featstack/local/.env
   ```

4. **Configure your environment variables**
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   
   # JWT
   JWT_SECRET="your-jwt-secret"
   JWT_EXPIRES_IN="15m"
   JWT_REFRESH_SECRET="your-refresh-secret"
   JWT_REFRESH_EXPIRES_IN="7d"
   
   # Email (SendGrid)
   SENDGRID_API_KEY="your-sendgrid-api-key"
   
   ```

### Development

#### Option 1: Full Stack with Docker (Recommended)
```bash
# Start all services (PostgreSQL, API, Frontend)
npm run start:all
```

#### Option 2: Local Development
```bash
# Start database only
npm run docker:up

# Start API and Frontend locally
npm run start:local
```

#### Option 3: Individual Services
```bash
# Backend only
nx serve api

# Frontend only
nx serve web-app

# Both in parallel
nx run-many --target=serve --projects=api,web-app --parallel
```

### Database Setup

1. **Generate Prisma client**
   ```bash
   npx prisma generate --config=libs/shared/auth/infrastructure/prisma.config.ts
   ```

2. **Run migrations**
   ```bash
   npx prisma migrate dev --schema=libs/shared/auth/infrastructure/src/lib/prisma
   ```

3. **Seed database**
   ```bash
   npx prisma db seed
   ```

## Available Scripts

### Development
- `npm run start:all` - Start all services with Docker
- `npm run start:local` - Start API and frontend locally
- `npm run docker:up` - Start Docker services
- `npm run docker:down` - Stop Docker services

### Building
- `nx build api` - Build API application
- `nx build web-app` - Build frontend application
- `npm run build` - Build current project

### Testing
- `npm test` - Run affected tests
- `nx e2e web-app-e2e` - Run E2E tests
- `nx test <project-name>` - Run specific project tests

### Code Quality
- `npm run lint` - Lint affected projects
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🔧 Features

### Authentication System
- JWT-based authentication
- Role-based access control
- Password reset functionality
- Protected routes and guards

### Frontend Features
- Responsive design with TailwindCSS
- Component library with Storybook
- Angular routing with guards
- HTTP interceptors for auth

### Backend Features
- RESTful API with NestJS
- Database integration with Prisma
- API documentation with Swagger
- Email notifications

### DevOps & Infrastructure
- Multi-stage Docker builds
- Docker Compose for local development
- Terraform infrastructure templates
- Automated testing pipeline ready


##  Docker Deployment

### Local Development
```bash
cd docker/featstack/local
docker-compose up --build
```

### Production
```bash
cd docker/featstack/prod
docker-compose up --build
```


##  Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run specific project tests
nx test shared-auth-api
nx test web-app
```

### E2E Tests
```bash
# Frontend E2E
nx e2e web-app-e2e

# API E2E
nx e2e api-e2e
```


