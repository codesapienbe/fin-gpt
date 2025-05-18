import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';
type TextSize = 'small' | 'medium' | 'large';
type ColorScheme = 'blue' | 'green' | 'purple' | 'orange';

interface ThemeSettings {
  themeMode: ThemeMode;
  textSize: TextSize;
  colorScheme: ColorScheme;
}

export default function ThemeSettingsScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const [settings, setSettings] = useState<ThemeSettings>({
    themeMode: 'system',
    textSize: 'medium',
    colorScheme: 'blue',
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
      
      Alert.alert('Success', 'Theme settings saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save theme settings');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const getColorForScheme = (scheme: ColorScheme) => {
    switch (scheme) {
      case 'blue': return '#007AFF';
      case 'green': return '#34C759';
      case 'purple': return '#5856D6';
      case 'orange': return '#FF9500';
    }
  };

  const renderThemeModeOption = (mode: ThemeMode, label: string, icon: string) => {
    const isSelected = settings.themeMode === mode;
    return (
      <TouchableOpacity
        style={[styles.optionCard, isSelected && styles.selectedOptionCard]}
        onPress={() => setSettings(prev => ({ ...prev, themeMode: mode }))}
      >
        <Ionicons name={icon as any} size={24} color={isSelected ? '#007AFF' : '#8E8E93'} />
        <Text style={[styles.optionLabel, isSelected && styles.selectedOptionLabel]}>{label}</Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={22} color="#007AFF" style={styles.checkmark} />
        )}
      </TouchableOpacity>
    );
  };

  const renderTextSizeOption = (size: TextSize, label: string, fontSize: number) => {
    const isSelected = settings.textSize === size;
    return (
      <TouchableOpacity
        style={[styles.optionCard, isSelected && styles.selectedOptionCard]}
        onPress={() => setSettings(prev => ({ ...prev, textSize: size }))}
      >
        <Text style={{ fontSize: fontSize, color: isSelected ? '#007AFF' : '#8E8E93' }}>Aa</Text>
        <Text style={[styles.optionLabel, isSelected && styles.selectedOptionLabel]}>{label}</Text>
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
        style={[styles.optionCard, isSelected && styles.selectedOptionCard]}
        onPress={() => setSettings(prev => ({ ...prev, colorScheme: scheme }))}
      >
        <View style={[styles.colorDot, { backgroundColor: color }]} />
        <Text style={[styles.optionLabel, isSelected && styles.selectedOptionLabel]}>{label}</Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={22} color="#007AFF" style={styles.checkmark} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Theme Settings',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.container}>
        <Text style={styles.description}>
          Customize the appearance of your app by selecting theme, text size, and color options.
        </Text>
        
        <Text style={styles.sectionTitle}>Theme Mode</Text>
        <View style={styles.optionsRow}>
          {renderThemeModeOption('light', 'Light', 'sunny-outline')}
          {renderThemeModeOption('dark', 'Dark', 'moon-outline')}
          {renderThemeModeOption('system', 'System', 'settings-outline')}
        </View>
        
        <Text style={styles.sectionTitle}>Text Size</Text>
        <View style={styles.optionsRow}>
          {renderTextSizeOption('small', 'Small', 14)}
          {renderTextSizeOption('medium', 'Medium', 18)}
          {renderTextSizeOption('large', 'Large', 22)}
        </View>
        
        <Text style={styles.sectionTitle}>Color Scheme</Text>
        <View style={styles.optionsRow}>
          {renderColorSchemeOption('blue', 'Blue')}
          {renderColorSchemeOption('green', 'Green')}
          {renderColorSchemeOption('purple', 'Purple')}
          {renderColorSchemeOption('orange', 'Orange')}
        </View>
        
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Preview</Text>
          <View style={[
            styles.previewContent,
            { 
              backgroundColor: settings.themeMode === 'dark' || 
                (settings.themeMode === 'system' && systemColorScheme === 'dark') 
                ? '#1C1C1E' : '#FFFFFF'
            }
          ]}>
            <Text style={[
              styles.previewText,
              { 
                color: settings.themeMode === 'dark' || 
                  (settings.themeMode === 'system' && systemColorScheme === 'dark') 
                  ? '#FFFFFF' : '#000000',
                fontSize: settings.textSize === 'small' ? 14 : 
                          settings.textSize === 'medium' ? 16 : 18
              }
            ]}>
              Sample invoice text
            </Text>
            <View style={[
              styles.previewButton,
              { backgroundColor: getColorForScheme(settings.colorScheme) }
            ]}>
              <Text style={styles.previewButtonText}>Button</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.savingButton]} 
          onPress={handleSaveSettings}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  optionCard: {
    width: '31%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOptionCard: {
    borderColor: '#007AFF',
  },
  optionLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
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
  previewCard: {
    marginTop: 20,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  previewContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previewText: {
    marginBottom: 15,
  },
  previewButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  previewButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  savingButton: {
    backgroundColor: '#78B6FF',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
}); 