import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpSupportScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t } = useTranslation();

  const handleContactSupport = () => {
    // TODO: Implement contact support functionality
  };

  const handleViewFAQs = () => {
    // TODO: Implement FAQs view
  };

  const handleViewTutorials = () => {
    // TODO: Implement tutorials view
  };

  const SupportOption = ({ 
    icon, 
    title, 
    description, 
    onPress,
    color = '#007AFF'
  }: { 
    icon: string;
    title: string;
    description: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity
      style={[styles.option, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.optionContent}>
        <Text style={[styles.optionTitle, isDarkMode && styles.darkText]}>
          {title}
        </Text>
        <Text style={[styles.optionDescription, isDarkMode && styles.darkSecondaryText]}>
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
    </TouchableOpacity>
  );

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
        <Text style={[styles.title, isDarkMode && styles.darkText]}>{t('helpSupport')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <SupportOption
            icon="help-circle-outline"
            title={t('faqs')}
            description={t('faqsDescription')}
            onPress={handleViewFAQs}
            color="#FF9500"
          />
          <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
          <SupportOption
            icon="book-outline"
            title={t('tutorials')}
            description={t('tutorialsDescription')}
            onPress={handleViewTutorials}
            color="#5856D6"
          />
          <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
          <SupportOption
            icon="mail-outline"
            title={t('contactSupport')}
            description={t('contactSupportDescription')}
            onPress={handleContactSupport}
            color="#34C759"
          />
        </View>

        <View style={[styles.infoCard, isDarkMode && styles.darkCard]}>
          <Text style={[styles.infoTitle, isDarkMode && styles.darkText]}>
            {t('supportHours')}
          </Text>
          <Text style={[styles.infoText, isDarkMode && styles.darkSecondaryText]}>
            {t('supportHoursDescription')}
          </Text>
        </View>

        <View style={[styles.infoCard, isDarkMode && styles.darkCard]}>
          <Text style={[styles.infoTitle, isDarkMode && styles.darkText]}>
            {t('emergencySupport')}
          </Text>
          <Text style={[styles.infoText, isDarkMode && styles.darkSecondaryText]}>
            {t('emergencySupportDescription')}
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
  option: {
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
  optionContent: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#000000',
  },
  optionDescription: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#C6C6C8',
    marginLeft: 72,
  },
  darkDivider: {
    backgroundColor: '#38383A',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 20,
  },
}); 