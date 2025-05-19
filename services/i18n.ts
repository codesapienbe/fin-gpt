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
      
      // Search
      'searchPlaceholder': 'Search invoices...',
      'searching': 'Searching...',
      'noResultsFound': 'No Results Found',
      'noResultsForQuery': 'We couldn\'t find any invoices matching "{{query}}"',
      'searchInstructions': 'Search by invoice number, client name, date, or amount',
      'recentSearches': 'Recent Searches',
      
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
      
      // Settings
      'account': 'Account',
      'profile': 'Profile',
      'profileDescription': 'Manage your personal information',
      'authentication': 'Authentication',
      'authenticationDescription': 'Configure security settings',
      'invoiceTemplates': 'Invoice Templates',
      'invoiceTemplatesDescription': 'Manage your invoice templates',
      'defaultSaveLocation': 'Default Save Location',
      'defaultSaveLocationDescription': 'Set where invoices are saved',
      'cloudBackup': 'Cloud Backup',
      'cloudBackupDescription': 'Backup your data to the cloud',
      'about': 'About',
      'aboutApp': 'About App',
      'helpSupport': 'Help & Support',
      'helpSupportDescription': 'Get help and contact support',
      'comingSoon': 'Coming Soon',
      'futureFeature': 'This feature will be available in a future update.',
      'saveSettings': 'Save Settings',
      'saving': 'Saving...',
      'resetSettings': 'Reset Settings',
      'resetSettingsDescription': 'Reset all settings to default values',
      'resetSettingsConfirm': 'Are you sure you want to reset all settings?',
      'resetSettingsSuccess': 'Settings have been reset successfully',
      'settingsSaved': 'Settings saved successfully',
      'settingsError': 'Failed to save settings',
      
      // Appearance Settings
      'appearance': 'Appearance',
      'theme': 'Theme',
      'themeDescription': 'Customize app colors and appearance',
      'text': 'Text',
      'textDescription': 'Adjust text size, font, and spacing',
      'themeMode': 'Theme Mode',
      'light': 'Light',
      'dark': 'Dark',
      'system': 'System',
      'colorScheme': 'Color Scheme',
      'blue': 'Blue',
      'green': 'Green',
      'purple': 'Purple',
      'orange': 'Orange',
      'advancedOptions': 'Advanced Options',
      'useDynamicColors': 'Use Dynamic Colors',
      'dynamicColorsDescription': 'Automatically adjust colors based on your device',
      'preview': 'Preview',
      'sampleContent': 'Sample content',
      'button': 'Button',
      
      // Text Settings
      'textSettings': 'Text Settings',
      'textSettingsDescription': 'Customize text appearance including size, font, and spacing',
      'textSize': 'Text Size',
      'small': 'Small',
      'medium': 'Medium',
      'large': 'Large',
      'fontFamily': 'Font Family',
      'default': 'Default',
      'serif': 'Serif',
      'monospace': 'Monospace',
      'lineSpacing': 'Line Spacing',
      'compact': 'Compact',
      'normal': 'Normal',
      'relaxed': 'Relaxed',
      
      // Authentication Settings
      'enableBiometric': 'Enable Biometric Authentication',
      'biometricDescription': 'Use Face ID, Touch ID, or fingerprint to access the app',
      'pinCode': 'PIN Code Authentication',
      'pinCodeDescription': 'Protect the app with a numeric PIN code',
      'changePin': 'Change PIN Code',
      'autoLock': 'Auto-Lock App',
      'autoLockDescription': 'Automatically lock the app after a period of inactivity',
      'autoLockAfter': 'Auto-Lock After',
      'minutes': 'minutes',
      'loginNotifications': 'Login Notifications',
      'loginNotificationsDescription': 'Receive notifications when someone logs into your account',
      'resetAuthentication': 'Reset Authentication Settings',
      'resetAuthenticationConfirm': 'This will reset all authentication settings. Are you sure you want to continue?',
      'resetAuthenticationSuccess': 'Authentication settings have been reset',
      
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
      
      // Authentication
      'forgotPassword': 'Forgot Password',
      'resetPasswordSubtitle': 'Enter your email address and we will send you instructions to reset your password.',
      'resetPassword': 'Reset Password',
      'resetPasswordSuccess': 'Password reset instructions have been sent to your email.',
      'resetPasswordError': 'Failed to send reset instructions. Please try again.',
      'resetPasswordErrorEmptyEmail': 'Please enter your email address.',
      'sending': 'Sending...',
      'backToLogin': 'Back to Login',
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
      
      // Search
      'searchPlaceholder': 'Zoek facturen...',
      'searching': 'Zoeken...',
      'noResultsFound': 'Geen resultaten gevonden',
      'noResultsForQuery': 'We konden geen facturen vinden die overeenkomen met "{{query}}"',
      'searchInstructions': 'Zoek op factuurnummer, klantnaam, datum of bedrag',
      'recentSearches': 'Recente zoekopdrachten',
      
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
      
      // Language and Currency Settings
      'language': 'Taal',
      'languageDescription': 'Selecteer uw voorkeurstaal',
      'currency': 'Valuta',
      'currencyDescription': 'Selecteer uw voorkeursvaluta voor alle financiële transacties',
      'currencyInfo': 'Valutainformatie',
      'currencyInfoDescription': 'Valuta wordt gebruikt voor alle financiële berekeningen en weergaven in de app',
      'currencySettings': 'Valuta-instellingen',
      
      // Settings
      'account': 'Account',
      'profile': 'Profiel',
      'profileDescription': 'Beheer uw persoonlijke informatie',
      'authentication': 'Authenticatie',
      'authenticationDescription': 'Configureer beveiligingsinstellingen',
      'invoiceTemplates': 'Factuursjablonen',
      'invoiceTemplatesDescription': 'Beheer uw factuursjablonen',
      'defaultSaveLocation': 'Standaard opslaglocatie',
      'defaultSaveLocationDescription': 'Stel in waar facturen worden opgeslagen',
      'cloudBackup': 'Cloud Backup',
      'cloudBackupDescription': 'Maak een back-up van uw gegevens naar de cloud',
      'about': 'Over',
      'aboutApp': 'Over App',
      'helpSupport': 'Help & Ondersteuning',
      'helpSupportDescription': 'Krijg hulp en neem contact op met ondersteuning',
      'comingSoon': 'Binnenkort beschikbaar',
      'futureFeature': 'Deze functie zal beschikbaar zijn in een toekomstige update.',
      'saveSettings': 'Instellingen opslaan',
      'saving': 'Opslaan...',
      'resetSettings': 'Instellingen resetten',
      'resetSettingsDescription': 'Reset alle instellingen naar standaardwaarden',
      'resetSettingsConfirm': 'Weet u zeker dat u alle instellingen wilt resetten?',
      'resetSettingsSuccess': 'Instellingen zijn succesvol gereset',
      'settingsSaved': 'Instellingen succesvol opgeslagen',
      'settingsError': 'Instellingen opslaan mislukt',
      
      // Appearance Settings
      'appearance': 'Weergave',
      'theme': 'Thema',
      'themeDescription': 'Pas app kleuren en uiterlijk aan',
      'text': 'Tekst',
      'textDescription': 'Pas tekstgrootte, lettertype en ruimte aan',
      'themeMode': 'Themamodus',
      'light': 'Licht',
      'dark': 'Donker',
      'system': 'Systeem',
      'colorScheme': 'Kleurenschema',
      'blue': 'Blauw',
      'green': 'Groen',
      'purple': 'Paars',
      'orange': 'Oranje',
      'advancedOptions': 'Geavanceerde opties',
      'useDynamicColors': 'Dynamische kleuren gebruiken',
      'dynamicColorsDescription': 'Pas kleuren automatisch aan op basis van uw apparaat',
      'preview': 'Voorbeeld',
      'sampleContent': 'Voorbeeldinhoud',
      'button': 'Knop',
      
      // Text Settings
      'textSettings': 'Tekstinstellingen',
      'textSettingsDescription': 'Pas tekstweergave aan, inclusief grootte, lettertype en regelafstand',
      'textSize': 'Tekstgrootte',
      'small': 'Klein',
      'medium': 'Normaal',
      'large': 'Groot',
      'fontFamily': 'Lettertype',
      'default': 'Standaard',
      'serif': 'Serif',
      'monospace': 'Monospace',
      'lineSpacing': 'Regelafstand',
      'compact': 'Compact',
      'normal': 'Normaal',
      'relaxed': 'Ruim',
      
      // Authentication Settings
      'enableBiometric': 'Biometrische authenticatie inschakelen',
      'biometricDescription': 'Gebruik Face ID, Touch ID of vingerafdruk om toegang te krijgen tot de app',
      'pinCode': 'PIN-code authenticatie',
      'pinCodeDescription': 'Bescherm de app met een numerieke PIN-code',
      'changePin': 'PIN-code wijzigen',
      'autoLock': 'App automatisch vergrendelen',
      'autoLockDescription': 'Vergrendel de app automatisch na een periode van inactiviteit',
      'autoLockAfter': 'Automatisch vergrendelen na',
      'minutes': 'minuten',
      'loginNotifications': 'Inlogmeldingen',
      'loginNotificationsDescription': 'Ontvang meldingen wanneer iemand inlogt op uw account',
      'resetAuthentication': 'Authenticatie-instellingen resetten',
      'resetAuthenticationConfirm': 'Dit zal alle authenticatie-instellingen resetten. Weet u zeker dat u wilt doorgaan?',
      'resetAuthenticationSuccess': 'Authenticatie-instellingen zijn gereset',
      
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
      
      // Authentication
      'forgotPassword': 'Wachtwoord vergeten',
      'resetPasswordSubtitle': 'Voer je e-mailadres in en we sturen je instructies om je wachtwoord te resetten.',
      'resetPassword': 'Wachtwoord resetten',
      'resetPasswordSuccess': 'Instructies voor het resetten van je wachtwoord zijn naar je e-mail gestuurd.',
      'resetPasswordError': 'Het versturen van de reset-instructies is mislukt. Probeer het opnieuw.',
      'resetPasswordErrorEmptyEmail': 'Voer je e-mailadres in.',
      'sending': 'Verzenden...',
      'backToLogin': 'Terug naar inloggen',
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
      
      // Search
      'searchPlaceholder': 'Rechercher des factures...',
      'searching': 'Recherche en cours...',
      'noResultsFound': 'Aucun résultat trouvé',
      'noResultsForQuery': 'Nous n\'avons trouvé aucune facture correspondant à "{{query}}"',
      'searchInstructions': 'Rechercher par numéro de facture, nom du client, date ou montant',
      'recentSearches': 'Recherches récentes',
      
      // Dashboard
      'totalInvoices': 'Total des Factures',
      'totalAmount': 'Montant Total',
      'avgInvoice': 'Facture Moyenne',
      'paid': 'Payé',
      'pending': 'En attente',
      'overdue': 'En retard',
      'monthlyRevenue': 'Revenu Mensuel',
      'invoiceStatus': 'Statut de la Facture',
      'latestInvoices': 'Dernières Factures',
      'viewAll': 'Voir Tout',
      'noInvoicesYet': 'Pas encore de factures',
      'createInvoice': 'Créer une Facture',
      'loadingDashboard': 'Chargement du tableau de bord...',
      
      // Invoice table
      'invoiceNumber': 'Facture #',
      'client': 'Client',
      'date': 'Date',
      'amount': 'Montant',
      
      // Language and Currency Settings
      'language': 'Langue',
      'languageDescription': 'Sélectionnez votre langue préférée',
      'currency': 'Devise',
      'currencyDescription': 'Sélectionnez votre devise préférée pour toutes les transactions financières',
      'currencyInfo': 'Informations sur la Devise',
      'currencyInfoDescription': 'La devise est utilisée pour tous les calculs et affichages financiers dans l\'application',
      'currencySettings': 'Paramètres de Devise',
      
      // Settings
      'account': 'Compte',
      'profile': 'Profil',
      'profileDescription': 'Gérez vos informations personnelles',
      'authentication': 'Authentification',
      'authenticationDescription': 'Configurez les paramètres de sécurité',
      'invoiceTemplates': 'Modèles de Factures',
      'invoiceTemplatesDescription': 'Gérez vos modèles de factures',
      'defaultSaveLocation': 'Emplacement de Sauvegarde par Défaut',
      'defaultSaveLocationDescription': 'Définissez où les factures sont sauvegardées',
      'cloudBackup': 'Sauvegarde Cloud',
      'cloudBackupDescription': 'Sauvegardez vos données dans le cloud',
      'about': 'À propos',
      'aboutApp': 'À propos de l\'App',
      'helpSupport': 'Aide & Support',
      'helpSupportDescription': 'Obtenez de l\'aide et contactez le support',
      'comingSoon': 'Bientôt disponible',
      'futureFeature': 'Cette fonctionnalité sera disponible dans une future mise à jour.',
      'saveSettings': 'Enregistrer les Paramètres',
      'saving': 'Enregistrement...',
      'resetSettings': 'Réinitialiser les Paramètres',
      'resetSettingsDescription': 'Réinitialiser tous les paramètres aux valeurs par défaut',
      'resetSettingsConfirm': 'Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?',
      'resetSettingsSuccess': 'Les paramètres ont été réinitialisés avec succès',
      'settingsSaved': 'Paramètres enregistrés avec succès',
      'settingsError': 'Échec de l\'enregistrement des paramètres',
      
      // Appearance Settings
      'appearance': 'Apparence',
      'theme': 'Thème',
      'themeDescription': 'Personnalisez les couleurs et l\'apparence de l\'application',
      'text': 'Texte',
      'textDescription': 'Ajustez la taille, la police et l\'espacement du texte',
      'themeMode': 'Mode thème',
      'light': 'Clair',
      'dark': 'Sombre',
      'system': 'Système',
      'colorScheme': 'Schéma de couleurs',
      'blue': 'Bleu',
      'green': 'Vert',
      'purple': 'Violet',
      'orange': 'Orange',
      'advancedOptions': 'Options avancées',
      'useDynamicColors': 'Utiliser les couleurs dynamiques',
      'dynamicColorsDescription': 'Ajuster automatiquement les couleurs en fonction de votre appareil',
      'preview': 'Aperçu',
      'sampleContent': 'Contenu exemple',
      'button': 'Bouton',
      
      // Text Settings
      'textSettings': 'Paramètres de texte',
      'textSettingsDescription': 'Personnalisez l\'apparence du texte, y compris la taille, la police et l\'espacement',
      'textSize': 'Taille du texte',
      'small': 'Petit',
      'medium': 'Moyen',
      'large': 'Grand',
      'fontFamily': 'Police de caractères',
      'default': 'Par défaut',
      'serif': 'Serif',
      'monospace': 'Monospace',
      'lineSpacing': 'Espacement des lignes',
      'compact': 'Compact',
      'normal': 'Normal',
      'relaxed': 'Relaxé',
      
      // Authentication Settings
      'enableBiometric': 'Activer l\'authentification biométrique',
      'biometricDescription': 'Utilisez Face ID, Touch ID ou l\'empreinte digitale pour accéder à l\'application',
      'pinCode': 'Authentification par Code PIN',
      'pinCodeDescription': 'Protégez l\'application avec un code PIN numérique',
      'changePin': 'Changer le Code PIN',
      'autoLock': 'Verrouillage Automatique',
      'autoLockDescription': 'Verrouillez automatiquement l\'application après une période d\'inactivité',
      'autoLockAfter': 'Verrouillage Automatique Après',
      'minutes': 'minutes',
      'loginNotifications': 'Notifications de Connexion',
      'loginNotificationsDescription': 'Recevez des notifications lorsqu\'une personne se connecte à votre compte',
      'resetAuthentication': 'Réinitialiser les Paramètres d\'Authentification',
      'resetAuthenticationConfirm': 'Cela réinitialisera tous les paramètres d\'authentification. Êtes-vous sûr de vouloir continuer ?',
      'resetAuthenticationSuccess': 'Les paramètres d\'authentification ont été réinitialisés',
      
      // Months
      'jan': 'Jan',
      'feb': 'Fév',
      'mar': 'Mar',
      'apr': 'Avr',
      'may': 'Mai',
      'jun': 'Jun',
      'jul': 'Jul',
      'aug': 'Aoû',
      'sep': 'Sep',
      'oct': 'Oct',
      'nov': 'Nov',
      'dec': 'Déc',
      
      // Authentication
      'forgotPassword': 'Mot de passe oublié',
      'resetPasswordSubtitle': 'Entrez votre adresse e-mail et nous vous enverrons les instructions pour réinitialiser votre mot de passe.',
      'resetPassword': 'Réinitialiser le mot de passe',
      'resetPasswordSuccess': 'Les instructions de réinitialisation ont été envoyées à votre e-mail.',
      'resetPasswordError': 'Échec de l\'envoi des instructions. Veuillez réessayer.',
      'resetPasswordErrorEmptyEmail': 'Veuillez entrer votre adresse e-mail.',
      'sending': 'Envoi en cours...',
      'backToLogin': 'Retour à la connexion',
    }
  },
  'tr-TR': {
    translation: {
      // Navigation
      'dashboard': 'Ana Sayfa',
      'invoices': 'Faturalar',
      'myInvoices': 'Faturalarım',
      'search': 'Ara',
      'searchInvoices': 'Faturalarda Ara',
      'settings': 'Ayarlar',
      
      // Search
      'searchPlaceholder': 'Faturalarda ara...',
      'searching': 'Aranıyor...',
      'noResultsFound': 'Sonuç Bulunamadı',
      'noResultsForQuery': '"{{query}}" ile eşleşen fatura bulunamadı',
      'searchInstructions': 'Fatura numarası, müşteri adı, tarih veya tutara göre arama yapın',
      'recentSearches': 'Son Aramalar',
      
      // Dashboard
      'totalInvoices': 'Toplam Fatura',
      'totalAmount': 'Toplam Tutar',
      'avgInvoice': 'Ortalama Fatura',
      'paid': 'Ödendi',
      'pending': 'Beklemede',
      'overdue': 'Gecikmiş',
      'monthlyRevenue': 'Aylık Gelir',
      'invoiceStatus': 'Fatura Durumu',
      'latestInvoices': 'Son Faturalar',
      'viewAll': 'Tümünü Gör',
      'noInvoicesYet': 'Henüz fatura yok',
      'createInvoice': 'Fatura Oluştur',
      'loadingDashboard': 'Gösterge paneli yükleniyor...',
      
      // Invoice table
      'invoiceNumber': 'Fatura #',
      'client': 'Müşteri',
      'date': 'Tarih',
      'amount': 'Tutar',
      
      // Language and Currency Settings
      'language': 'Dil',
      'languageDescription': 'Tercih ettiğiniz dili seçin',
      'currency': 'Para Birimi',
      'currencyDescription': 'Tüm finansal işlemler için tercih ettiğiniz para birimini seçin',
      'currencyInfo': 'Para Birimi Bilgisi',
      'currencyInfoDescription': 'Para birimi, uygulama genelinde tüm finansal hesaplamalar ve görüntülemeler için kullanılır',
      'currencySettings': 'Para Birimi Ayarları',
      
      // Settings
      'account': 'Hesap',
      'profile': 'Profil',
      'profileDescription': 'Kişisel bilgilerinizi yönetin',
      'authentication': 'Kimlik Doğrulama',
      'authenticationDescription': 'Güvenlik ayarlarını yapılandırın',
      'invoiceTemplates': 'Fatura Şablonları',
      'invoiceTemplatesDescription': 'Fatura şablonlarınızı yönetin',
      'defaultSaveLocation': 'Varsayılan Kayıt Konumu',
      'defaultSaveLocationDescription': 'Faturaların kaydedileceği yeri ayarlayın',
      'cloudBackup': 'Bulut Yedekleme',
      'cloudBackupDescription': 'Verilerinizi buluta yedekleyin',
      'about': 'Hakkında',
      'aboutApp': 'Uygulama Hakkında',
      'helpSupport': 'Yardım & Destek',
      'helpSupportDescription': 'Yardım alın ve destek ile iletişime geçin',
      'comingSoon': 'Yakında',
      'futureFeature': 'Bu özellik gelecekteki bir güncellemede kullanıma sunulacak.',
      'saveSettings': 'Ayarları Kaydet',
      'saving': 'Kaydediliyor...',
      'resetSettings': 'Ayarları Sıfırla',
      'resetSettingsDescription': 'Tüm ayarları varsayılan değerlere sıfırla',
      'resetSettingsConfirm': 'Tüm ayarları sıfırlamak istediğinizden emin misiniz?',
      'resetSettingsSuccess': 'Ayarlar başarıyla sıfırlandı',
      'settingsSaved': 'Ayarlar başarıyla kaydedildi',
      'settingsError': 'Ayarlar kaydedilemedi',
      
      // Appearance Settings
      'appearance': 'Görünüm',
      'theme': 'Tema',
      'themeDescription': 'Uygulama renklerini ve görünümünü özelleştirin',
      'text': 'Metin',
      'textDescription': 'Metin boyutunu, yazı tipini ve boşlukları ayarlayın',
      'themeMode': 'Tema Modu',
      'light': 'Açık',
      'dark': 'Koyu',
      'system': 'Sistem',
      'colorScheme': 'Renk Şeması',
      'blue': 'Mavi',
      'green': 'Yeşil',
      'purple': 'Mor',
      'orange': 'Turuncu',
      'advancedOptions': 'Gelişmiş Seçenekler',
      'useDynamicColors': 'Dinamik Renkleri Kullan',
      'dynamicColorsDescription': 'Renkleri cihazınıza göre otomatik olarak ayarla',
      'preview': 'Önizleme',
      'sampleContent': 'Örnek içerik',
      'button': 'Düğme',
      
      // Text Settings
      'textSettings': 'Metin Ayarları',
      'textSettingsDescription': 'Boyut, yazı tipi ve boşluk dahil olmak üzere metin görünümünü özelleştirin',
      'textSize': 'Metin Boyutu',
      'small': 'Küçük',
      'medium': 'Orta',
      'large': 'Büyük',
      'fontFamily': 'Yazı Tipi',
      'default': 'Varsayılan',
      'serif': 'Serif',
      'monospace': 'Monospace',
      'lineSpacing': 'Satır Aralığı',
      'compact': 'Sıkışık',
      'normal': 'Normal',
      'relaxed': 'Geniş',
      
      // Authentication Settings
      'enableBiometric': 'Biyometrik Kimlik Doğrulamayı Etkinleştir',
      'biometricDescription': 'Uygulamaya erişmek için Face ID, Touch ID veya parmak izi kullanın',
      'pinCode': 'PIN Kodu Kimlik Doğrulaması',
      'pinCodeDescription': 'Uygulamayı sayısal bir PIN kodu ile koruyun',
      'changePin': 'PIN Kodunu Değiştir',
      'autoLock': 'Otomatik Kilitleme',
      'autoLockDescription': 'Belirli bir süre hareketsizlikten sonra uygulamayı otomatik olarak kilitleyin',
      'autoLockAfter': 'Otomatik Kilitleme Süresi',
      'minutes': 'dakika',
      'loginNotifications': 'Giriş Bildirimleri',
      'loginNotificationsDescription': 'Birisi hesabınıza giriş yaptığında bildirim alın',
      'resetAuthentication': 'Kimlik Doğrulama Ayarlarını Sıfırla',
      'resetAuthenticationConfirm': 'Bu işlem tüm kimlik doğrulama ayarlarını sıfırlayacak. Devam etmek istediğinizden emin misiniz?',
      'resetAuthenticationSuccess': 'Kimlik doğrulama ayarları sıfırlandı',
      
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
      
      // Authentication
      'forgotPassword': 'Şifremi Unuttum',
      'resetPasswordSubtitle': 'E-posta adresinizi girin, şifrenizi sıfırlamak için talimatları göndereceğiz.',
      'resetPassword': 'Şifreyi Sıfırla',
      'resetPasswordSuccess': 'Şifre sıfırlama talimatları e-posta adresinize gönderildi.',
      'resetPasswordError': 'Talimatlar gönderilemedi. Lütfen tekrar deneyin.',
      'resetPasswordErrorEmptyEmail': 'Lütfen e-posta adresinizi girin.',
      'sending': 'Gönderiliyor...',
      'backToLogin': 'Girişe Dön',
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