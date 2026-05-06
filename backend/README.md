# TaskFlow Backend - Node.js + Express + MongoDB

A RESTful API backend for the TaskFlow Task Manager application with role-based access control.

## Features

✅ **Authentication**: JWT-based authentication
✅ **Role-Based Access**: Admin and User roles with different permissions
✅ **Task Management**: Create, read, update, delete tasks
✅ **User Management**: Signup, login with password hashing
✅ **MongoDB Atlas Integration**: Cloud-based MongoDB database

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or pnpm
- MongoDB Atlas account (already configured)

### 1. Install Dependencies

```bash
cd backend
npm install
# or
pnpm install
```

### 2. Configure Environment Variables

The `.env` file is already configured with your MongoDB Atlas connection:

```
MONGODB_URI=mongodb+srv://jyotsnasree21:jyotsna21@cluster0.nl4hxon.mongodb.net/?appname=cluster0
PORT=3000
JWT_SECRET=taskflow_secret_key_2024_secure
NODE_ENV=development
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start at `http://localhost:3000`

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - Create a new user account
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **POST** `/api/auth/login` - Login user
  ```json
  {
    "email": "admin@taskflow.com",
    "password": "password"
  }
  ```

**Mock Credentials for Testing:**
- Admin: `admin@taskflow.com` / `password`
- User: `user@taskflow.com` / `password`

### Tasks (Requires Authentication)

All task endpoints require `Authorization: Bearer <token>` header

- **GET** `/api/tasks` - Get all tasks (users see only assigned, admins see all)
- **GET** `/api/tasks/:id` - Get specific task
- **POST** `/api/tasks` - Create new task (Admin only)
  ```json
  {
    "title": "Task Title",
    "description": "Task description",
    "priority": "High",
    "assignedTo": "userId"
  }
  ```
- **PATCH** `/api/tasks/:id/status` - Update task status
  ```json
  {
    "status": "Completed"
  }
  ```
- **PUT** `/api/tasks/:id` - Update task (Admin only)
- **DELETE** `/api/tasks/:id` - Delete task (Admin only)

### Users (Admin only)

- **GET** `/api/tasks/admin/users` - Get all users

## Database Schema

### User Model

```
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  role: String (Admin | User),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model

```
{
  title: String (required),
  description: String,
  status: String (Pending | In Progress | Completed),
  priority: String (Low | Medium | High),
  assignedTo: ObjectId (User reference),
  createdBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

## Role-Based Access Control

### Admin Role
- ✅ Create new tasks
- ✅ Assign tasks to users
- ✅ View all tasks
- ✅ Edit any task
- ✅ Delete tasks
- ✅ View all users

### User Role
- ✅ View only assigned tasks
- ✅ Update status of assigned tasks
- ❌ Create tasks
- ❌ Edit/delete tasks
- ❌ View other users

## Testing

Use Postman, Insomnia, or cURL to test the API:

```bash
# Test health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@taskflow.com","password":"password"}'

# Get tasks (use token from login)
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>"
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `409` - Conflict (e.g., email exists)
- `500` - Server error

## Project Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
└── package.json
```

## Troubleshooting

### MongoDB Connection Failed
- Check your internet connection
- Verify MongoDB Atlas connection string is correct
- Ensure IP is whitelisted in MongoDB Atlas (usually 0.0.0.0/0 for development)

### Port Already in Use
- Change PORT in `.env`
- Or kill process using port 3000: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)

### CORS Issues
- Backend already has CORS enabled for all origins in development
- Update CORS configuration in `src/server.js` for production

## Next Steps

1. Install backend dependencies: `npm install`
2. Start backend server: `npm run dev`
3. Configure mobile app to use `http://localhost:3000` (or your server IP)
4. Run mobile app and test authentication and task features

---

**Backend Status**: ✅ Ready to run
**API Base URL**: `http://localhost:3000/api`
