import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SettingsService from '../../services/SettingsService';

type SaveLocation = 'local' | 'cloud' | 'both';

export default function SaveLocationSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t } = useTranslation();
  const [saveLocation, setSaveLocation] = useState<SaveLocation>('local');

  useEffect(() => {
    loadSaveLocation();
  }, []);

  const loadSaveLocation = async () => {
    try {
      const location = await SettingsService.getDefaultSaveLocation();
      setSaveLocation(location);
    } catch (error) {
      console.error('Error loading save location:', error);
      Alert.alert(t('error'), t('settingsError'));
    }
  };

  const handleSaveLocationChange = async (location: SaveLocation) => {
    try {
      await SettingsService.saveDefaultSaveLocation(location);
      setSaveLocation(location);
    } catch (error) {
      console.error('Error saving location preference:', error);
      Alert.alert(t('error'), t('settingsError'));
    }
  };

  const SaveLocationOption = ({ 
    value, 
    title, 
    description 
  }: { 
    value: SaveLocation;
    title: string;
    description: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.option,
        { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }
      ]}
      onPress={() => handleSaveLocationChange(value)}
    >
      <View style={styles.optionContent}>
        <Text style={[styles.optionTitle, isDarkMode && styles.darkText]}>
          {title}
        </Text>
        <Text style={[styles.optionDescription, isDarkMode && styles.darkSecondaryText]}>
          {description}
        </Text>
      </View>
      {saveLocation === value && (
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
        <Text style={[styles.title, isDarkMode && styles.darkText]}>{t('defaultSaveLocation')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <Text style={[styles.description, isDarkMode && styles.darkSecondaryText]}>
        {t('defaultSaveLocationDescription')}
      </Text>

      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <SaveLocationOption
          value="local"
          title={t('saveLocation.local')}
          description={t('saveLocation.localDescription')}
        />
        <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
        <SaveLocationOption
          value="cloud"
          title={t('saveLocation.cloud')}
          description={t('saveLocation.cloudDescription')}
        />
        <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
        <SaveLocationOption
          value="both"
          title={t('saveLocation.both')}
          description={t('saveLocation.bothDescription')}
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={[styles.infoCard, isDarkMode && styles.darkCard]}>
          <Text style={[styles.infoTitle, isDarkMode && styles.darkText]}>
            {t('saveLocationInfo')}
          </Text>
          <Text style={[styles.infoText, isDarkMode && styles.darkSecondaryText]}>
            {t('saveLocationInfoDescription')}
          </Text>
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
  description: {
    fontSize: 15,
    color: '#8E8E93',
    margin: 16,
    marginTop: 8,
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionContent: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#000000',
  },
  optionDescription: {
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
}); 