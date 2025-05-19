import AsyncStorage from '@react-native-async-storage/async-storage';
import { Currency } from './i18n';

// Storage keys
const STORAGE_KEYS = {
  CURRENCY: 'user-currency',
  LANGUAGE: 'user-language',
  THEME: 'user-theme',
  RECENT_INVOICES: 'recent-invoices',
  FAVORITE_INVOICES: 'favorite-invoices',
  DEFAULT_INVOICE_STATUS: 'default-invoice-status',
  NOTIFICATION_PREFERENCES: 'notification-preferences',
  RECENT_SEARCHES: 'recent-searches',
  LAST_VIEWED_INVOICE: 'last-viewed-invoice',
  USER_PREFERENCES: 'user-preferences',
} as const;

// Default values
const DEFAULT_SETTINGS = {
  currency: 'EUR' as Currency,
  language: 'en-US',
  theme: 'light',
  defaultInvoiceStatus: 'pending',
  notificationPreferences: {
    email: true,
    push: true,
    sms: false,
  },
} as const;

export interface UserPreferences {
  currency: Currency;
  language: string;
  theme: 'light' | 'dark' | 'system';
  defaultInvoiceStatus: 'paid' | 'pending' | 'overdue';
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface RecentInvoice {
  id: string;
  lastViewed: number;
}

class SettingsService {
  // Get all user preferences
  static async getUserPreferences(): Promise<UserPreferences> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return DEFAULT_SETTINGS;
    }
  }

  // Save all user preferences
  static async saveUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const current = await this.getUserPreferences();
      const updated = { ...current, ...preferences };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  // Get recent invoices
  static async getRecentInvoices(): Promise<RecentInvoice[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_INVOICES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting recent invoices:', error);
      return [];
    }
  }

  // Add invoice to recent list
  static async addRecentInvoice(invoiceId: string): Promise<void> {
    try {
      const recent = await this.getRecentInvoices();
      const updated = [
        { id: invoiceId, lastViewed: Date.now() },
        ...recent.filter(inv => inv.id !== invoiceId)
      ].slice(0, 10); // Keep only last 10
      await AsyncStorage.setItem(STORAGE_KEYS.RECENT_INVOICES, JSON.stringify(updated));
    } catch (error) {
      console.error('Error adding recent invoice:', error);
    }
  }

  // Get favorite invoices
  static async getFavoriteInvoices(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITE_INVOICES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting favorite invoices:', error);
      return [];
    }
  }

  // Toggle favorite invoice
  static async toggleFavoriteInvoice(invoiceId: string): Promise<void> {
    try {
      const favorites = await this.getFavoriteInvoices();
      const updated = favorites.includes(invoiceId)
        ? favorites.filter(id => id !== invoiceId)
        : [...favorites, invoiceId];
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_INVOICES, JSON.stringify(updated));
    } catch (error) {
      console.error('Error toggling favorite invoice:', error);
    }
  }

  // Get recent searches
  static async getRecentSearches(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting recent searches:', error);
      return [];
    }
  }

  // Add search to recent searches
  static async addRecentSearch(search: string): Promise<void> {
    try {
      const searches = await this.getRecentSearches();
      const updated = [search, ...searches.filter(s => s !== search)].slice(0, 5); // Keep only last 5
      await AsyncStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
    } catch (error) {
      console.error('Error adding recent search:', error);
    }
  }

  // Get last viewed invoice
  static async getLastViewedInvoice(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_VIEWED_INVOICE);
    } catch (error) {
      console.error('Error getting last viewed invoice:', error);
      return null;
    }
  }

  // Set last viewed invoice
  static async setLastViewedInvoice(invoiceId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_VIEWED_INVOICE, invoiceId);
    } catch (error) {
      console.error('Error setting last viewed invoice:', error);
    }
  }

  // Clear all settings (for testing or reset)
  static async clearAllSettings(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing settings:', error);
    }
  }
}

export default SettingsService; 