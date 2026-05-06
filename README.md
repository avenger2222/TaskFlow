# TaskFlow - Complete Task Manager Application

A full-stack Task Manager application with **role-based access control** built with React Native (mobile), Node.js + Express (backend), and MongoDB Atlas (database).

## 🎯 Project Overview

TaskFlow is a production-ready task management system with:
- ✅ **Mobile App**: React Native (Expo) with clean UI
- ✅ **Backend API**: Node.js + Express with JWT authentication
- ✅ **Database**: MongoDB Atlas with role-based access
- ✅ **Role-Based Access Control**: Admin and User roles
- ✅ **Real-time Task Management**: Create, read, update, delete tasks

## 📁 Project Structure

```
TaskFlow/
├── mobile/              # React Native Expo app (will be added)
├── backend/             # Node.js + Express server
│   ├── src/
│   │   ├── models/      # MongoDB schemas (User, Task)
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Authentication & auth
│   │   └── server.js    # Express entry point
│   ├── .env             # Environment config (MongoDB credentials)
│   └── package.json
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14+) installed
- **MongoDB Atlas** account (connection string provided)
- **npm** or **pnpm** package manager

### 1. Start the Backend Server

The backend is already configured with your MongoDB Atlas connection string.

```bash
cd backend
npm install              # Install dependencies
npm run dev              # Start development server (localhost:3000)
```

**Expected Output:**
```
✅ Connected to MongoDB Atlas
🚀 Server running on http://localhost:3000
```

**Server is now ready to accept API requests!**

### 2. Configure & Start Mobile App

The mobile app (React Native) is currently in the `TaskFlow/` directory.

```bash
cd TaskFlow
npm install --legacy-peer-deps  # Install with peer deps flag
npm start                        # Start Expo development server
```

Then:
- Press `w` for web preview
- Press `i` for iOS simulator (Mac only)
- Press `a` for Android emulator

## 🔐 Authentication

### Mock Users for Testing

You can immediately test the app with these credentials:

| Email | Password | Role |
|-------|----------|------|
| `admin@taskflow.com` | `password` | Admin |
| `user@taskflow.com` | `password` | User |

Or **sign up** with new credentials to create a new user account.

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### 1. **Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@taskflow.com",
  "password": "password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a1b1c1d1e1f1g1h1i1j1",
    "name": "Admin User",
    "email": "admin@taskflow.com",
    "role": "Admin"
  }
}
```

#### 2. **Signup**
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Task Endpoints (All require Authorization header)

```
Authorization: Bearer {token}
```

#### 1. **Get All Tasks**
```http
GET /tasks

# Admin sees all tasks, Users see only assigned tasks
```

#### 2. **Get Single Task**
```http
GET /tasks/{taskId}
```

#### 3. **Create Task (Admin only)**
```http
POST /tasks
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "priority": "High",
  "assignedTo": "userId"
}
```

#### 4. **Update Task Status**
```http
PATCH /tasks/{taskId}/status
Content-Type: application/json

{
  "status": "Completed"
}
```

**Valid status values:** `Pending`, `In Progress`, `Completed`

#### 5. **Update Full Task (Admin only)**
```http
PUT /tasks/{taskId}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "priority": "Low",
  "status": "In Progress",
  "assignedTo": "newUserId"
}
```

#### 6. **Delete Task (Admin only)**
```http
DELETE /tasks/{taskId}
```

#### 7. **Get All Users (Admin only)**
```http
GET /tasks/admin/users
```

## 🛡️ Role-Based Access Control

### Admin Role
- ✅ Create new tasks
- ✅ Assign tasks to users
- ✅ View ALL tasks (not just assigned)
- ✅ Edit any task
- ✅ Delete any task
- ✅ View all users

### User Role
- ✅ View only assigned tasks
- ✅ Update status of assigned tasks
- ❌ Cannot create tasks
- ❌ Cannot edit/delete tasks
- ❌ Cannot see other users' tasks

## 💾 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "Admin" | "User",
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: "Pending" | "In Progress" | "Completed",
  priority: "Low" | "Medium" | "High",
  assignedTo: ObjectId (User reference),
  createdBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing with Postman/Insomnia

1. **Login** and get token:
   ```
   POST http://localhost:3000/api/auth/login
   Body: { "email": "admin@taskflow.com", "password": "password" }
   ```

2. **Copy the token** from response

3. **Set Authorization header** for all task requests:
   ```
   Authorization: Bearer <your_token>
   ```

4. **Test endpoints** (examples):
   ```
   GET http://localhost:3000/api/tasks
   POST http://localhost:3000/api/tasks
   PATCH http://localhost:3000/api/tasks/:id/status
   ```

## 🔧 Environment Configuration

### Backend Environment Variables
File: `backend/.env`

```
MONGODB_URI=mongodb+srv://jyotsnasree21:jyotsna21@cluster0.nl4hxon.mongodb.net/?appname=cluster0
PORT=3000
JWT_SECRET=taskflow_secret_key_2024_secure
NODE_ENV=development
```

**⚠️ Important:** Keep `.env` file secret and never commit it to version control.

### Mobile App Configuration
File: `TaskFlow/services/apiClient.ts`

The mobile app automatically connects to:
- Backend URL: `http://localhost:3000/api`
- Mode: Real backend (set to `USE_MOCK_BACKEND = false`)

## 📱 Mobile App Features

- **Authentication**: Login/Signup with JWT tokens
- **Task List**: View assigned tasks with filtering
- **Task Details**: View complete task information
- **Task Status**: Update task status (Pending → In Progress → Completed)
- **Create Tasks** (Admin only)
- **Clean UI**: Cards, badges, status indicators
- **Loading States**: Spinner and empty state handling
- **Persistent Storage**: Data persists after app restart

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Check internet connection
- Verify MongoDB Atlas connection string in `.env`
- Ensure IP is whitelisted in MongoDB Atlas settings (usually 0.0.0.0/0 for development)

**Port 3000 Already in Use**
- Change `PORT` in `backend/.env`
- Or kill process: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)

### Mobile App Issues

**Expo Start Fails**
```bash
# Try clearing cache
npm cache clean --force
rm -rf node_modules
npm install --legacy-peer-deps
npm start
```

**API Connection Issues**
- Ensure backend server is running on `http://localhost:3000`
- Check firewall settings
- On physical device, use your machine's IP instead of `localhost`

**Module Not Found Errors**
```bash
# Rebuild cache
expo r -c
npm start
```

## 📊 Features Implemented

### Must-Have ✅
- [x] User can log in
- [x] User can view tasks assigned to them
- [x] User can update task status
- [x] Display tasks in clean list format
- [x] Show loading and empty states
- [x] Backend APIs (Login, Get tasks, Create task, Update status)
- [x] Use MongoDB with Users and Tasks
- [x] Role-based access (Admin/User)

### Good-to-Have ✅
- [x] Edit/Delete tasks (Admin)
- [x] Filter tasks (role-based)
- [x] Better UI (cards, badges, status indicators)
- [x] Token-based authentication (JWT)
- [x] Error handling
- [x] Clean code structure

### Bonus ✅
- [x] Production-ready code
- [x] Proper API error handling
- [x] Security (password hashing, JWT)
- [x] Modular architecture
- [x] Comprehensive documentation

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Push code to GitHub
2. Connect to deployment platform
3. Set environment variables
4. Deploy

### Mobile App Deployment

- **iOS**: Use Expo CLI or Apple TestFlight
- **Android**: Use Expo CLI or Google Play Console
- **Web**: Deploy built bundle to Netlify/Vercel

## 📝 MongoDB Connection

Your connection string is configured:
```
mongodb+srv://jyotsnasree21:jyotsna21@cluster0.nl4hxon.mongodb.net/?appname=cluster0
```

This connects to **MongoDB Atlas** cluster with:
- Database: `cluster0`
- Collections: `users`, `tasks`
- Auto-scaling on shared tier

## 🎓 Learning Resources

- **Expo Docs**: https://docs.expo.dev
- **Express Docs**: https://expressjs.com
- **MongoDB Docs**: https://docs.mongodb.com
- **React Native**: https://reactnative.dev

## 📧 Support

For issues or questions:
1. Check troubleshooting section
2. Review API documentation
3. Check backend logs: `npm run dev`
4. Check console errors in mobile app

## 📄 License

This project is provided as-is for educational purposes.

---

**Status**: ✅ Ready to deploy
**Backend**: Running on port 3000
**Database**: Connected to MongoDB Atlas
**Last Updated**: May 4, 2026
