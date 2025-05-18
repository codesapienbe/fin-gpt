import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

import { Language, LanguageOption, LANGUAGES } from '@/services/i18n';

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (langCode: Language) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkBackground]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
          <Text style={[styles.backButtonText, isDarkMode && styles.darkText]}>{t('settings')}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>{t('language')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <Text style={[styles.description, isDarkMode && styles.darkSecondaryText]}>
        {t('languageDescription')}
      </Text>

      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        {LANGUAGES.map((language: LanguageOption) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageOption,
              { backgroundColor: isDarkMode ? '#1e1e1e' : 'white' }
            ]}
            onPress={() => handleLanguageChange(language.code)}
          >
            <View style={styles.languageDetails}>
              <Text style={[styles.languageName, isDarkMode && styles.darkText]}>
                {language.name}
              </Text>
              <Text style={[styles.nativeName, isDarkMode && styles.darkSecondaryText]}>
                {language.nativeName}
              </Text>
            </View>
            
            {i18n.language === language.code && (
              <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
            )}
          </TouchableOpacity>
        ))}
      </View>
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
  darkText: {
    color: '#ffffff',
  },
  darkSecondaryText: {
    color: '#aaaaaa',
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
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
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageDetails: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
  },
  nativeName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  }
}); 