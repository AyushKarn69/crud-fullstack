# Task Management System

A production-ready full-stack task management application with secure JWT authentication, role-based access control, and dual-database architecture (PostgreSQL + MongoDB).

## 🚀 Project Overview

This Task Management System is a comprehensive application demonstrating modern full-stack development with:
- **Dual Database Architecture**: Users in PostgreSQL, Tasks in MongoDB
- **Secure Authentication**: JWT with refresh tokens
- **Role-Based Access Control**: USER and ADMIN roles
- **Modern UI**: React with Tailwind CSS and animations
- **Production Ready**: Docker containerization, comprehensive validation, error handling

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js 4.18.2
- **Databases**: 
  - PostgreSQL with Prisma ORM 5.5.2 (Users)
  - MongoDB with Mongoose 8.0+ (Tasks)
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Zod 3.22.4
- **Security**: Helmet, bcrypt (12 rounds), rate limiting, CORS
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.10
- **Routing**: React Router v6
- **HTTP Client**: Axios 1.6.5
- **Styling**: Tailwind CSS 3.4.1
- **Animations**: Framer Motion 10.16.16

## 📋 Prerequisites

### Option 1: Docker (Recommended)
- Docker v20.10+
- Docker Compose v2.0+

### Option 2: Manual Setup
- Node.js v18+
- npm v9+
- PostgreSQL v12+
- MongoDB v5.0+

## 🚀 Quick Start (Docker)

### Option 1: Using Start Scripts
```bash
# Linux/Mac
chmod +x start.sh
./start.sh

# Windows
start.bat
```

### Option 2: Manual Docker Commands
```bash
# 1. Clone the repository
git clone <repository-url>
cd "Task Management System"

# 2. Start all services
docker-compose up

# Services will be available at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:5000/api/v1
# - Swagger Docs: http://localhost:5000/api/docs
# - PostgreSQL: localhost:5432
# - MongoDB: localhost:27017
```

### Docker Services
- **PostgreSQL**: User authentication and authorization
- **MongoDB**: Task storage and management
- **Backend**: Express.js API server
- **Frontend**: React development server

### Docker Commands
```bash
# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build

# Remove all data (WARNING: deletes databases)
docker-compose down -v

# View logs
docker-compose logs backend
docker-compose logs frontend
```

## 🔧 Manual Setup

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Configuration

#### Backend (.env)
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskmanagement_db
MONGO_URI=mongodb://localhost:27017/taskdb
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-change-in-production-12345
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-change-in-production-67890
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

#### Frontend (.env)
```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### 3. Database Setup

#### PostgreSQL
```bash
# Create database
createdb taskmanagement_db

# Run migrations
cd backend
npx prisma migrate dev
```

#### MongoDB
```bash
# Start MongoDB service (varies by OS)
# Ubuntu/Debian: sudo systemctl start mongod
# macOS: brew services start mongodb-community
# Windows: net start MongoDB
```

### 4. Start Services
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

## 📊 Database Architecture

### Dual Database Design
```
┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     MongoDB     │
│                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │    Users    │ │    │ │    Tasks    │ │
│ │             │ │    │ │             │ │
│ │ - id (UUID) │◄────┼─┤ - userId     │ │
│ │ - email     │ │    │ │ - title     │ │
│ │ - password  │ │    │ │ - desc      │ │
│ │ - role      │ │    │ │ - dueDate   │ │
│ │ - createdAt │ │    │ │ - status    │ │
│ └─────────────┘ │    │ │ - createdAt │ │
└─────────────────┘    │ │ - updatedAt │ │
                       │ └─────────────┘ │
                       └─────────────────┘
```

### Why Dual Database?
- **PostgreSQL**: ACID compliance for user authentication
- **MongoDB**: Flexible schema for task management
- **Scalability**: Independent scaling of user and task services
- **Performance**: Optimized queries for each data type

## 🔐 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Interactive Documentation
```
http://localhost:5000/api/docs
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "USER"
    }
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
Cookie: refreshToken=jwt-refresh-token
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer jwt-access-token
```

### Task Endpoints

#### Create Task
```http
POST /tasks
Authorization: Bearer jwt-access-token
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management system",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "status": "pending"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "mongodb-object-id",
    "userId": "user-uuid",
    "title": "Complete project",
    "description": "Finish the task management system",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### List Tasks
```http
GET /tasks?page=1&limit=10&status=pending
Authorization: Bearer jwt-access-token
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "_id": "mongodb-object-id",
      "title": "Complete project",
      "description": "Finish the task management system",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```

#### Update Task
```http
PATCH /tasks/:id
Authorization: Bearer jwt-access-token
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer jwt-access-token
```

### Admin Endpoints (ADMIN role required)

#### List All Users
```http
GET /admin/users?page=1&limit=10
Authorization: Bearer jwt-access-token
```

#### Delete User
```http
DELETE /admin/users/:id
Authorization: Bearer jwt-access-token
```

#### List All Tasks
```http
GET /admin/tasks?page=1&limit=10
Authorization: Bearer jwt-access-token
```

### Error Responses

#### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

#### Authentication Error (401)
```json
{
  "success": false,
  "message": "Invalid or expired access token",
  "errors": []
}
```

#### Authorization Error (403)
```json
{
  "success": false,
  "message": "Insufficient permissions",
  "errors": []
}
```

#### Not Found Error (404)
```json
{
  "success": false,
  "message": "Task not found",
  "errors": []
}
```

## 📁 Project Structure & Design Decisions

### Backend Architecture
```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── db.js           # Prisma client (PostgreSQL)
│   │   ├── mongo.js        # Mongoose connection (MongoDB)
│   │   ├── env.js          # Environment validation
│   │   └── swagger.js      # API documentation
│   │
│   ├── middleware/          # Express middleware
│   │   ├── authenticate.js # JWT verification
│   │   ├── authorize.js    # Role-based access control
│   │   ├── validate.js     # Zod schema validation
│   │   └── errorHandler.js # Global error handling
│   │
│   ├── modules/            # Feature modules (Domain-driven design)
│   │   ├── auth/           # Authentication logic
│   │   │   ├── auth.controller.js  # Route handlers
│   │   │   ├── auth.service.js     # Business logic
│   │   │   └── auth.schema.js      # Validation schemas
│   │   │
│   │   ├── tasks/          # Task management (MongoDB)
│   │   │   ├── task.model.js       # Mongoose schema
│   │   │   ├── tasks.controller.js # Route handlers
│   │   │   ├── tasks.service.js    # Business logic
│   │   │   └── tasks.schema.js     # Validation schemas
│   │   │
│   │   ├── users/          # User management (PostgreSQL)
│   │   └── admin/          # Admin operations
│   │
│   ├── routes/             # API route definitions
│   │   └── v1/             # API versioning
│   │
│   ├── utils/              # Utility functions
│   │   ├── jwt.js          # Token operations
│   │   ├── hash.js         # Password hashing
│   │   └── response.js     # Standardized responses
│   │
│   ├── app.js              # Express app configuration
│   └── index.js            # Server entry point
│
├── prisma/                 # PostgreSQL schema & migrations
└── package.json
```

### Frontend Architecture
```
frontend/
├── src/
│   ├── api/                # API communication layer
│   │   ├── client.js       # Axios configuration
│   │   └── interceptors.js # Token refresh logic
│   │
│   ├── components/         # Reusable UI components
│   │   ├── ProtectedRoute.jsx  # Authentication guard
│   │   ├── AdminRoute.jsx      # Admin guard
│   │   ├── Navbar.jsx          # Navigation
│   │   └── TaskCard.jsx        # Task display
│   │
│   ├── context/            # Global state management
│   │   └── AuthContext.jsx # Authentication state
│   │
│   ├── hooks/              # Custom React hooks
│   │   └── useAuth.js      # Authentication hook
│   │
│   ├── pages/              # Route components
│   │   ├── Landing.jsx     # Home page
│   │   ├── Register.jsx    # User registration
│   │   ├── Login.jsx       # User login
│   │   ├── Dashboard.jsx   # Task dashboard
│   │   ├── CreateTask.jsx  # Task creation
│   │   ├── EditTask.jsx    # Task editing
│   │   └── Admin.jsx       # Admin panel
│   │
│   └── main.jsx            # React entry point
│
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### Key Design Decisions

#### 1. Dual Database Architecture
- **Separation of Concerns**: Users (auth) vs Tasks (data)
- **Technology Fit**: PostgreSQL for ACID, MongoDB for flexibility
- **Scalability**: Independent scaling and optimization

#### 2. Modular Backend Structure
- **Domain-Driven Design**: Features organized by business domain
- **Separation of Layers**: Controllers → Services → Models
- **Single Responsibility**: Each file has one clear purpose

#### 3. Security-First Approach
- **JWT + Refresh Tokens**: Secure, stateless authentication
- **HTTP-Only Cookies**: Refresh tokens not accessible to JavaScript
- **Input Validation**: Zod schemas on all endpoints
- **Rate Limiting**: DDoS protection

#### 4. Error Handling Strategy
- **Centralized Error Handler**: Consistent error responses
- **Validation Errors**: Detailed field-level feedback
- **Security Errors**: No information leakage

#### 5. Frontend State Management
- **Context API**: Simple, built-in state management
- **Token Storage**: Memory (access) + HTTP-only cookies (refresh)
- **Automatic Refresh**: Transparent token renewal

## 🧪 Testing Guide

### 1. User Registration & Authentication
```bash
# Register new user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}' \
  -c cookies.txt

# Extract access token from response and use in subsequent requests
```

### 2. Task Management
```bash
# Create task
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "status": "pending"
  }'

# List tasks
curl -X GET "http://localhost:5000/api/v1/tasks?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Update task
curl -X PATCH http://localhost:5000/api/v1/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Delete task
curl -X DELETE http://localhost:5000/api/v1/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Security Testing
```bash
# Test unauthorized access
curl -X GET http://localhost:5000/api/v1/tasks
# Should return 401

# Test invalid token
curl -X GET http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer invalid-token"
# Should return 401

# Test accessing another user's task
curl -X GET http://localhost:5000/api/v1/tasks/OTHER_USER_TASK_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
# Should return 404 (not 403 to avoid information leakage)
```

### 4. Validation Testing
```bash
# Test invalid email
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"TestPass123"}'
# Should return 400 with validation errors

# Test weak password
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"weak"}'
# Should return 400 with validation errors

# Test invalid task status
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","status":"invalid-status"}'
# Should return 400 with validation errors
```

## 🎥 Demo Video Requirements

### Setup Process (1 minute)
1. Show `docker-compose up` command
2. Demonstrate services starting (PostgreSQL, MongoDB, Backend, Frontend)
3. Navigate to http://localhost:5173

### User Registration & Login (1 minute)
1. Register new user with email/password
2. Show validation (weak password rejection)
3. Successful registration → redirect to login
4. Login with credentials → redirect to dashboard

### Task Management (2 minutes)
1. Create new task with title, description, due date
2. Show task in dashboard with status filtering
3. Update task status (pending → completed)
4. Edit task details
5. Delete task with confirmation

### Security Demonstration (1 minute)
1. Open browser dev tools → Network tab
2. Show JWT token in Authorization header
3. Attempt to access another user's task (create second user)
4. Show 404 response (security through obscurity)
5. Demonstrate token expiration/refresh

### Validation & Error Handling (30 seconds)
1. Try creating task without title → show validation error
2. Try invalid status value → show validation error
3. Show rate limiting (if applicable)

## 🚨 Troubleshooting

### Docker Issues
If you encounter Docker-related problems:
1. **Read the [Docker Setup Guide](DOCKER_SETUP_GUIDE.md)** - Complete Docker Desktop installation and setup
2. **Check the [Troubleshooting Guide](TROUBLESHOOTING.md)** - Common issues and solutions

### Quick Fixes
```bash
# Docker Desktop not running
# 1. Start Docker Desktop application
# 2. Wait for whale icon to appear in system tray
# 3. Run: docker info (should show system info, not error)

# Port conflicts
docker-compose down
netstat -ano | findstr :5000  # Windows
lsof -ti:5000 | xargs kill -9  # Mac/Linux

# Database connection issues
docker-compose logs postgres
docker-compose logs mongo

# Complete reset (WARNING: deletes all data)
docker-compose down --volumes --remove-orphans
docker-compose up --build
```

### Manual Setup Issues
```bash
# PostgreSQL connection
pg_isready -h localhost -p 5432

# MongoDB connection
mongosh --eval "db.adminCommand('ping')"

# Node.js version
node --version  # Should be v18+
```

### Common Errors
- **EADDRINUSE**: Port already in use → Kill process or change port
- **Database connection failed**: Check database services are running
- **JWT errors**: Verify JWT secrets in .env file
- **CORS errors**: Check CORS_ORIGIN matches frontend URL

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@localhost:5432/db` |
| `MONGO_URI` | MongoDB connection | `mongodb://localhost:27017/taskdb` |
| `JWT_ACCESS_SECRET` | Access token secret | `your-secret-key` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `your-refresh-secret` |
| `JWT_ACCESS_EXPIRES` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES` | Refresh token expiry | `7d` |
| `CORS_ORIGIN` | Frontend URL for CORS | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api/v1` |

## 🔒 Security Features

- **JWT Authentication**: Stateless, secure token-based auth
- **Refresh Token Rotation**: Automatic token renewal
- **Password Hashing**: bcrypt with 12 salt rounds
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Comprehensive Zod schemas
- **CORS Protection**: Restricted origins
- **Helmet Security**: Secure HTTP headers
- **SQL Injection Protection**: Parameterized queries
- **NoSQL Injection Protection**: Mongoose sanitization

## 📈 Performance & Scalability

- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Stateless Design**: Horizontal scaling ready
- **Caching Strategy**: Ready for Redis integration
- **Load Balancer Compatible**: No sticky sessions required

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **API Documentation**: http://localhost:5000/api/docs
- **Database Schema**: `backend/prisma/schema.prisma`
- **Environment Examples**: `.env.example` files

---

Built with ❤️ for modern task management.