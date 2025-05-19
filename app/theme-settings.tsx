import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ThemeMode = 'light' | 'dark' | 'system';
type ColorScheme = 'blue' | 'green' | 'purple' | 'orange';

interface ThemeSettings {
  themeMode: ThemeMode;
  colorScheme: ColorScheme;
  useDynamicColors: boolean;
}

export default function ThemeSettingsScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';
  const { t } = useTranslation();
  const [settings, setSettings] = useState<ThemeSettings>({
    themeMode: 'system',
    colorScheme: 'blue',
    useDynamicColors: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load theme settings
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('themeSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Failed to load theme settings', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      await AsyncStorage.setItem('themeSettings', JSON.stringify(settings));
      
      // Simulate network delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', t('settingsSaved'));
    } catch (error) {
      Alert.alert('Error', t('settingsError'));
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const getColorForScheme = (scheme: string) => {
    switch (scheme) {
      case 'blue': return '#007AFF';
      case 'green': return '#34C759';
      case 'purple': return '#5856D6';
      case 'orange': return '#FF9500';
      default: return '#007AFF';
    }
  };

  const renderThemeModeOption = (mode: ThemeMode, label: string, icon: string) => {
    const isSelected = settings.themeMode === mode;
    return (
      <TouchableOpacity
        style={[
          styles.optionCard, 
          isSelected && styles.selectedOptionCard,
          isDarkMode && { backgroundColor: '#1e1e1e' }
        ]}
        onPress={() => setSettings(prev => ({ ...prev, themeMode: mode }))}
      >
        <Ionicons 
          name={icon as any} 
          size={24} 
          color={isSelected ? '#007AFF' : isDarkMode ? '#aaaaaa' : '#8E8E93'} 
        />
        <Text style={[
          styles.optionLabel, 
          isSelected && styles.selectedOptionLabel,
          isDarkMode && !isSelected && { color: '#aaaaaa' }
        ]}>{label}</Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={22} color="#007AFF" style={styles.checkmark} />
        )}
      </TouchableOpacity>
    );
  };

  const renderColorSchemeOption = (scheme: ColorScheme, label: string) => {
    const isSelected = settings.colorScheme === scheme;
    const color = getColorForScheme(scheme);
    return (
      <TouchableOpacity
        style={[
          styles.optionCard, 
          isSelected && styles.selectedOptionCard,
          isDarkMode && { backgroundColor: '#1e1e1e' }
        ]}
        onPress={() => setSettings(prev => ({ ...prev, colorScheme: scheme }))}
      >
        <View style={[styles.colorDot, { backgroundColor: color }]} />
        <Text style={[
          styles.optionLabel, 
          isSelected && styles.selectedOptionLabel,
          isDarkMode && !isSelected && { color: '#aaaaaa' }
        ]}>{label}</Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={22} color="#007AFF" style={styles.checkmark} />
        )}
      </TouchableOpacity>
    );
  };

  const renderDynamicColorOption = () => {
    return (
      <View style={[
        styles.toggleOption,
        isDarkMode && { backgroundColor: '#1e1e1e', borderColor: '#333' }
      ]}>
        <View style={styles.toggleInfo}>
          <Ionicons 
            name="color-palette-outline" 
            size={24} 
            color={isDarkMode ? '#aaaaaa' : '#8E8E93'} 
            style={styles.toggleIcon} 
          />
          <View>
            <Text style={[styles.toggleTitle, isDarkMode && { color: '#ffffff' }]}>
              {t('useDynamicColors')}
            </Text>
            <Text style={[styles.toggleDescription, isDarkMode && { color: '#aaaaaa' }]}>
              {t('dynamicColorsDescription')}
            </Text>
          </View>
        </View>
        <Switch
          value={settings.useDynamicColors}
          onValueChange={(value) => setSettings(prev => ({ ...prev, useDynamicColors: value }))}
          trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
          thumbColor="#FFFFFF"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkBackground]} edges={['top', 'right', 'left']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={isDarkMode ? '#ffffff' : '#000000'} 
          />
          <Text style={[styles.backButtonText, isDarkMode && styles.darkText]}>{t('settings')}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>{t('theme')}</Text>
        <View style={{ width: 60 }} />
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <Text style={[styles.description, isDarkMode && { color: '#aaaaaa' }]}>
          {t('themeDescription')}
        </Text>
        
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t('themeMode')}</Text>
        <View style={styles.optionsRow}>
          {renderThemeModeOption('light', t('light'), 'sunny-outline')}
          {renderThemeModeOption('dark', t('dark'), 'moon-outline')}
          {renderThemeModeOption('system', t('system'), 'settings-outline')}
        </View>
        
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t('colorScheme')}</Text>
        <View style={styles.optionsRow}>
          {renderColorSchemeOption('blue', t('blue'))}
          {renderColorSchemeOption('green', t('green'))}
          {renderColorSchemeOption('purple', t('purple'))}
          {renderColorSchemeOption('orange', t('orange'))}
        </View>
        
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t('advancedOptions')}</Text>
        {renderDynamicColorOption()}
        
        <View style={[
          styles.previewCard, 
          isDarkMode && { backgroundColor: '#1e1e1e', borderColor: '#333' }
        ]}>
          <Text style={[styles.previewTitle, isDarkMode && styles.darkText]}>{t('preview')}</Text>
          <View style={[
            styles.previewContent,
            { 
              backgroundColor: settings.themeMode === 'dark' || 
                (settings.themeMode === 'system' && systemColorScheme === 'dark') 
                ? '#333' : '#f5f5f5'
            }
          ]}>
            <Text style={[
              styles.previewText,
              { 
                color: settings.themeMode === 'dark' || 
                  (settings.themeMode === 'system' && systemColorScheme === 'dark') 
                  ? '#FFFFFF' : '#000000',
              }
            ]}>
              {t('sampleContent')}
            </Text>
            <View style={[
              styles.previewButton,
              { backgroundColor: getColorForScheme(settings.colorScheme) }
            ]}>
              <Text style={styles.previewButtonText}>{t('button')}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.savingButton]} 
          onPress={handleSaveSettings}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? t('saving') : t('saveSettings')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  darkText: {
    color: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 24,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -5,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedOptionCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  optionLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  selectedOptionLabel: {
    color: '#007AFF',
    fontWeight: '500',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  toggleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    marginRight: 12,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  previewCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewContent: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  previewText: {
    lineHeight: 22,
  },
  previewButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  previewButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  savingButton: {
    backgroundColor: '#8E8E93',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  }
}); 