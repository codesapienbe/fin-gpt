import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

type TextSize = 'small' | 'medium' | 'large';
type FontFamily = 'system' | 'serif' | 'monospace';

interface TextSettings {
  textSize: TextSize;
  fontFamily: FontFamily;
  lineSpacing: number;
}

export default function TextSettingsScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';
  const [settings, setSettings] = useState<TextSettings>({
    textSize: 'medium',
    fontFamily: 'system',
    lineSpacing: 1.2,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load text settings
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('textSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Failed to load text settings', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      await AsyncStorage.setItem('textSettings', JSON.stringify(settings));
      
      // Simulate network delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Text settings saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save text settings');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderTextSizeOption = (size: TextSize, label: string, fontSize: number) => {
    const isSelected = settings.textSize === size;
    return (
      <TouchableOpacity
        style={[styles.optionCard, isSelected && styles.selectedOptionCard]}
        onPress={() => setSettings(prev => ({ ...prev, textSize: size }))}
      >
        <Text style={{ 
          fontSize: fontSize, 
          color: isSelected ? '#007AFF' : isDarkMode ? '#aaaaaa' : '#8E8E93'
        }}>Aa</Text>
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

  const renderFontOption = (font: FontFamily, label: string) => {
    const isSelected = settings.fontFamily === font;
    let fontFamily = 'System';
    if (font === 'serif') fontFamily = 'Times New Roman';
    if (font === 'monospace') fontFamily = 'Courier';

    return (
      <TouchableOpacity
        style={[styles.optionCard, isSelected && styles.selectedOptionCard]}
        onPress={() => setSettings(prev => ({ ...prev, fontFamily: font }))}
      >
        <Text style={{ 
          fontFamily, 
          fontSize: 18, 
          color: isSelected ? '#007AFF' : isDarkMode ? '#aaaaaa' : '#8E8E93'
        }}>Aa</Text>
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

  const renderLineSpacingOption = (spacing: number, label: string) => {
    const isSelected = settings.lineSpacing === spacing;
    return (
      <TouchableOpacity
        style={[styles.optionCard, isSelected && styles.selectedOptionCard]}
        onPress={() => setSettings(prev => ({ ...prev, lineSpacing: spacing }))}
      >
        <View style={{ height: 26, justifyContent: 'center' }}>
          <Ionicons 
            name="reorder-three-outline" 
            size={24} 
            color={isSelected ? '#007AFF' : isDarkMode ? '#aaaaaa' : '#8E8E93'} 
          />
        </View>
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

  return (
    <View style={[styles.container, isDarkMode && styles.darkBackground]}>
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
          <Text style={[styles.backButtonText, isDarkMode && styles.darkText]}>Settings</Text>
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Text Settings</Text>
        <View style={{ width: 60 }} />
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <Text style={[styles.description, isDarkMode && { color: '#aaaaaa' }]}>
          Customize text appearance including size, font, and spacing.
        </Text>
        
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Text Size</Text>
        <View style={styles.optionsRow}>
          {renderTextSizeOption('small', 'Small', 14)}
          {renderTextSizeOption('medium', 'Medium', 18)}
          {renderTextSizeOption('large', 'Large', 22)}
        </View>
        
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Font Family</Text>
        <View style={styles.optionsRow}>
          {renderFontOption('system', 'Default')}
          {renderFontOption('serif', 'Serif')}
          {renderFontOption('monospace', 'Monospace')}
        </View>
        
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Line Spacing</Text>
        <View style={styles.optionsRow}>
          {renderLineSpacingOption(1.0, 'Compact')}
          {renderLineSpacingOption(1.2, 'Normal')}
          {renderLineSpacingOption(1.5, 'Relaxed')}
        </View>
        
        <View style={[styles.previewCard, isDarkMode && { backgroundColor: '#1e1e1e', borderColor: '#333' }]}>
          <Text style={[styles.previewTitle, isDarkMode && styles.darkText]}>Preview</Text>
          <View style={[
            styles.previewContent,
            { backgroundColor: isDarkMode ? '#333' : '#f5f5f5' }
          ]}>
            <Text style={[
              styles.previewText,
              { 
                color: isDarkMode ? '#FFFFFF' : '#000000',
                fontSize: settings.textSize === 'small' ? 14 : 
                        settings.textSize === 'medium' ? 16 : 18,
                fontFamily: settings.fontFamily === 'system' ? undefined : 
                          settings.fontFamily === 'serif' ? 'Times New Roman' : 'Courier',
                lineHeight: settings.textSize === 'small' ? 14 * settings.lineSpacing : 
                          settings.textSize === 'medium' ? 16 * settings.lineSpacing : 
                          18 * settings.lineSpacing,
              }
            ]}>
              This is a sample text that demonstrates how your text settings will appear throughout the application. Customize the text size, font, and spacing to your preference.
            </Text>
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
    </View>
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
  },
  previewText: {
    lineHeight: 22,
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