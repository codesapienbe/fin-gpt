import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function CloudBackupSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t } = useTranslation();
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  useEffect(() => {
    loadBackupSettings();
  }, []);

  const loadBackupSettings = async () => {
    try {
      // TODO: Implement actual cloud backup settings loading
      // For now, using mock data
      setAutoBackup(true);
      setBackupFrequency('daily');
      setLastBackup(new Date().toISOString());
    } catch (error) {
      console.error('Error loading backup settings:', error);
      Alert.alert(t('error'), t('settingsError'));
    }
  };

  const handleAutoBackupToggle = async (value: boolean) => {
    try {
      // TODO: Implement actual cloud backup settings saving
      setAutoBackup(value);
    } catch (error) {
      console.error('Error saving backup settings:', error);
      Alert.alert(t('error'), t('settingsError'));
    }
  };

  const handleBackupNow = async () => {
    try {
      // TODO: Implement actual backup functionality
      Alert.alert(
        t('backupStarted'),
        t('backupInProgress'),
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error starting backup:', error);
      Alert.alert(t('error'), t('backupError'));
    }
  };

  const BackupFrequencyOption = ({ 
    value, 
    title 
  }: { 
    value: 'daily' | 'weekly' | 'monthly';
    title: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.option,
        { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }
      ]}
      onPress={() => setBackupFrequency(value)}
    >
      <Text style={[styles.optionTitle, isDarkMode && styles.darkText]}>
        {title}
      </Text>
      {backupFrequency === value && (
        <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

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
        <Text style={[styles.title, isDarkMode && styles.darkText]}>{t('cloudBackup')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>
              {t('autoBackup')}
            </Text>
            <Text style={[styles.settingDescription, isDarkMode && styles.darkSecondaryText]}>
              {t('autoBackupDescription')}
            </Text>
          </View>
          <Switch
            value={autoBackup}
            onValueChange={handleAutoBackupToggle}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={autoBackup ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        {autoBackup && (
          <>
            <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
            <View style={styles.frequencyContainer}>
              <Text style={[styles.frequencyTitle, isDarkMode && styles.darkText]}>
                {t('backupFrequency')}
              </Text>
              <BackupFrequencyOption
                value="daily"
                title={t('backupFrequency.daily')}
              />
              <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
              <BackupFrequencyOption
                value="weekly"
                title={t('backupFrequency.weekly')}
              />
              <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
              <BackupFrequencyOption
                value="monthly"
                title={t('backupFrequency.monthly')}
              />
            </View>
          </>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={[styles.infoCard, isDarkMode && styles.darkCard]}>
          <Text style={[styles.infoTitle, isDarkMode && styles.darkText]}>
            {t('lastBackup')}
          </Text>
          <Text style={[styles.infoText, isDarkMode && styles.darkSecondaryText]}>
            {lastBackup ? new Date(lastBackup).toLocaleString() : t('noBackupYet')}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.backupButton, isDarkMode && styles.darkBackupButton]}
        onPress={handleBackupNow}
      >
        <Text style={styles.backupButtonText}>
          {t('backupNow')}
        </Text>
      </TouchableOpacity>
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
  frequencyContainer: {
    padding: 16,
  },
  frequencyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  optionTitle: {
    fontSize: 17,
    color: '#000000',
  },
  infoContainer: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 20,
  },
  backupButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  darkBackupButton: {
    backgroundColor: '#0A84FF',
  },
  backupButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
}); 