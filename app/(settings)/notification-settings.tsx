import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SettingsService from '../../services/SettingsService';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t } = useTranslation();
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    push: true,
    sms: false,
  });

  useEffect(() => {
    loadNotificationPreferences();
  }, []);

  const loadNotificationPreferences = async () => {
    try {
      const preferences = await SettingsService.getNotificationPreferences();
      setNotificationPreferences(preferences);
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      Alert.alert(t('error'), t('settingsError'));
    }
  };

  const handleToggle = async (key: keyof typeof notificationPreferences) => {
    try {
      const newPreferences = {
        ...notificationPreferences,
        [key]: !notificationPreferences[key],
      };
      await SettingsService.saveNotificationPreferences(newPreferences);
      setNotificationPreferences(newPreferences);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      Alert.alert(t('error'), t('settingsError'));
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkBackground]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
          <Text style={[styles.backButtonText, isDarkMode && styles.darkText]}>{t('settings')}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>{t('notificationPreferences')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>
              {t('emailNotifications')}
            </Text>
            <Text style={[styles.settingDescription, isDarkMode && styles.darkSecondaryText]}>
              {t('emailNotificationsDescription')}
            </Text>
          </View>
          <Switch
            value={notificationPreferences.email}
            onValueChange={() => handleToggle('email')}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={notificationPreferences.email ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>
              {t('pushNotifications')}
            </Text>
            <Text style={[styles.settingDescription, isDarkMode && styles.darkSecondaryText]}>
              {t('pushNotificationsDescription')}
            </Text>
          </View>
          <Switch
            value={notificationPreferences.push}
            onValueChange={() => handleToggle('push')}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={notificationPreferences.push ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>
              {t('smsNotifications')}
            </Text>
            <Text style={[styles.settingDescription, isDarkMode && styles.darkSecondaryText]}>
              {t('smsNotificationsDescription')}
            </Text>
          </View>
          <Switch
            value={notificationPreferences.sms}
            onValueChange={() => handleToggle('sms')}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={notificationPreferences.sms ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 17,
    marginLeft: 8,
    color: '#000000',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSecondaryText: {
    color: '#8E8E93',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 16,
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
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
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
    marginLeft: 16,
  },
  darkDivider: {
    backgroundColor: '#38383A',
  },
}); 