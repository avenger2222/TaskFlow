import Task from '../models/Task.js';
import User from '../models/User.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, tags } = req.body;

    if (!title || !assignedTo) {
      return res.status(400).json({ success: false, message: 'Title and assignedTo are required' });
    }

    const task = new Task({
      title,
      description,
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      tags: Array.isArray(tags) ? tags : [],
      assignedTo,
      createdBy: req.userId,
    });

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(201).json({ success: true, message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create task', error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const query = req.userRole === 'Admin' ? {} : { assignedTo: req.userId };

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, message: 'Tasks retrieved', tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tasks', error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (req.userRole !== 'Admin' && task.assignedTo._id.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, message: 'Task retrieved', task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch task', error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (req.userRole !== 'Admin' && task.assignedTo.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    task.status = status;
    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(200).json({ success: true, message: 'Task updated', task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task', error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, assignedTo, dueDate, tags } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (req.userRole !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (assignedTo) task.assignedTo = assignedTo;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (tags !== undefined) task.tags = Array.isArray(tags) ? tags : [];

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(200).json({ success: true, message: 'Task updated', task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task', error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.userRole !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete task', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    if (req.userRole !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const users = await User.find({ role: 'User' }).select('-password').sort({ name: 1 });
    res.status(200).json({ success: true, message: 'Users retrieved', users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};
