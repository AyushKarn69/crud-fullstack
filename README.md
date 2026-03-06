# PrimeTrade.ai Task Management System

A production-ready full-stack task management application with secure JWT authentication, role-based access control, and a modern animated UI.

## Project Overview

PrimeTrade.ai is a comprehensive task management system that demonstrates secure backend engineering and modern frontend architecture. The platform provides users with the ability to create, manage, filter, and organize tasks, while administrators can manage users and view all tasks across the system. The project emphasizes security, scalability, and user experience through an intuitive interface with smooth animations.

## Technology Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js 4.18.2
- **Database**: PostgreSQL with Prisma ORM 5.5.2
- **Authentication**: JWT (access tokens + refresh tokens)
- **Validation**: Zod 3.22.4
- **Security**: 
  - Helmet for secure HTTP headers
  - bcrypt for password hashing (12 salt rounds)
  - express-rate-limit for rate limiting
  - CORS with secure origin configuration
- **API Documentation**: Swagger/OpenAPI with swagger-ui-express

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.10
- **Routing**: React Router v6
- **HTTP Client**: Axios 1.6.5
- **Styling**: Tailwind CSS 3.4.1
- **Animations**: Framer Motion 10.16.16
- **Font**: Google Fonts (Inter)

## Prerequisites

### For Docker Setup (Recommended)
- Docker v20.10+
- Docker Compose v2.0+

### For Manual Setup
- Node.js v18 or higher
- npm v9 or higher
- PostgreSQL v12 or higher
- Git

## Local Setup

### Option 1: Docker 

The easiest way to run the entire application with a single command.

#### Prerequisites
- Docker v20.10+
- Docker Compose v2.0+

#### Quick Start
```bash
# 1. Clone the repository
git clone <repository-url>
cd "Primetrade ai"

# 2. Start all services in Docker
docker-compose up

# Services will be available at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:5000/api/v1
# - Swagger Docs: http://localhost:5000/api/docs
# - PostgreSQL: localhost:5432 (user: postgres, password: postgres)
```

The database will be automatically migrated on first run.

#### Docker Compose Services
- **PostgreSQL**: Database service with persistent volume
- **Backend**: Express.js API server with hot-reload
- **Frontend**: React development server with Vite

#### Stopping Services
```bash
# Stop all running containers
docker-compose down

# Stop and remove all data (including database)
docker-compose down -v
```

#### Rebuilding Containers
```bash
# Rebuild containers after dependency changes
docker-compose build

# Rebuild and start
docker-compose up --build
```

---

### Option 2: Manual Setup (Local Node.js)

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Primetrade ai"
```

#### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### 4. Configure Environment Variables

##### Backend (.env)
Create a `.env` file in the `backend` directory:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your configuration:
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/primetrade_db
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-change-in-production-12345
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-change-in-production-67890
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

##### Frontend (.env)
Create a `.env` file in the `frontend` directory:
```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

#### 5. Run Database Migration
```bash
cd backend
npx prisma migrate dev --name init
```

#### 6. Start Backend Server
```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

#### 7. Start Frontend Dev Server
In a new terminal:
```bash
cd frontend
npm run dev
# Application will run on http://localhost:5173
```

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Backend server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/primetrade_db` |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens | `your-super-secret-key` |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | `your-different-secret-key` |
| `JWT_ACCESS_EXPIRES` | Access token expiration time | `15m` |
| `JWT_REFRESH_EXPIRES` | Refresh token expiration time | `7d` |
| `CORS_ORIGIN` | Frontend origin for CORS | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

## Available Scripts

### Backend

```bash
# Development server with auto-reload
npm run dev

# Start production server
npm start

# Run database migrations
npx prisma migrate dev

# Deploy migrations to production
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

### Frontend

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Reference

### Base URL
```
http://localhost:5000/api/v1
```

### Swagger Documentation
Interactive API documentation is available at:
```
http://localhost:5000/api/docs
```

### Authentication Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `POST` | `/auth/register` | No | Register new user |
| `POST` | `/auth/login` | No | Login and get access token |
| `POST` | `/auth/refresh` | No | Get new access token using refresh cookie |
| `POST` | `/auth/logout` | Yes | Clear refresh token cookie |

### Task Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `GET` | `/tasks` | Yes | List user tasks (paginated) |
| `POST` | `/tasks` | Yes | Create new task |
| `GET` | `/tasks/:id` | Yes | Get single task |
| `PATCH` | `/tasks/:id` | Yes | Update task |
| `DELETE` | `/tasks/:id` | Yes | Delete task |

### Admin Endpoints
| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| `GET` | `/admin/users` | Yes | ADMIN | List all users (paginated) |
| `DELETE` | `/admin/users/:id` | Yes | ADMIN | Delete user and their tasks |
| `GET` | `/admin/tasks` | Yes | ADMIN | List all tasks across users |

## Default Admin Credentials

To create an admin user for testing:

### Option 1: Manual Database Setup
1. Use Prisma Studio: `npx prisma studio` in the backend directory
2. Navigate to the User model
3. Create a new record with:
   - Email: `admin@primetrade.ai`
   - PasswordHash: Use bcrypt to hash password `AdminPass123` (12 salt rounds)
   - Role: `ADMIN`

### Option 2: SQL Insert
```sql
INSERT INTO public."User" (id, email, "passwordHash", role, "createdAt") 
VALUES (
  'admin-uuid',
  'admin@primetrade.ai',
  '$2b$12$hashed-password-hash-here',
  'ADMIN',
  NOW()
);
```

Login with:
- Email: `admin@primetrade.ai`
- Password: `AdminPass123`

## Security Features

### Authentication & Authorization
- **JWT Tokens**: 15-minute access tokens for stateless authentication
- **Refresh Tokens**: 7-day refresh tokens stored in HTTP-only, Secure, SameSite cookies
- **Password Security**: bcrypt with 12 salt rounds
- **Role-Based Access**: USER and ADMIN role enforcement

### API Security
- **Helmet Headers**: Secure HTTP response headers via Helmet middleware
- **CORS**: Restricted to configured origins only
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Zod schema validation on all routes
- **SQL Injection Protection**: Prisma parameterized queries

### Token Handling
- Access tokens stored in React state memory only (never localStorage)
- Refresh tokens in HTTP-only cookies (not accessible to JavaScript)
- Automatic silent refresh on 401 responses via Axios interceptor
- Secure token rotation on refresh

## Scalability Notes

### Horizontal Scaling
The application is designed for stateless, horizontal scaling:
- **JWT Design**: Tokens are self-contained, enabling load balancing without sticky sessions
- **Stateless API**: No server-side session storage required
- **Database Connection Pooling**: Prisma supports connection pooling for high concurrency
- **Load Balancer Compatible**: Works seamlessly behind load balancers (nginx, HAProxy, AWS ALB)

### Performance Optimization
- **Prisma Connection Pooling**: Configure PgBouncer or similar for database connection pooling
- **Redis Caching**: Cache frequently accessed task lists with Redis
- **CDN Integration**: Frontend assets can be distributed via CDN
- **Database Indexing**: Ensure indexes on `userId`, `email`, and other frequently queried fields

### Microservice Path
Future decomposition opportunities:
- **Auth Service**: Dedicated authentication microservice
- **Task Service**: Separate task management service
- **User Service**: User management and admin operations
- **Notification Service**: Email/webhook notifications for task events
- **Analytics Service**: Usage tracking and reporting

### Production Deployment
- **Docker**: Containerize both backend and frontend
- **Kubernetes**: Deploy with auto-scaling and load balancing
- **Database**: Use managed PostgreSQL (AWS RDS, Azure Database, Google Cloud SQL)
- **Cache**: Implement Redis for session and query caching
- **Monitoring**: Use structured logging and error tracking (Sentry, DataDog)
- **CI/CD**: GitHub Actions, GitLab CI, or Jenkins for automated deployments

## Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── middleware/      # Express middleware
│   │   ├── modules/         # Feature modules (auth, tasks, users, admin)
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions (JWT, hash, response)
│   │   ├── app.js           # Express app setup
│   │   └── index.js         # Server entry point
│   ├── prisma/              # Prisma schema and migrations
│   ├── package.json
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── api/             # API client and interceptors
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context (auth state)
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Tailwind styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env                 # Environment variables
│
└── README.md
```

## Testing the Application

### Register and Login Flow
1. Navigate to `http://localhost:5173`
2. Click "Get Started" to register
3. Create an account with email and password (minimum 8 chars, must contain uppercase, lowercase, and number)
4. Redirect to login page
5. Login with your credentials
6. Redirected to dashboard on success

### Task Management
1. Create a new task by clicking "+ New Task" button
2. Fill in title, description (optional), and status
3. View, edit, and delete tasks from the dashboard
4. Filter tasks by status using the tab buttons
5. Navigate between pages using pagination controls

### Admin Features (requires ADMIN role)
1. Create an admin user via Prisma or SQL
2. Login as admin
3. Access /admin panel from navbar
4. View all users and global task statistics
5. Delete users (cascades delete their tasks)
6. View all tasks across the system

## Code Quality Standards

- **Comments**: Exactly one comment per file at the top describing its purpose
- **Validation**: Zod schemas on all backend routes
- **Error Handling**: Centralized error handler with standardized responses
- **Response Format**:
  ```json
  {
    "success": true,
    "message": "Operation successful",
    "data": { ... },
    "meta": { "page": 1, "limit": 10, "total": 42 }
  }
  ```
- **HTTP Status Codes**: Proper status codes (200, 201, 400, 401, 403, 404, 409, 429, 500)

## Troubleshooting

### Common Errors

#### 429 Too Many Requests (Rate Limiting)
```
POST http://localhost:5000/api/v1/auth/login 429 (Too Many Requests)
```

**Cause**: Rate limiter is enabled (100 requests per 15 minutes in production, 1000 in development).

**Solutions**:
- Wait 15 minutes for the rate limit window to reset
- In development mode, the limit is relaxed to 1000/15min
- In production, keep strict rate limiting enabled (100/15min)

Rate limiting can be configured in [backend/src/app.js](backend/src/app.js):
```javascript
// Current config
max: env.NODE_ENV === "production" ? 100 : 1000,
```

---

### Docker Issues

#### Port Already in Use
```bash
# Containers can't bind to ports 5000, 5173, or 5432

# View which containers are running
docker ps

# Stop conflicting containers
docker-compose down

# Check and kill processes using the ports (if not Docker)
# Port 5000 (Linux/Mac):
lsof -ti:5000 | xargs kill -9

# Port 5000 (Windows):
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### Database Connection Failed
```bash
# Backend can't connect to PostgreSQL

# Verify database service is running
docker-compose ps

# Check database logs
docker-compose logs postgres

# Verify DATABASE_URL in docker-compose.yml
# Should be: postgresql://postgres:postgres@postgres:5432/primetrade_db
```

#### Application Won't Start
```bash
# Check all service logs
docker-compose logs

# Check specific service
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up
```

#### Volume/Data Persistence Issues
```bash
# Remove all Docker data (WARNING: deletes database)
docker-compose down -v

# Remove and recreate
docker-compose up
```

---

### Local Setup Issues

#### Database Connection Issues
```bash
# Verify PostgreSQL is running
pg_isready -h localhost -p 5432

# Check connection string format
postgresql://username:password@localhost:5432/database_name
```

#### Token Not Persisting
- Ensure cookies are enabled in browser
- Check CORS credentials are set to `true`
- Verify `Secure` flag is only set in production

#### Port Already in Use
```bash
# Kill process using port 5000 (Linux/Mac)
lsof -ti:5000 | xargs kill -9

# Kill process using port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues and questions, please check:
1. API Documentation: http://localhost:5000/api/docs
2. Database Schema: `backend/prisma/schema.prisma`
3. Environment Configuration: `.env.example` files

---

Built with ❤️ for secure task management excellence.

