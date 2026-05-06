// Powered by OnSpace.AI
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { taskService, CreateTaskPayload, UpdateTaskPayload } from '../services/taskService';
import { Task } from '../constants/mockData';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (userId: string, role: string) => Promise<void>;
  createTask: (payload: CreateTaskPayload, createdBy: string, createdByName: string) => Promise<Task>;
  updateTask: (taskId: string, updates: UpdateTaskPayload) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
  getTaskById: (taskId: string) => Task | undefined;
  clearError: () => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (userId: string, role: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks(userId, role);
      setTasks(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(
    async (payload: CreateTaskPayload, createdBy: string, createdByName: string): Promise<Task> => {
      const newTask = await taskService.createTask(payload, createdBy, createdByName);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    },
    []
  );

  const updateTask = useCallback(async (taskId: string, updates: UpdateTaskPayload): Promise<Task> => {
    const updated = await taskService.updateTask(taskId, updates);
    setTasks(prev => prev.map(t => (t._id === taskId ? updated : t)));
    return updated;
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    await taskService.deleteTask(taskId);
    setTasks(prev => prev.filter(t => t._id !== taskId));
  }, []);

  const getTaskById = useCallback(
    (taskId: string) => tasks.find(t => t._id === taskId),
    [tasks]
  );

  const clearError = useCallback(() => setError(null), []);

  return (
    <TaskContext.Provider
      value={{ tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask, getTaskById, clearError }}
    >
      {children}
    </TaskContext.Provider>
  );
}
