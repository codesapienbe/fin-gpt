import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthSettings {
  biometricEnabled: boolean;
  pinEnabled: boolean;
  autoLockEnabled: boolean;
  autoLockAfter: number; // minutes
  notificationsEnabled: boolean;
}

export default function AuthenticationScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [settings, setSettings] = useState<AuthSettings>({
    biometricEnabled: false,
    pinEnabled: false,
    autoLockEnabled: false,
    autoLockAfter: 5,
    notificationsEnabled: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load auth settings
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('authSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Failed to load auth settings', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      await AsyncStorage.setItem('authSettings', JSON.stringify(settings));
      
      // Simulate network delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Authentication settings saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save authentication settings');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleOption = (option: keyof AuthSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [option]: value,
    }));
    
    // If turning on PIN, simulate PIN setup
    if (option === 'pinEnabled' && value) {
      Alert.alert(
        'Set PIN Code',
        'In a full implementation, a PIN setup flow would appear here.',
        [{ text: 'OK' }]
      );
    }
    
    // If turning on biometrics, simulate permission request
    if (option === 'biometricEnabled' && value) {
      Alert.alert(
        'Enable Biometric Authentication',
        'In a full implementation, the app would request biometric authentication permissions here.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSelectAutoLockTime = () => {
    Alert.alert(
      'Auto-Lock After',
      'Select time before auto-lock activates',
      [
        { text: '1 minute', onPress: () => setSettings(prev => ({ ...prev, autoLockAfter: 1 })) },
        { text: '5 minutes', onPress: () => setSettings(prev => ({ ...prev, autoLockAfter: 5 })) },
        { text: '15 minutes', onPress: () => setSettings(prev => ({ ...prev, autoLockAfter: 15 })) },
        { text: '30 minutes', onPress: () => setSettings(prev => ({ ...prev, autoLockAfter: 30 })) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkBackground]} edges={['top', 'right', 'left']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={isDarkMode ? '#ffffff' : '#000000'} 
          />
          <Text style={[styles.backButtonText, isDarkMode && styles.darkText]}>Settings</Text>
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Authentication</Text>
        <View style={{ width: 60 }} />
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <Text style={[styles.description, isDarkMode && { color: '#aaaaaa' }]}>
          Configure authentication options to protect your invoice data.
        </Text>
        
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>Enable Biometric Authentication</Text>
              <Text style={[styles.settingDescription, isDarkMode && { color: '#aaaaaa' }]}>
                Use Face ID, Touch ID, or fingerprint to access the app
              </Text>
            </View>
            <Switch
              value={settings.biometricEnabled}
              onValueChange={(value) => handleToggleOption('biometricEnabled', value)}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={[styles.separator, isDarkMode && { backgroundColor: '#333333' }]} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>PIN Code Authentication</Text>
              <Text style={[styles.settingDescription, isDarkMode && { color: '#aaaaaa' }]}>
                Protect the app with a numeric PIN code
              </Text>
            </View>
            <Switch
              value={settings.pinEnabled}
              onValueChange={(value) => handleToggleOption('pinEnabled', value)}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          {settings.pinEnabled && (
            <TouchableOpacity 
              style={[styles.subOption, isDarkMode && { backgroundColor: '#2a2a2a' }]}
              onPress={() => Alert.alert('Change PIN', 'In a full implementation, a PIN change flow would appear here.')}
            >
              <Text style={styles.subOptionText}>Change PIN Code</Text>
              <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#8E8E93' : '#8E8E93'} />
            </TouchableOpacity>
          )}
          
          <View style={[styles.separator, isDarkMode && { backgroundColor: '#333333' }]} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>Auto-Lock App</Text>
              <Text style={[styles.settingDescription, isDarkMode && { color: '#aaaaaa' }]}>
                Automatically lock the app after a period of inactivity
              </Text>
            </View>
            <Switch
              value={settings.autoLockEnabled}
              onValueChange={(value) => handleToggleOption('autoLockEnabled', value)}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          {settings.autoLockEnabled && (
            <TouchableOpacity 
              style={[styles.subOption, isDarkMode && { backgroundColor: '#2a2a2a' }]}
              onPress={handleSelectAutoLockTime}
            >
              <Text style={styles.subOptionText}>Auto-Lock After</Text>
              <View style={styles.timeOption}>
                <Text style={[styles.timeOptionText, isDarkMode && { color: '#aaaaaa' }]}>{settings.autoLockAfter} minutes</Text>
                <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#8E8E93' : '#8E8E93'} />
              </View>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>Login Notifications</Text>
              <Text style={[styles.settingDescription, isDarkMode && { color: '#aaaaaa' }]}>
                Receive notifications when someone logs into your account
              </Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(value) => handleToggleOption('notificationsEnabled', value)}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.savingButton]} 
          onPress={handleSaveSettings}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.dangerButton, isDarkMode && { backgroundColor: '#2a1515', borderColor: '#FF3B30' }]} 
          onPress={() => Alert.alert(
            'Reset Authentication',
            'This will reset all authentication settings. Are you sure you want to continue?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Reset', 
                style: 'destructive',
                onPress: () => {
                  setSettings({
                    biometricEnabled: false,
                    pinEnabled: false,
                    autoLockEnabled: false,
                    autoLockAfter: 5,
                    notificationsEnabled: true,
                  });
                  Alert.alert('Success', 'Authentication settings have been reset.');
                }
              },
            ]
          )}
        >
          <Text style={styles.dangerButtonText}>Reset Authentication Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  darkCard: {
    backgroundColor: '#1e1e1e',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
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
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    lineHeight: 22,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 16,
  },
  subOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F9',
  },
  subOptionText: {
    fontSize: 15,
    color: '#007AFF',
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeOptionText: {
    fontSize: 15,
    color: '#8E8E93',
    marginRight: 4,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  savingButton: {
    backgroundColor: '#78B6FF',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  dangerButton: {
    backgroundColor: '#FFF0F0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  dangerButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 16,
  },
}); 