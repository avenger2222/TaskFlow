import { USE_MOCK_BACKEND, apiClient } from './apiClient';
import { MOCK_TASKS, Task } from '../constants/mockData';
import { storageService } from './storageService';

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: Task['priority'];
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  tags: string[];
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  assignedTo?: string;
  assignedToName?: string;
  dueDate?: string;
  tags?: string[];
}

function mapPriorityToApi(priority: Task['priority']): 'Low' | 'Medium' | 'High' {
  return priority === 'high' ? 'High' : priority === 'low' ? 'Low' : 'Medium';
}

function mapStatusToApi(status: Task['status']): 'Pending' | 'In Progress' | 'Completed' {
  if (status === 'in_progress') return 'In Progress';
  if (status === 'completed') return 'Completed';
  return 'Pending';
}

function mapPriorityFromApi(priority?: string): Task['priority'] {
  const value = priority?.toLowerCase();
  if (value === 'high') return 'high';
  if (value === 'low') return 'low';
  return 'medium';
}

function mapStatusFromApi(status?: string): Task['status'] {
  if (status === 'In Progress') return 'in_progress';
  if (status === 'Completed') return 'completed';
  return 'pending';
}

function mapTaskFromApi(task: any): Task {
  const assignedUser = typeof task.assignedTo === 'object' ? task.assignedTo : null;
  const createdUser = typeof task.createdBy === 'object' ? task.createdBy : null;

  return {
    _id: task._id,
    title: task.title,
    description: task.description || '',
    status: mapStatusFromApi(task.status),
    priority: mapPriorityFromApi(task.priority),
    assignedTo: assignedUser?._id || task.assignedTo,
    assignedToName: assignedUser?.name || task.assignedToName || 'Unknown User',
    createdBy: createdUser?._id || task.createdBy,
    createdByName: createdUser?.name || task.createdByName || 'Unknown User',
    dueDate: task.dueDate || task.createdAt || new Date().toISOString(),
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    tags: Array.isArray(task.tags) ? task.tags : [],
  };
}

async function initMockTasks(): Promise<Task[]> {
  const stored = await storageService.getTasks<Task>();
  if (stored && stored.length > 0) return stored;
  await storageService.saveTasks(MOCK_TASKS);
  return [...MOCK_TASKS];
}

function generateId(): string {
  return 'task_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export const taskService = {
  async getTasks(userId: string, role: string): Promise<Task[]> {
    if (!USE_MOCK_BACKEND) {
      const res = await apiClient.get<any[]>('/tasks');
      return (res.tasks || res.data || []).map(mapTaskFromApi);
    }

    await new Promise(r => setTimeout(r, 500));
    const tasks = await initMockTasks();
    if (role === 'admin') return tasks;
    return tasks.filter(t => t.assignedTo === userId);
  },

  async getTaskById(taskId: string): Promise<Task | null> {
    if (!USE_MOCK_BACKEND) {
      const res = await apiClient.get<any>(`/tasks/${taskId}`);
      return res.task ? mapTaskFromApi(res.task) : null;
    }

    const tasks = await initMockTasks();
    return tasks.find(t => t._id === taskId) || null;
  },

  async createTask(payload: CreateTaskPayload, createdBy: string, createdByName: string): Promise<Task> {
    if (!USE_MOCK_BACKEND) {
      const res = await apiClient.post<any>('/tasks', {
        title: payload.title,
        description: payload.description,
        priority: mapPriorityToApi(payload.priority),
        assignedTo: payload.assignedTo,
        dueDate: payload.dueDate,
        tags: payload.tags,
      });
      return mapTaskFromApi(res.task);
    }

    await new Promise(r => setTimeout(r, 600));
    const tasks = await initMockTasks();
    const newTask: Task = {
      _id: generateId(),
      ...payload,
      createdBy,
      createdByName,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    await storageService.saveTasks(tasks);
    return newTask;
  },

  async updateTask(taskId: string, updates: UpdateTaskPayload): Promise<Task> {
    if (!USE_MOCK_BACKEND) {
      if (updates.status && Object.keys(updates).length === 1) {
        const res = await apiClient.patch<any>(`/tasks/${taskId}/status`, {
          status: mapStatusToApi(updates.status),
        });
        return mapTaskFromApi(res.task);
      }

      const body: Record<string, unknown> = {
        ...updates,
        status: updates.status ? mapStatusToApi(updates.status) : undefined,
        priority: updates.priority ? mapPriorityToApi(updates.priority) : undefined,
      };
      const res = await apiClient.put<any>(`/tasks/${taskId}`, body);
      return mapTaskFromApi(res.task);
    }

    await new Promise(r => setTimeout(r, 400));
    const tasks = await initMockTasks();
    const idx = tasks.findIndex(t => t._id === taskId);
    if (idx === -1) throw new Error('Task not found');

    tasks[idx] = { ...tasks[idx], ...updates, updatedAt: new Date().toISOString() };
    await storageService.saveTasks(tasks);
    return tasks[idx];
  },

  async deleteTask(taskId: string): Promise<void> {
    if (!USE_MOCK_BACKEND) {
      await apiClient.delete(`/tasks/${taskId}`);
      return;
    }

    await new Promise(r => setTimeout(r, 400));
    const tasks = await initMockTasks();
    const filtered = tasks.filter(t => t._id !== taskId);
    await storageService.saveTasks(filtered);
  },
};
