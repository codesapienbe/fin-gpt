import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthService, { UserData } from '../../services/AuthService';
import { getCurrencyConfig, getLanguageConfig } from '../../services/i18n';
import SettingsService, { UserPreferences } from '../../services/SettingsService';

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
  const [settings, setSettings] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    loadSettings();
    loadUser();
  }, []);

  const loadSettings = async () => {
    try {
      const userPreferences = await SettingsService.getUserPreferences();
      setSettings(userPreferences);
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert(t('settingsError'), t('settingsError'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadUser = () => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleLogout = async () => {
    Alert.alert(
      t('logout'),
      t('logoutConfirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.logout();
              setUser(null);
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert(t('error'), t('logoutError'));
            }
          },
        },
      ]
    );
  };

  const handleResetSettings = async () => {
    Alert.alert(
      t('resetSettings'),
      t('resetSettingsConfirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('reset'),
          style: 'destructive',
          onPress: async () => {
            try {
              await SettingsService.resetSettings();
              await loadSettings();
              Alert.alert(t('success'), t('resetSettingsSuccess'));
            } catch (error) {
              console.error('Error resetting settings:', error);
              Alert.alert(t('error'), t('settingsError'));
            }
          },
        },
      ]
    );
  };

  if (isLoading || !settings) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && styles.darkBackground]}>
        <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
          {t('loading')}...
        </Text>
      </SafeAreaView>
    );
  }

  // Get current language info
  const currentLanguage = getLanguageConfig(settings.language);
  // Get current currency info
  const currencyInfo = getCurrencyConfig(settings.currency);

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkBackground]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>{t('settings')}</Text>
        {user ? (
          <TouchableOpacity onPress={handleLogout} style={styles.authButton}>
            <Ionicons name="log-out-outline" size={24} color={isDarkMode ? '#FF453A' : '#FF3B30'} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleLogin} style={styles.authButton}>
            <Ionicons name="log-in-outline" size={24} color={isDarkMode ? '#34C759' : '#30B94D'} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView}>
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
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>{t('appearance')}</Text>
          <View style={[styles.card, isDarkMode && styles.darkCard]}>
            <SettingsItem
              icon="color-palette-outline"
              title={t('theme')}
              description={t(`theme.${settings.theme}`)}
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
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>{t('notifications')}</Text>
          <View style={[styles.card, isDarkMode && styles.darkCard]}>
            <SettingsItem
              icon="notifications-outline"
              title={t('notificationPreferences')}
              description={t('notificationPreferencesDescription')}
              onPress={() => router.push('/(settings)/notification-settings')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>{t('storage')}</Text>
          <View style={[styles.card, isDarkMode && styles.darkCard]}>
            <SettingsItem
              icon="save-outline"
              title={t('defaultSaveLocation')}
              description={t(`saveLocation.${settings.defaultSaveLocation}`)}
              onPress={() => router.push('/(settings)/save-location-settings')}
            />
            <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
            <SettingsItem
              icon="cloud-upload-outline"
              title={t('cloudBackup')}
              description={t('cloudBackupDescription')}
              onPress={() => router.push('/(settings)/cloud-backup-settings')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>{t('about')}</Text>
          <View style={[styles.card, isDarkMode && styles.darkCard]}>
            <SettingsItem
              icon="information-circle-outline"
              title={t('aboutApp')}
              description={t('aboutAppDescription')}
              onPress={() => router.push('/(settings)/about')}
            />
            <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
            <SettingsItem
              icon="help-circle-outline"
              title={t('helpSupport')}
              description={t('helpSupportDescription')}
              onPress={() => router.push('/(settings)/help-support')}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.resetButton, isDarkMode && styles.darkResetButton]}
          onPress={handleResetSettings}
        >
          <Text style={[styles.resetButtonText, isDarkMode && styles.darkResetButtonText]}>
            {t('resetSettings')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  darkBackground: {
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  darkSectionTitle: {
    color: '#8E8E93',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  darkCard: {
    backgroundColor: '#1C1C1E',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#000000',
  },
  settingDescription: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#C6C6C8',
    marginLeft: 60,
  },
  darkDivider: {
    backgroundColor: '#38383A',
  },
  loadingText: {
    fontSize: 17,
    color: '#000000',
    textAlign: 'center',
    marginTop: 20,
  },
  darkText: {
    color: '#FFFFFF',
  },
  resetButton: {
    margin: 20,
    padding: 16,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    alignItems: 'center',
  },
  darkResetButton: {
    backgroundColor: '#FF453A',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  darkResetButtonText: {
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#C6C6C8',
  },
  darkHeader: {
    backgroundColor: '#1C1C1E',
    borderBottomColor: '#38383A',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  authButton: {
    padding: 8,
  },
}); 