import { USE_MOCK_BACKEND, apiClient } from './apiClient';
import { storageService } from './storageService';
import { MOCK_USERS, User } from '../constants/mockData';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResult {
  user: Omit<User, 'password'>;
  token: string;
}

function normalizeRole(role: string): User['role'] {
  return role?.toLowerCase() === 'admin' ? 'admin' : 'user';
}

function buildAvatar(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('');
}

function normalizeUser(user: any): Omit<User, 'password'> {
  return {
    _id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role),
    avatar: user.avatar || buildAvatar(user.name || ''),
    createdAt: user.createdAt || new Date().toISOString(),
  };
}

function generateMockToken(userId: string, role: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: userId, role, iat: Date.now(), exp: Date.now() + 86400000 }));
  return `${header}.${payload}.mock_signature`;
}

async function initMockUsers(): Promise<User[]> {
  const stored = await storageService.getUsers<User>();
  if (stored && stored.length > 0) return stored;
  await storageService.saveUsers(MOCK_USERS);
  return MOCK_USERS;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResult> {
    if (!USE_MOCK_BACKEND) {
      const response = await fetch(`${apiClient.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res = await response.json();
      if (!response.ok) throw new Error(res.message || 'Login failed');

      const token = res.token;
      const user = normalizeUser(res.user);

      apiClient.setToken(token);
      await storageService.saveAuthToken(token);
      await storageService.saveCurrentUser(user);

      return { user, token };
    }

    await new Promise(r => setTimeout(r, 800));
    const users = await initMockUsers();
    const user = users.find(
      u => u.email.toLowerCase() === payload.email.toLowerCase() && u.password === payload.password
    );
    if (!user) throw new Error('Invalid email or password');

    const { password: _omit, ...safeUser } = user;
    const token = generateMockToken(user._id, user.role);

    apiClient.setToken(token);
    await storageService.saveAuthToken(token);
    await storageService.saveCurrentUser(safeUser);

    return { user: safeUser, token };
  },

  async logout(): Promise<void> {
    apiClient.setToken(null);
    await storageService.removeAuthToken();
    await storageService.removeCurrentUser();
  },

  async restoreSession(): Promise<AuthResult | null> {
    const token = await storageService.getAuthToken();
    const storedUser = await storageService.getCurrentUser<any>();
    const user = storedUser ? normalizeUser(storedUser) : null;
    if (!token || !user) return null;
    apiClient.setToken(token);
    return { user, token };
  },

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    if (!USE_MOCK_BACKEND) {
      const res = await apiClient.get<any[]>('/tasks/admin/users');
      return (res.users || res.data || []).map(normalizeUser);
    }
    const users = await initMockUsers();
    return users
      .filter(user => user.role !== 'admin')
      .map(({ password: _omit, ...u }) => u);
  },
};
