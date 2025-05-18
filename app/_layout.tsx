import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import '../services/i18n';
import { initCurrencyPreference } from '../services/i18n';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { i18n } = useTranslation();

  useEffect(() => {
    // Initialize language and currency preferences
    const setupPreferences = async () => {
      // Initialize currency (already defaults to EUR)
      await initCurrencyPreference();
    };
    
    setupPreferences();
  }, []);

  if (!loaded) {
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
