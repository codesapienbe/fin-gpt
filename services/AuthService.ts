import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth-token',
  USER_DATA: 'user-data',
} as const;

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

class AuthService {
  private static instance: AuthService;
  private currentUser: UserData | null = null;
  private authToken: string | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async initialize(): Promise<void> {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
      ]);

      if (token && userData) {
        this.authToken = token;
        this.currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error initializing auth service:', error);
      await this.logout();
    }
  }

  async login(email: string, password: string): Promise<UserData> {
    try {
      // TODO: Replace with actual API call
      // This is a mock implementation
      if (email === 'demo@example.com' && password === 'password') {
        const userData: UserData = {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
          role: 'user',
        };
        const token = 'mock-jwt-token';

        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
          AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData)),
        ]);

        this.authToken = token;
        this.currentUser = userData;
        return userData;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);
      this.authToken = null;
      this.currentUser = null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.authToken && !!this.currentUser;
  }

  getCurrentUser(): UserData | null {
    return this.currentUser;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }
}

export default AuthService.getInstance(); 