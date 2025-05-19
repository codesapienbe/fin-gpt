import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { authService } from '../../services/auth';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert(t('error'), t('resetPasswordErrorEmptyEmail'));
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email);
      Alert.alert(
        t('success'),
        t('resetPasswordSuccess'),
        [
          {
            text: t('ok'),
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('error'), t('resetPasswordError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Ionicons name="key" size={64} color="#007AFF" />
          <Text style={styles.title}>{t('forgotPassword')}</Text>
          <Text style={styles.subtitle}>{t('resetPasswordSubtitle')}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.buttonText}>{t('sending')}</Text>
            ) : (
              <Text style={styles.buttonText}>{t('resetPassword')}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={20} color="#007AFF" style={styles.backIcon} />
            <Text style={styles.backText}>{t('backToLogin')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 24,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  backIcon: {
    marginRight: 8,
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 