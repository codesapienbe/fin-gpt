import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';

import '../../services/i18n';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

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
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: t('home'),
          headerTitle: t('assistant'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('dashboard'),
          headerTitle: t('financialDashboard'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
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
    </Tabs>
  );
}

// Custom TabBar button for the actions tab (makes it look special)
function TabBarButton(props: any) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  return (
    <TabBarSpecial 
      {...props}
      color={props.accessibilityState.selected ? "#007AFF" : "#8E8E93"}
      isDarkMode={isDarkMode}
    />
  );
}

// Special tab bar button with slightly different styling
function TabBarSpecial({ 
  onPress, 
  color, 
  children,
  isDarkMode
}: {
  onPress: () => void;
  color: string;
  children: React.ReactNode;
  isDarkMode: boolean;
}) {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
}
