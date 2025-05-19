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
import { authService } from '../services/auth';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('error'), t('loginErrorEmptyFields'));
      return;
    }

    setIsLoading(true);
    try {
      await authService.login({ email, password });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(t('error'), t('loginErrorInvalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
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
          <Ionicons name="document-text" size={64} color="#007AFF" />
          <Text style={styles.title}>{t('welcomeBack')}</Text>
          <Text style={styles.subtitle}>{t('loginSubtitle')}</Text>
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

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>{t('forgotPassword')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.buttonText}>{t('loggingIn')}</Text>
            ) : (
              <Text style={styles.buttonText}>{t('login')}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>{t('noAccount')}</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>{t('register')}</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 16,
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
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
    marginRight: 4,
  },
  registerLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
}); 