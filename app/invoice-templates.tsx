import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Template {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  color: string;
  icon: string;
}

export default function InvoiceTemplatesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [selectedTemplate, setSelectedTemplate] = useState<string>('template1');
  const [isSaving, setIsSaving] = useState(false);

  // Predefined templates
  const templates: Template[] = [
    {
      id: 'template1',
      name: 'Simple',
      description: 'A clean, minimal template with essential invoice details.',
      isDefault: true,
      color: '#007AFF',
      icon: 'receipt-outline'
    },
    {
      id: 'template2',
      name: 'Professional',
      description: 'A more detailed template with additional business information.',
      isDefault: false,
      color: '#34C759',
      icon: 'briefcase-outline'
    },
    {
      id: 'template3',
      name: 'Modern',
      description: 'Contemporary design with color accents and modern typography.',
      isDefault: false,
      color: '#5856D6',
      icon: 'trending-up-outline'
    },
    {
      id: 'template4',
      name: 'Classic',
      description: 'Traditional invoice layout with formal styling.',
      isDefault: false,
      color: '#FF9500',
      icon: 'newspaper-outline'
    },
  ];

  React.useEffect(() => {
    // Load the saved template preference
    const loadTemplatePreference = async () => {
      try {
        const savedTemplate = await AsyncStorage.getItem('selectedTemplate');
        if (savedTemplate) {
          setSelectedTemplate(savedTemplate);
        }
      } catch (error) {
        console.error('Failed to load template preference', error);
      }
    };
    
    loadTemplatePreference();
  }, []);

  const handleSavePreference = async () => {
    setIsSaving(true);
    
    try {
      await AsyncStorage.setItem('selectedTemplate', selectedTemplate);
      
      // Simulate network delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Template preference saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save template preference');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Render a stylized template preview
  const renderTemplatePreview = (template: Template) => {
    return (
      <View style={[styles.templatePreview, { borderColor: template.color }]}>
        <View style={[styles.previewHeader, { backgroundColor: template.color }]}>
          <Ionicons name={template.icon as any} size={16} color="white" />
          <Text style={styles.previewHeaderText}>{template.name}</Text>
        </View>
        
        <View style={styles.previewContent}>
          {/* Company info */}
          <View style={styles.previewCompany}>
            <View style={styles.previewCompanyLogo}>
              <Text style={{ color: template.color, fontWeight: 'bold' }}>ABC</Text>
            </View>
            <View style={styles.previewCompanyDetails}>
              <View style={[styles.previewTextBlock, isDarkMode && { backgroundColor: '#555' }]} />
              <View style={[styles.previewTextBlock, isDarkMode && { backgroundColor: '#555' }]} />
            </View>
          </View>
          
          {/* Line items */}
          <View style={styles.previewLineItems}>
            <View style={[styles.previewLineItem, isDarkMode && { backgroundColor: '#555' }]} />
            <View style={[styles.previewLineItem, isDarkMode && { backgroundColor: '#555' }]} />
            <View style={[styles.previewLineItem, isDarkMode && { backgroundColor: '#555' }]} />
          </View>
          
          {/* Total */}
          <View style={styles.previewTotal}>
            <View style={[styles.previewTotalBox, { backgroundColor: `${template.color}20` }]} />
          </View>
        </View>
      </View>
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
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Invoice Templates</Text>
        <View style={{ width: 60 }} />
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <Text style={[styles.description, isDarkMode && { color: '#aaaaaa' }]}>
          Choose a template for your invoices. The selected template will be used when sharing or exporting invoices.
        </Text>
        
        <View style={styles.templatesContainer}>
          {templates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={[
                styles.templateCard,
                isDarkMode && styles.darkCard,
                selectedTemplate === template.id && styles.selectedTemplateCard,
                selectedTemplate === template.id && { borderColor: template.color }
              ]}
              onPress={() => setSelectedTemplate(template.id)}
            >
              {renderTemplatePreview(template)}
              
              <View style={styles.templateInfo}>
                <Text style={[styles.templateName, isDarkMode && styles.darkText]}>{template.name}</Text>
                <Text style={[styles.templateDescription, isDarkMode && { color: '#aaaaaa' }]}>{template.description}</Text>
              </View>
              {selectedTemplate === template.id && (
                <Ionicons 
                  name="checkmark-circle" 
                  size={24} 
                  color={template.color} 
                  style={styles.checkmark} 
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.customizeButton,
            isDarkMode && { backgroundColor: '#1e1e1e', borderColor: '#007AFF' }
          ]} 
          onPress={() => Alert.alert('Coming Soon', 'Custom template creation will be available in a future update.')}
        >
          <Ionicons name="color-palette-outline" size={20} color="#007AFF" />
          <Text style={styles.customizeButtonText}>Create Custom Template</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.savingButton]} 
          onPress={handleSavePreference}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Preference'}
          </Text>
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
  templatesContainer: {
    marginBottom: 20,
  },
  templateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTemplateCard: {
    borderColor: '#007AFF',
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  templateDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  templatePreview: {
    width: 80,
    height: 100,
    borderRadius: 6,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  previewHeader: {
    backgroundColor: '#007AFF',
    paddingVertical: 3,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewHeaderText: {
    color: 'white',
    fontSize: 7,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  previewContent: {
    padding: 5,
    flex: 1,
  },
  previewCompany: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  previewCompanyLogo: {
    width: 16,
    height: 16,
    borderRadius: 3,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  previewCompanyDetails: {
    flex: 1,
  },
  previewTextBlock: {
    height: 3,
    backgroundColor: '#E0E0E0',
    borderRadius: 1,
    marginBottom: 2,
  },
  previewLineItems: {
    marginBottom: 5,
  },
  previewLineItem: {
    height: 3,
    backgroundColor: '#E0E0E0',
    borderRadius: 1,
    marginBottom: 3,
    width: '100%',
  },
  previewTotal: {
    alignItems: 'flex-end',
  },
  previewTotalBox: {
    width: 25,
    height: 7,
    backgroundColor: '#E6F7FF',
    borderRadius: 2,
  },
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  customizeButtonText: {
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  savingButton: {
    backgroundColor: '#78B6FF',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
}); 