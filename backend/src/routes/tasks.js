import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getAllUsers,
} from '../controllers/taskController.js';

const router = express.Router();

// All task routes require authentication
router.use(verifyToken);

// Get all users (admin only)
router.get('/admin/users', verifyAdmin, getAllUsers);

// Get all tasks (admin sees all, user sees only their own)
router.get('/', getTasks);

// Get single task
router.get('/:id', getTaskById);

// Create task (admin only)
router.post('/', verifyAdmin, createTask);

// Update task status (user can update their own, admin can update any)
router.patch('/:id/status', updateTaskStatus);

// Update task (admin only)
router.put('/:id', verifyAdmin, updateTask);

// Delete task (admin only)
router.delete('/:id', verifyAdmin, deleteTask);

export default router;
