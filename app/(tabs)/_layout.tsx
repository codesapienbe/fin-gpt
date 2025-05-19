import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, TouchableOpacity, useColorScheme } from 'react-native';

import { authService } from '../../services/auth';
import '../../services/i18n';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert(t('error'), t('logoutError'));
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff',
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={handleLogout}
            style={{ marginRight: 16 }}
          >
            <Ionicons
              name="log-out-outline"
              size={24}
              color={colorScheme === 'dark' ? '#ffffff' : '#000000'}
            />
          </TouchableOpacity>
        ),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: t('dashboard'),
          headerTitle: t('dashboard'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t('invoices'),
          headerTitle: t('myInvoices'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('search'),
          headerTitle: t('searchInvoices'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          headerTitle: t('settings'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
