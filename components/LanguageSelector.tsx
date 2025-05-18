import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Language, LANGUAGES } from '../services/i18n';

interface LanguageSelectorProps {
  onChangeLanguage?: (langCode: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onChangeLanguage }) => {
  const { i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = LANGUAGES.find(
    lang => lang.code === (i18n.language as Language)
  ) || LANGUAGES[0];

  const handleLanguageChange = (langCode: Language) => {
    i18n.changeLanguage(langCode);
    setModalVisible(false);
    if (onChangeLanguage) {
      onChangeLanguage(langCode);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>{currentLanguage.name}</Text>
        <Ionicons name="chevron-down" size={16} color="#007AFF" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={90} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            
            {LANGUAGES.map(language => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  language.code === i18n.language && styles.selectedLanguage
                ]}
                onPress={() => handleLanguageChange(language.code)}
              >
                <Text style={[
                  styles.languageName,
                  language.code === i18n.language && styles.selectedLanguageText
                ]}>
                  {language.name}
                </Text>
                <Text style={[
                  styles.nativeName,
                  language.code === i18n.language && styles.selectedLanguageText
                ]}>
                  {language.nativeName}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedLanguage: {
    backgroundColor: '#007AFF',
  },
  languageName: {
    fontSize: 16,
    color: '#333',
  },
  nativeName: {
    fontSize: 16,
    color: '#666',
  },
  selectedLanguageText: {
    color: 'white',
    fontWeight: '500',
  },
  closeButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default LanguageSelector; 