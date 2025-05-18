import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export type Language = 'en-US' | 'nl-BE' | 'fr-BE' | 'tr-TR';
export type Currency = 'EUR' | 'USD' | 'TRY';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  defaultCurrency: Currency;
}

export interface CurrencyOption {
  code: Currency;
  symbol: string;
  name: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English',
    defaultCurrency: 'USD'
  },
  {
    code: 'nl-BE',
    name: 'Nederlands (BE)',
    nativeName: 'Nederlands',
    defaultCurrency: 'EUR'
  },
  {
    code: 'fr-BE',
    name: 'Français (BE)',
    nativeName: 'Français',
    defaultCurrency: 'EUR'
  },
  {
    code: 'tr-TR',
    name: 'Turkish (TR)',
    nativeName: 'Türkçe',
    defaultCurrency: 'TRY'
  }
];

export const CURRENCIES: CurrencyOption[] = [
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro'
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar'
  },
  {
    code: 'TRY',
    symbol: '₺',
    name: 'Turkish Lira'
  }
];

// Default values
const DEFAULT_LANGUAGE: Language = 'en-US';
const DEFAULT_CURRENCY: Currency = 'EUR';

// Storage keys
const LANGUAGE_STORAGE_KEY = 'user-language';
const CURRENCY_STORAGE_KEY = 'user-currency';

// This function returns the language configuration for a given language code
export const getLanguageConfig = (langCode: Language): LanguageOption => {
  return LANGUAGES.find(lang => lang.code === langCode) || LANGUAGES.find(lang => lang.code === DEFAULT_LANGUAGE)!;
};

// This function returns the currency configuration for a given currency code
export const getCurrencyConfig = (currencyCode: Currency): CurrencyOption => {
  return CURRENCIES.find(currency => currency.code === currencyCode) || CURRENCIES.find(currency => currency.code === DEFAULT_CURRENCY)!;
};

// Get the currently selected currency
export const getCurrentCurrency = async (): Promise<Currency> => {
  try {
    const storedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
    return (storedCurrency as Currency) || DEFAULT_CURRENCY;
  } catch (error) {
    console.error('Error getting currency preference:', error);
    return DEFAULT_CURRENCY;
  }
};

// Set the current currency
export const setCurrentCurrency = async (currencyCode: Currency): Promise<void> => {
  try {
    await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, currencyCode);
  } catch (error) {
    console.error('Error setting currency preference:', error);
  }
};

// Initialize the currency preference
export const initCurrencyPreference = async (): Promise<Currency> => {
  try {
    const storedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
    
    if (!storedCurrency) {
      // If no currency is set, use the default currency (EUR)
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, DEFAULT_CURRENCY);
      return DEFAULT_CURRENCY;
    }
    
    return storedCurrency as Currency;
  } catch (error) {
    console.error('Error initializing currency preference:', error);
    return DEFAULT_CURRENCY;
  }
};

// Resources for translations
const resources = {
  'en-US': {
    translation: {
      // Navigation
      'dashboard': 'Financial Dashboard',
      'invoices': 'Invoices',
      'myInvoices': 'My Invoices',
      'search': 'Search',
      'searchInvoices': 'Search Invoices',
      'settings': 'Settings',
    
      // Dashboard
      'totalInvoices': 'Total Invoices',
      'totalAmount': 'Total Amount',
      'avgInvoice': 'Average Invoice',
      'paid': 'Paid',
      'pending': 'Pending',
      'overdue': 'Overdue',
      'monthlyRevenue': 'Monthly Revenue',
      'invoiceStatus': 'Invoice Status',
      'latestInvoices': 'Latest Invoices',
      'viewAll': 'View All',
      'noInvoicesYet': 'No invoices yet',
      'createInvoice': 'Create Invoice',
      'loadingDashboard': 'Loading dashboard...',
      
      // Invoice table
      'invoiceNumber': 'Invoice #',
      'client': 'Client',
      'date': 'Date',
      'amount': 'Amount',
      
      // Language and Currency Settings
      'language': 'Language',
      'languageDescription': 'Select your preferred language',
      'currency': 'Currency',
      'currencyDescription': 'Select your preferred currency for all financial transactions',
      'currencyInfo': 'Currency Information',
      'currencyInfoDescription': 'Currency is used for all financial calculations and displays throughout the app',
      'currencySettings': 'Currency Settings',
      
      // Theme Settings
      'theme': 'Theme',
      'themeDescription': 'Change app colors and appearance',
      'text': 'Text',
      'textDescription': 'Adjust text size, font, and spacing',
      'useDynamicColors': 'Use Dynamic Colors',
      'dynamicColorsDescription': 'Automatically adjust colors based on your device',
      
      // Months
      'jan': 'Jan',
      'feb': 'Feb',
      'mar': 'Mar',
      'apr': 'Apr',
      'may': 'May',
      'jun': 'Jun',
      'jul': 'Jul',
      'aug': 'Aug',
      'sep': 'Sep',
      'oct': 'Oct',
      'nov': 'Nov',
      'dec': 'Dec',
    }
  },
  'nl-BE': {
    translation: {
      // Navigation
      'dashboard': 'Financieel Dashboard',
      'invoices': 'Facturen',
      'myInvoices': 'Mijn Facturen',
      'search': 'Zoeken',
      'searchInvoices': 'Facturen Zoeken',
      'settings': 'Instellingen',
    
      // Dashboard
      'totalInvoices': 'Totaal Facturen',
      'totalAmount': 'Totaalbedrag',
      'avgInvoice': 'Gemiddelde Factuur',
      'paid': 'Betaald',
      'pending': 'In behandeling',
      'overdue': 'Achterstallig',
      'monthlyRevenue': 'Maandelijkse omzet',
      'invoiceStatus': 'Factuurstatus',
      'latestInvoices': 'Laatste Facturen',
      'viewAll': 'Bekijk alles',
      'noInvoicesYet': 'Nog geen facturen',
      'createInvoice': 'Factuur Aanmaken',
      'loadingDashboard': 'Dashboard laden...',
      
      // Invoice table
      'invoiceNumber': 'Factuurnr.',
      'client': 'Klant',
      'date': 'Datum',
      'amount': 'Bedrag',
      
      // Months
      'jan': 'Jan',
      'feb': 'Feb',
      'mar': 'Mrt',
      'apr': 'Apr',
      'may': 'Mei',
      'jun': 'Jun',
      'jul': 'Jul',
      'aug': 'Aug',
      'sep': 'Sep',
      'oct': 'Okt',
      'nov': 'Nov',
      'dec': 'Dec',
    }
  },
  'fr-BE': {
    translation: {
      // Navigation
      'dashboard': 'Tableau de bord financier',
      'invoices': 'Factures',
      'myInvoices': 'Mes Factures',
      'search': 'Rechercher',
      'searchInvoices': 'Rechercher des Factures',
      'settings': 'Paramètres',
    
      // Dashboard
      'totalInvoices': 'Total des factures',
      'totalAmount': 'Montant total',
      'avgInvoice': 'Facture moyenne',
      'paid': 'Payée',
      'pending': 'En attente',
      'overdue': 'En retard',
      'monthlyRevenue': 'Revenu mensuel',
      'invoiceStatus': 'État des factures',
      'latestInvoices': 'Dernières factures',
      'viewAll': 'Voir tout',
      'noInvoicesYet': 'Pas encore de factures',
      'createInvoice': 'Créer une facture',
      'loadingDashboard': 'Chargement du tableau de bord...',
      
      // Invoice table
      'invoiceNumber': 'Facture n°',
      'client': 'Client',
      'date': 'Date',
      'amount': 'Montant',
      
      // Months
      'jan': 'Jan',
      'feb': 'Fév',
      'mar': 'Mar',
      'apr': 'Avr',
      'may': 'Mai',
      'jun': 'Juin',
      'jul': 'Juil',
      'aug': 'Août',
      'sep': 'Sep',
      'oct': 'Oct',
      'nov': 'Nov',
      'dec': 'Déc',
    }
  },
  'tr-TR': {
    translation: {
      // Navigation
      'dashboard': 'Finansal Kontrol Paneli',
      'invoices': 'Faturalar',
      'myInvoices': 'Faturalarım',
      'search': 'Arama',
      'searchInvoices': 'Fatura Ara',
      'settings': 'Ayarlar',
    
      // Dashboard
      'totalInvoices': 'Toplam Fatura',
      'totalAmount': 'Toplam Tutar',
      'avgInvoice': 'Ortalama Fatura',
      'paid': 'Ödenmiş',
      'pending': 'Beklemede',
      'overdue': 'Gecikmiş',
      'monthlyRevenue': 'Aylık Gelir',
      'invoiceStatus': 'Fatura Durumu',
      'latestInvoices': 'Son Faturalar',
      'viewAll': 'Tümünü Gör',
      'noInvoicesYet': 'Henüz fatura yok',
      'createInvoice': 'Fatura Oluştur',
      'loadingDashboard': 'Kontrol paneli yükleniyor...',
      
      // Invoice table
      'invoiceNumber': 'Fatura No',
      'client': 'Müşteri',
      'date': 'Tarih',
      'amount': 'Tutar',
      
      // Months
      'jan': 'Oca',
      'feb': 'Şub',
      'mar': 'Mar',
      'apr': 'Nis',
      'may': 'May',
      'jun': 'Haz',
      'jul': 'Tem',
      'aug': 'Ağu',
      'sep': 'Eyl',
      'oct': 'Eki',
      'nov': 'Kas',
      'dec': 'Ara',
    }
  }
};

// Format currency based on a specific currency code rather than language
export const formatCurrency = async (amount: number, currencyCode?: Currency): Promise<string> => {
  const currency = currencyCode || await getCurrentCurrency();
  const currencyConfig = getCurrencyConfig(currency);
  
  // Find a suitable locale based on the currency
  let locale = 'en-US';
  if (currency === 'EUR') locale = 'nl-BE';
  if (currency === 'TRY') locale = 'tr-TR';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get translated month names
export const getLocalizedMonths = (languageCode: Language = DEFAULT_LANGUAGE): string[] => {
  const translationPrefix = 'jan feb mar apr may jun jul aug sep oct nov dec'.split(' ');
  
  return translationPrefix.map(month => 
    i18n.t(month, { lng: languageCode })
  );
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false // React already protects from XSS
    }
  });

export default i18n; 