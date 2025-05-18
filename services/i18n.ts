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
      'dashboard': 'Home',
      'invoices': 'Invoices',
      'myInvoices': 'My Invoices',
      'search': 'Search',
      'searchInvoices': 'Search Invoices',
      'settings': 'Settings',
      'home': 'Home',
      'assistant': 'AI Assistant',
      'financialDashboard': 'Financial Dashboard',
      'actions': 'Actions',
      'scan': 'Scan',
      'scanInvoice': 'Scan Invoice QR Code',
    
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
      
      // Invoice tab
      'invoiceNumber': 'Invoice #',
      'client': 'Client',
      'date': 'Date',
      'amount': 'Amount',
      'noResultsFound': 'No Results Found',
      'noInvoicesMatchingQuery': 'We couldn\'t find any invoices matching "{query}"',
      'createFirstInvoice': 'Upload your first invoice by tapping the + button',
      'uploadInvoice': 'Upload Invoice',
      'error': 'Error',
      'success': 'Success',
      'failedToLoadInvoices': 'Failed to load invoices',
      'failedToSaveInvoice': 'Failed to save invoice',
      'invoiceUploadedSuccessfully': 'Invoice uploaded successfully',
      
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
      
      // Assistant
      'assistantWelcome': 'Hello! I\'m your financial assistant. How can I help you today with your invoices?',
      'assistantInvoiceResponse': 'I can help you search for invoices, scan invoice QR codes, or create new invoice records. Would you like me to guide you through any of these processes?',
      'assistantDashboardResponse': 'The financial dashboard provides an overview of your invoice status, monthly revenue trends, and key financial metrics. You can access it from the Dashboard tab.',
      'assistantDefaultResponse': 'I\'m here to help with your invoicing needs. You can ask me about creating, finding, or managing invoices, or get insights about your financial data.',
      'askAssistant': 'Ask me anything about your invoices...',
      
      // Actions
      'actionsHelpText': 'Tap the button below to search for invoices or scan invoice QR codes',
      
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
      'dashboard': 'Home',
      'invoices': 'Facturen',
      'myInvoices': 'Mijn Facturen',
      'search': 'Zoeken',
      'searchInvoices': 'Facturen Zoeken',
      'settings': 'Instellingen',
      'home': 'Home',
      'assistant': 'AI Assistent',
      'financialDashboard': 'Financieel Dashboard',
      'actions': 'Acties',
      'scan': 'Scannen',
      'scanInvoice': 'Scan Factuur QR-code',
      
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
      
      // Invoice tab
      'invoiceNumber': 'Factuurnr.',
      'client': 'Klant',
      'date': 'Datum',
      'amount': 'Bedrag',
      'noResultsFound': 'Geen Resultaten Gevonden',
      'noInvoicesMatchingQuery': 'We konden geen facturen vinden die overeenkomen met "{query}"',
      'createFirstInvoice': 'Upload je eerste factuur door op de + knop te tikken',
      'uploadInvoice': 'Factuur Uploaden',
      'error': 'Fout',
      'success': 'Succes',
      'failedToLoadInvoices': 'Kon facturen niet laden',
      'failedToSaveInvoice': 'Kon factuur niet opslaan',
      'invoiceUploadedSuccessfully': 'Factuur succesvol geüpload',
      
      // Assistant
      'assistantWelcome': 'Hallo! Ik ben je financiële assistent. Hoe kan ik je vandaag helpen met je facturen?',
      'assistantInvoiceResponse': 'Ik kan je helpen bij het zoeken naar facturen, het scannen van factuur QR-codes of het maken van nieuwe factuurrecords. Wil je dat ik je door een van deze processen leid?',
      'assistantDashboardResponse': 'Het financiële dashboard geeft een overzicht van je factuurstatus, maandelijkse omzettrends en belangrijke financiële gegevens. Je kunt het bekijken via het Dashboard-tabblad.',
      'assistantDefaultResponse': 'Ik ben er om je te helpen met je factureringsbehoeften. Je kunt me vragen stellen over het maken, vinden of beheren van facturen, of inzichten krijgen over je financiële gegevens.',
      'askAssistant': 'Vraag me iets over je facturen...',
      
      // Actions
      'actionsHelpText': 'Tik op de knop hieronder om facturen te zoeken of factuur QR-codes te scannen',
      
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
      'dashboard': 'Accueil',
      'invoices': 'Factures',
      'myInvoices': 'Mes Factures',
      'search': 'Rechercher',
      'searchInvoices': 'Rechercher des Factures',
      'settings': 'Paramètres',
      'home': 'Accueil',
      'assistant': 'Assistant IA',
      'financialDashboard': 'Tableau de Bord Financier',
      'actions': 'Actions',
      'scan': 'Scanner',
      'scanInvoice': 'Scanner le Code QR de la Facture',
      
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
      
      // Invoice tab
      'invoiceNumber': 'Facture n°',
      'client': 'Client',
      'date': 'Date',
      'amount': 'Montant',
      'noResultsFound': 'Aucun Résultat Trouvé',
      'noInvoicesMatchingQuery': 'Nous n\'avons trouvé aucune facture correspondant à "{query}"',
      'createFirstInvoice': 'Téléchargez votre première facture en appuyant sur le bouton +',
      'uploadInvoice': 'Télécharger une Facture',
      'error': 'Erreur',
      'success': 'Succès',
      'failedToLoadInvoices': 'Échec du chargement des factures',
      'failedToSaveInvoice': 'Échec de l\'enregistrement de la facture',
      'invoiceUploadedSuccessfully': 'Facture téléchargée avec succès',
      
      // Assistant
      'assistantWelcome': 'Bonjour! Je suis votre assistant financier. Comment puis-je vous aider aujourd\'hui avec vos factures?',
      'assistantInvoiceResponse': 'Je peux vous aider à rechercher des factures, à scanner des codes QR de facture ou à créer de nouveaux enregistrements de facture. Souhaitez-vous que je vous guide dans l\'un de ces processus?',
      'assistantDashboardResponse': 'Le tableau de bord financier offre une vue d\'ensemble de l\'état de vos factures, des tendances des revenus mensuels et des indicateurs financiers clés. Vous pouvez y accéder depuis l\'onglet Tableau de bord.',
      'assistantDefaultResponse': 'Je suis là pour vous aider avec vos besoins de facturation. Vous pouvez me poser des questions sur la création, la recherche ou la gestion des factures, ou obtenir des informations sur vos données financières.',
      'askAssistant': 'Posez-moi n\'importe quelle question sur vos factures...',
      
      // Actions
      'actionsHelpText': 'Appuyez sur le bouton ci-dessous pour rechercher des factures ou scanner des codes QR de facture',
      
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
      'dashboard': 'Ana Sayfa',
      'invoices': 'Faturalar',
      'myInvoices': 'Faturalarım',
      'search': 'Ara',
      'searchInvoices': 'Fatura Ara',
      'settings': 'Ayarlar',
      'home': 'Ana Sayfa',
      'assistant': 'Yapay Zeka Asistanı',
      'financialDashboard': 'Finansal Gösterge Paneli',
      'actions': 'İşlemler',
      'scan': 'Tara',
      'scanInvoice': 'Fatura QR Kodunu Tara',
      
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
      
      // Invoice tab
      'invoiceNumber': 'Fatura No',
      'client': 'Müşteri',
      'date': 'Tarih',
      'amount': 'Tutar',
      'noResultsFound': 'Sonuç Bulunamadı',
      'noInvoicesMatchingQuery': '"{query}" ile eşleşen fatura bulamadık',
      'createFirstInvoice': '+ düğmesine dokunarak ilk faturanızı yükleyin',
      'uploadInvoice': 'Fatura Yükle',
      'error': 'Hata',
      'success': 'Başarılı',
      'failedToLoadInvoices': 'Faturalar yüklenemedi',
      'failedToSaveInvoice': 'Fatura kaydedilemedi',
      'invoiceUploadedSuccessfully': 'Fatura başarıyla yüklendi',
      
      // Assistant
      'assistantWelcome': 'Merhaba! Ben senin finans asistanınım. Bugün faturalarınla ilgili nasıl yardımcı olabilirim?',
      'assistantInvoiceResponse': 'Fatura aramanıza, fatura QR kodlarını taramanıza veya yeni fatura kayıtları oluşturmanıza yardımcı olabilirim. Bu işlemlerden herhangi birinde size rehberlik etmemi ister misiniz?',
      'assistantDashboardResponse': 'Finansal gösterge paneli, fatura durumunuzun, aylık gelir eğilimlerinizin ve önemli finansal ölçütlerin genel bir görünümünü sunar. Buna Gösterge Paneli sekmesinden erişebilirsiniz.',
      'assistantDefaultResponse': 'Faturalama ihtiyaçlarınızda size yardımcı olmak için buradayım. Bana fatura oluşturma, bulma veya yönetme hakkında sorular sorabilir veya mali verileriniz hakkında bilgi alabilirsiniz.',
      'askAssistant': 'Faturalarınız hakkında herhangi bir şey sorun...',
      
      // Actions
      'actionsHelpText': 'Fatura aramak veya fatura QR kodlarını taramak için aşağıdaki düğmeye dokunun',
      
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