import AsyncStorage from '@react-native-async-storage/async-storage';
import { Currency, Language } from './i18n';

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
  PROFILE_INFO: 'profile-info',
  DEFAULT_SAVE_LOCATION: 'default-save-location',
  TEXT_SETTINGS: 'text-settings',
  COLOR_SCHEME: 'color-scheme',
} as const;

// Default values
const DEFAULT_SETTINGS = {
  currency: 'EUR' as Currency,
  language: 'en-US' as Language,
  theme: 'system' as 'light' | 'dark' | 'system',
  defaultInvoiceStatus: 'pending' as 'paid' | 'pending' | 'overdue',
  notificationPreferences: {
    email: true,
    push: true,
    sms: false,
  },
  profileInfo: {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    vatNumber: '',
    website: '',
    timezone: '',
  },
  defaultSaveLocation: 'local',
  textSettings: {
    fontSize: 'medium',
    fontFamily: 'system',
    lineSpacing: 'normal',
  },
  colorScheme: 'blue',
} as const;

export interface UserPreferences {
  currency: Currency;
  language: Language;
  theme: 'light' | 'dark' | 'system';
  defaultInvoiceStatus: 'paid' | 'pending' | 'overdue';
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  profileInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    vatNumber: string;
    website: string;
    timezone: string;
  };
  defaultSaveLocation: 'local' | 'cloud' | 'both';
  textSettings: {
    fontSize: 'small' | 'medium' | 'large';
    fontFamily: 'system' | 'serif' | 'sans-serif';
    lineSpacing: 'compact' | 'normal' | 'spacious';
  };
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
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
      throw error;
    }
  }

  // Get specific setting
  static async getSetting<K extends keyof UserPreferences>(key: K): Promise<UserPreferences[K]> {
    try {
      const preferences = await this.getUserPreferences();
      return preferences[key];
    } catch (error) {
      console.error(`Error getting setting ${key}:`, error);
      return DEFAULT_SETTINGS[key];
    }
  }

  // Save specific setting
  static async saveSetting<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): Promise<void> {
    try {
      const preferences = await this.getUserPreferences();
      preferences[key] = value;
      await this.saveUserPreferences(preferences);
    } catch (error) {
      console.error(`Error saving setting ${key}:`, error);
      throw error;
    }
  }

  // Reset all settings to default
  static async resetSettings(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(DEFAULT_SETTINGS));
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  }

  // Get profile information
  static async getProfileInfo(): Promise<UserPreferences['profileInfo']> {
    return this.getSetting('profileInfo');
  }

  // Save profile information
  static async saveProfileInfo(profileInfo: Partial<UserPreferences['profileInfo']>): Promise<void> {
    const current = await this.getProfileInfo();
    await this.saveSetting('profileInfo', { ...current, ...profileInfo });
  }

  // Get notification preferences
  static async getNotificationPreferences(): Promise<UserPreferences['notificationPreferences']> {
    return this.getSetting('notificationPreferences');
  }

  // Save notification preferences
  static async saveNotificationPreferences(
    preferences: Partial<UserPreferences['notificationPreferences']>
  ): Promise<void> {
    const current = await this.getNotificationPreferences();
    await this.saveSetting('notificationPreferences', { ...current, ...preferences });
  }

  // Get text settings
  static async getTextSettings(): Promise<UserPreferences['textSettings']> {
    return this.getSetting('textSettings');
  }

  // Save text settings
  static async saveTextSettings(
    settings: Partial<UserPreferences['textSettings']>
  ): Promise<void> {
    const current = await this.getTextSettings();
    await this.saveSetting('textSettings', { ...current, ...settings });
  }

  // Get theme
  static async getTheme(): Promise<UserPreferences['theme']> {
    return this.getSetting('theme');
  }

  // Save theme
  static async saveTheme(theme: UserPreferences['theme']): Promise<void> {
    await this.saveSetting('theme', theme);
  }

  // Get color scheme
  static async getColorScheme(): Promise<UserPreferences['colorScheme']> {
    return this.getSetting('colorScheme');
  }

  // Save color scheme
  static async saveColorScheme(colorScheme: UserPreferences['colorScheme']): Promise<void> {
    await this.saveSetting('colorScheme', colorScheme);
  }

  // Get default save location
  static async getDefaultSaveLocation(): Promise<UserPreferences['defaultSaveLocation']> {
    return this.getSetting('defaultSaveLocation');
  }

  // Save default save location
  static async saveDefaultSaveLocation(
    location: UserPreferences['defaultSaveLocation']
  ): Promise<void> {
    await this.saveSetting('defaultSaveLocation', location);
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