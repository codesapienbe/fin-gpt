import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUser } from './mockData';

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

class AuthService {
  private currentUser: User | null = null;
  private authToken: string | null = null;

  // Initialize auth state from storage
  async init(): Promise<void> {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(USER_DATA_KEY)
      ]);

      if (token && userData) {
        this.authToken = token;
        this.currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // Mock implementation with demo user
      if ((credentials.email === 'demo@example.com' && credentials.password === 'demo123') ||
          (credentials.email === 'demo' && credentials.password === 'demo')) {
        const user = mockUser;
        const token = 'mock-jwt-token';

        await Promise.all([
          AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
          AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
        ]);

        this.currentUser = user;
        this.authToken = token;

        return user;
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_DATA_KEY)
      ]);

      this.currentUser = null;
      this.authToken = null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.authToken && !!this.currentUser;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Get auth token
  getAuthToken(): string | null {
    return this.authToken;
  }

  // Register new user
  async register(userData: Omit<User, 'id'> & { password: string }): Promise<User> {
    try {
      // TODO: Replace with actual API call
      // This is a mock implementation
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.name,
        company: userData.company,
        role: 'user'
      };

      const token = 'mock-jwt-token';

      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
      ]);

      this.currentUser = user;
      this.authToken = token;

      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      // TODO: Replace with actual API call
      // This is a mock implementation
      console.log('Password reset requested for:', email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      // TODO: Replace with actual API call
      // This is a mock implementation
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      console.log('Password changed for:', this.currentUser.email);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService(); 