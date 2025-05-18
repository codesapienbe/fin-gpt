import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

import { Currency, Language, getCurrencyConfig, getCurrentCurrency, getLanguageConfig } from '../../services/i18n';

const SettingsItem = ({ 
  icon, 
  title, 
  description, 
  onPress,
  color = '#007AFF',
  rightContent
}: {
  icon: string;
  title: string;
  description?: string;
  onPress: () => void;
  color?: string;
  rightContent?: React.ReactNode;
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon as any} size={24} color={color} />
    </View>
    <View style={styles.settingTextContainer}>
      <Text style={styles.settingTitle}>{title}</Text>
      {description && <Text style={styles.settingDescription}>{description}</Text>}
    </View>
    {rightContent || <Ionicons name="chevron-forward" size={20} color="#8E8E93" />}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t, i18n } = useTranslation();
  const [currentCurrency, setCurrentCurrency] = useState<Currency>('EUR');

  useEffect(() => {
    const loadCurrency = async () => {
      const currency = await getCurrentCurrency();
      setCurrentCurrency(currency);
    };
    
    loadCurrency();
  }, []);

  const handleNotImplemented = () => {
    Alert.alert(
      t('comingSoon'),
      t('futureFeature'),
      [{ text: 'OK' }]
    );
  };

  // Get current language info
  const currentLanguage = getLanguageConfig(i18n.language as Language);
  // Get current currency info
  const currencyInfo = getCurrencyConfig(currentCurrency);

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkBackground]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>{t('account')}</Text>
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <SettingsItem
            icon="person-outline"
            title={t('profile')}
            description={t('profileDescription')}
            onPress={() => router.push('/profile')}
          />
          <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
          <SettingsItem
            icon="key-outline"
            title={t('authentication')}
            description={t('authenticationDescription')}
            onPress={() => router.push('/authentication')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>{t('invoices')}</Text>
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <SettingsItem
            icon="document-text-outline"
            title={t('invoiceTemplates')}
            description={t('invoiceTemplatesDescription')}
            onPress={() => router.push('/invoice-templates')}
          />
          <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
          <SettingsItem
            icon="folder-outline"
            title={t('defaultSaveLocation')}
            description={t('defaultSaveLocationDescription')}
            onPress={handleNotImplemented}
          />
          <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
          <SettingsItem
            icon="cloud-upload-outline"
            title={t('cloudBackup')}
            description={t('cloudBackupDescription')}
            onPress={handleNotImplemented}
            color="#5856D6"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>{t('appearance')}</Text>
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <SettingsItem
            icon="color-palette-outline"
            title={t('theme')}
            description={t('themeDescription')}
            onPress={() => router.push('/theme-settings')}
          />
          <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
          <SettingsItem
            icon="text-outline"
            title={t('text')}
            description={t('textDescription')}
            onPress={() => router.push('/text-settings')}
          />
          <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
          <SettingsItem
            icon="language-outline"
            title={t('language')}
            description={currentLanguage.name}
            onPress={() => router.push({pathname: '/language-settings'})}
            color="#FF9500"
          />
          <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
          <SettingsItem
            icon="cash-outline"
            title={t('currency')}
            description={`${currencyInfo.symbol} ${currencyInfo.name} (${currencyInfo.code})`}
            onPress={() => router.push({pathname: '/currency-settings'})}
            color="#30B94D"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>{t('about')}</Text>
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <SettingsItem
            icon="information-circle-outline"
            title={t('aboutApp')}
            description="Version 1.0.0"
            onPress={handleNotImplemented}
          />
          <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
          <SettingsItem
            icon="help-circle-outline"
            title={t('helpSupport')}
            description={t('helpSupportDescription')}
            onPress={handleNotImplemented}
            color="#34C759"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, isDarkMode && styles.darkFooterText]}>
          Invoice Management App v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  darkSectionTitle: {
    color: '#aaa',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 56,
  },
  darkDivider: {
    backgroundColor: '#333',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  darkFooterText: {
    color: '#666',
  },
}); 