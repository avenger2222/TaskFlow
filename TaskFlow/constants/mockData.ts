// Powered by OnSpace.AI
// Mock data that mirrors MongoDB document structure
// Replace with real API calls by updating services/apiClient.ts BASE_URL

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string; // In real app, never stored client-side
  role: 'admin' | 'user';
  avatar: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string; // User _id
  assignedToName: string;
  createdBy: string; // User _id
  createdByName: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export const MOCK_USERS: User[] = [
  {
    _id: 'user_admin_001',
    name: 'Alex Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'AA',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'user_002',
    name: 'Jordan Smith',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    avatar: 'JS',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'user_003',
    name: 'Sam Taylor',
    email: 'sam@example.com',
    password: 'sam123',
    role: 'user',
    avatar: 'ST',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_TASKS: Task[] = [
  {
    _id: 'task_001',
    title: 'Design the new dashboard layout',
    description: 'Create wireframes and mockups for the updated dashboard. Focus on clean UX and mobile-first approach.',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'user_002',
    assignedToName: 'Jordan Smith',
    createdBy: 'user_admin_001',
    createdByName: 'Alex Admin',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['design', 'UI/UX'],
  },
  {
    _id: 'task_002',
    title: 'Fix authentication bug in login flow',
    description: 'Users are being logged out unexpectedly on session refresh. Investigate token expiry handling.',
    status: 'pending',
    priority: 'high',
    assignedTo: 'user_002',
    assignedToName: 'Jordan Smith',
    createdBy: 'user_admin_001',
    createdByName: 'Alex Admin',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['bug', 'auth'],
  },
  {
    _id: 'task_003',
    title: 'Write unit tests for API endpoints',
    description: 'Cover all REST endpoints with Jest tests. Aim for 80% coverage minimum.',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'user_003',
    assignedToName: 'Sam Taylor',
    createdBy: 'user_admin_001',
    createdByName: 'Alex Admin',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['testing', 'backend'],
  },
  {
    _id: 'task_004',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment to staging.',
    status: 'completed',
    priority: 'medium',
    assignedTo: 'user_003',
    assignedToName: 'Sam Taylor',
    createdBy: 'user_admin_001',
    createdByName: 'Alex Admin',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['devops', 'CI/CD'],
  },
  {
    _id: 'task_005',
    title: 'Database schema optimization',
    description: 'Review and optimize MongoDB indexes for better query performance on task collections.',
    status: 'pending',
    priority: 'low',
    assignedTo: 'user_002',
    assignedToName: 'Jordan Smith',
    createdBy: 'user_admin_001',
    createdByName: 'Alex Admin',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['database', 'performance'],
  },
  {
    _id: 'task_006',
    title: 'Document API endpoints',
    description: 'Write comprehensive Swagger/OpenAPI documentation for all backend endpoints.',
    status: 'completed',
    priority: 'low',
    assignedTo: 'user_003',
    assignedToName: 'Sam Taylor',
    createdBy: 'user_admin_001',
    createdByName: 'Alex Admin',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['documentation'],
  },
];
