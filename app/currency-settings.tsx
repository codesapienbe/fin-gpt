import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

import { CURRENCIES, Currency, CurrencyOption, getCurrentCurrency, setCurrentCurrency } from '@/services/i18n';

export default function CurrencySettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t } = useTranslation();
  const [currentCurrency, setCurrentCurrencyState] = useState<Currency>('EUR');

  useEffect(() => {
    const loadCurrency = async () => {
      const currency = await getCurrentCurrency();
      setCurrentCurrencyState(currency);
    };
    
    loadCurrency();
  }, []);

  const handleCurrencyChange = async (currencyCode: Currency) => {
    await setCurrentCurrency(currencyCode);
    setCurrentCurrencyState(currencyCode);
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
        <Text style={[styles.title, isDarkMode && styles.darkText]}>{t('currency')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <Text style={[styles.description, isDarkMode && styles.darkSecondaryText]}>
        {t('currencyDescription')}
      </Text>

      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        {CURRENCIES.map((currency: CurrencyOption) => (
          <TouchableOpacity
            key={currency.code}
            style={[
              styles.currencyOption,
              { backgroundColor: isDarkMode ? '#1e1e1e' : 'white' }
            ]}
            onPress={() => handleCurrencyChange(currency.code)}
          >
            <View style={styles.currencyDetails}>
              <Text style={[styles.currencyName, isDarkMode && styles.darkText]}>
                {currency.name}
              </Text>
              <Text style={[styles.currencyCode, isDarkMode && styles.darkSecondaryText]}>
                {currency.symbol} ({currency.code})
              </Text>
            </View>
            
            {currentCurrency === currency.code && (
              <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <View style={[styles.infoCard, isDarkMode && styles.darkCard]}>
          <Text style={[styles.infoTitle, isDarkMode && styles.darkText]}>
            {t('currencyInfo')}
          </Text>
          <Text style={[styles.infoText, isDarkMode && styles.darkSecondaryText]}>
            {t('currencyInfoDescription')}
          </Text>
        </View>
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
  currencyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  currencyDetails: {
    flex: 1,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '500',
  },
  currencyCode: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  infoContainer: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
}); 