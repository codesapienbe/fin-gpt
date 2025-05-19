import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { authService } from '../services/auth';
import '../services/i18n';
import { initCurrencyPreference } from '../services/i18n';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { i18n } = useTranslation();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize language and currency preferences
    const setupPreferences = async () => {
      // Initialize currency (already defaults to EUR)
      await initCurrencyPreference();
    };
    
    setupPreferences();
  }, []);

  useEffect(() => {
    // Initialize auth state
    authService.init().then(() => {
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and trying to access auth screens
      router.replace('/(tabs)');
    }
  }, [isReady, segments]);

  if (!loaded || !isReady) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="language-settings" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="currency-settings" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="theme-settings" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="text-settings" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
