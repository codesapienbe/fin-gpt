import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SettingsItem = ({ 
  icon, 
  title, 
  description, 
  onPress,
  color = '#007AFF' 
}: {
  icon: string;
  title: string;
  description?: string;
  onPress: () => void;
  color?: string;
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon as any} size={24} color={color} />
    </View>
    <View style={styles.settingTextContainer}>
      <Text style={styles.settingTitle}>{title}</Text>
      {description && <Text style={styles.settingDescription}>{description}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const router = useRouter();

  const handleNotImplemented = () => {
    Alert.alert(
      'Coming Soon',
      'This feature will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="person-outline"
            title="Profile"
            description="Set up your user profile and business details"
            onPress={() => router.push('/profile')}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="key-outline"
            title="Authentication"
            description="Set up secure authentication for your account"
            onPress={() => router.push('/authentication')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invoices</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="document-text-outline"
            title="Invoice Templates"
            description="Customize the appearance of your invoices"
            onPress={() => router.push('/invoice-templates')}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="folder-outline"
            title="Default Save Location"
            description="Choose where to save your invoice documents"
            onPress={handleNotImplemented}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="cloud-upload-outline"
            title="Cloud Backup"
            description="Configure automatic backup of your invoices"
            onPress={handleNotImplemented}
            color="#5856D6"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="color-palette-outline"
            title="Theme"
            description="Choose between light, dark or system theme"
            onPress={() => router.push('/theme-settings')}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="text-outline"
            title="Text Size"
            description="Adjust the text size across the app"
            onPress={() => router.push('/theme-settings')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <SettingsItem
            icon="information-circle-outline"
            title="About This App"
            description="Version 1.0.0"
            onPress={handleNotImplemented}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="help-circle-outline"
            title="Help & Support"
            description="Get assistance with using the app"
            onPress={handleNotImplemented}
            color="#34C759"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Invoice Management App v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginHorizontal: 16,
    marginBottom: 8,
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
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 56,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
  },
}); 