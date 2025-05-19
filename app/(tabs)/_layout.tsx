import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SettingsService from '../../services/SettingsService';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [userPreferences, setUserPreferences] = React.useState<any>(null);

  React.useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const preferences = await SettingsService.getUserPreferences();
      setUserPreferences(preferences);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const getLabel = (key: string) => {
    const labels: { [key: string]: { [key: string]: string } } = {
      'en-US': {
        home: 'Home',
        invoices: 'Invoices',
        settings: 'Settings'
      },
      'nl-NL': {
        home: 'Home',
        invoices: 'Facturen',
        settings: 'Instellingen'
      },
      'tr-TR': {
        home: 'Ana Sayfa',
        invoices: 'Faturalar',
        settings: 'Ayarlar'
      }
    };
    
    const language = userPreferences?.language || 'en-US';
    return labels[language]?.[key] || key;
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: getLabel('home'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: getLabel('invoices'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: getLabel('settings'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
