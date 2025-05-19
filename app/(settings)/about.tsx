import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t } = useTranslation();

  const appVersion = '1.0.0';
  const buildNumber = '1';

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkBackground]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
          <Text style={[styles.backButtonText, isDarkMode && styles.darkText]}>{t('settings')}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>{t('aboutApp')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <View style={styles.appInfo}>
            <View style={[styles.appIcon, { backgroundColor: '#007AFF' }]}>
              <Ionicons name="document-text" size={40} color="#FFFFFF" />
            </View>
            <Text style={[styles.appName, isDarkMode && styles.darkText]}>
              Invoice Management
            </Text>
            <Text style={[styles.appVersion, isDarkMode && styles.darkSecondaryText]}>
              {t('version')} {appVersion} ({buildNumber})
            </Text>
          </View>
        </View>

        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Text style={[styles.menuItemTitle, isDarkMode && styles.darkText]}>
                {t('termsOfService')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Text style={[styles.menuItemTitle, isDarkMode && styles.darkText]}>
                {t('privacyPolicy')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Text style={[styles.menuItemTitle, isDarkMode && styles.darkText]}>
                {t('licenses')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <Text style={[styles.copyright, isDarkMode && styles.darkSecondaryText]}>
            © 2024 Invoice Management
          </Text>
          <Text style={[styles.copyright, isDarkMode && styles.darkSecondaryText]}>
            {t('allRightsReserved')}
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
    overflow: 'hidden',
    marginBottom: 16,
  },
  darkCard: {
    backgroundColor: '#1C1C1E',
  },
  appInfo: {
    alignItems: 'center',
    padding: 24,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 15,
    color: '#8E8E93',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 17,
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#C6C6C8',
    marginLeft: 16,
  },
  darkDivider: {
    backgroundColor: '#38383A',
  },
  copyright: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    padding: 16,
  },
}); 