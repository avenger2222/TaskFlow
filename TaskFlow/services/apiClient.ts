// Powered by OnSpace.AI
// ─────────────────────────────────────────────────────────────────────────────
// API CLIENT — To connect to a real Node.js + Express backend:
//   1. Set BASE_URL to your server URL (e.g. http://your-server.com/api)
//   2. Set USE_MOCK_BACKEND = false
//   3. All service functions will automatically use real HTTP calls
// ─────────────────────────────────────────────────────────────────────────────

const RAW_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
export const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');
export const USE_MOCK_BACKEND = false; // ← Set to false when backend is ready

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
  task?: unknown;
  tasks?: unknown[];
  user?: unknown;
  users?: unknown[];
}

class ApiClient {
  public baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  async post<T>(endpoint: string, body: object): Promise<ApiResponse<T>> {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  async put<T>(endpoint: string, body: object): Promise<ApiResponse<T>> {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  async patch<T>(endpoint: string, body: object): Promise<ApiResponse<T>> {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  }
}

export const apiClient = new ApiClient(BASE_URL);
