import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthService from '../../services/AuthService';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('error'), t('pleaseFillAllFields'));
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(t('error'), t('invalidCredentials'));
    } finally {
      setIsLoading(false);
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
          <Text style={[styles.backButtonText, isDarkMode && styles.darkText]}>{t('back')}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>{t('login')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDarkMode && styles.darkText]}>{t('email')}</Text>
            <TextInput
              style={[styles.input, isDarkMode && styles.darkInput]}
              value={email}
              onChangeText={setEmail}
              placeholder={t('enterEmail')}
              placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDarkMode && styles.darkText]}>{t('password')}</Text>
            <TextInput
              style={[styles.input, isDarkMode && styles.darkInput]}
              value={password}
              onChangeText={setPassword}
              placeholder={t('enterPassword')}
              placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isDarkMode && styles.darkLoginButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? t('loggingIn') : t('login')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoContainer}>
          <Text style={[styles.demoText, isDarkMode && styles.darkSecondaryText]}>
            {t('demoCredentials')}
          </Text>
          <Text style={[styles.demoText, isDarkMode && styles.darkSecondaryText]}>
            Email: demo@example.com
          </Text>
          <Text style={[styles.demoText, isDarkMode && styles.darkSecondaryText]}>
            Password: password
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
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  darkCard: {
    backgroundColor: '#1C1C1E',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 17,
    color: '#000000',
  },
  darkInput: {
    borderColor: '#38383A',
    color: '#FFFFFF',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  darkLoginButton: {
    backgroundColor: '#0A84FF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  demoContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  demoText: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 4,
  },
}); 