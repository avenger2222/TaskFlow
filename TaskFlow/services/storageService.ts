// Powered by OnSpace.AI
// AsyncStorage wrapper — mirrors how real MongoDB persistence works
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN: '@taskmanager/auth_token',
  CURRENT_USER: '@taskmanager/current_user',
  TASKS: '@taskmanager/tasks',
  USERS: '@taskmanager/users',
} as const;

export const storageService = {
  // Auth
  async saveAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
  },

  async getAuthToken(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.AUTH_TOKEN);
  },

  async removeAuthToken(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
  },

  // Current user
  async saveCurrentUser(user: object): Promise<void> {
    await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  },

  async getCurrentUser<T>(): Promise<T | null> {
    const raw = await AsyncStorage.getItem(KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  },

  async removeCurrentUser(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.CURRENT_USER);
  },

  // Tasks
  async saveTasks(tasks: object[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  async getTasks<T>(): Promise<T[] | null> {
    const raw = await AsyncStorage.getItem(KEYS.TASKS);
    return raw ? JSON.parse(raw) : null;
  },

  // Users
  async saveUsers(users: object[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  async getUsers<T>(): Promise<T[] | null> {
    const raw = await AsyncStorage.getItem(KEYS.USERS);
    return raw ? JSON.parse(raw) : null;
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  },
};
