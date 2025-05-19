import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { formatCurrency } from '../services/i18n';
import InvoiceService, { InvoiceData } from '../services/InvoiceService';
import SettingsService from '../services/SettingsService';

interface ShareInvoiceModalProps {
  invoice: InvoiceData;
  onClose: () => void;
}

const ShareInvoiceModal: React.FC<ShareInvoiceModalProps> = ({ invoice, onClose }) => {
  const [shareableLink, setShareableLink] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isGeneratingLink, setIsGeneratingLink] = useState<boolean>(false);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [formattedAmount, setFormattedAmount] = useState('');
  const [userPreferences, setUserPreferences] = useState<any>(null);
  
  useEffect(() => {
    generateShareableLink();
    loadUserPreferences();
  }, []);
  
  useEffect(() => {
    if (userPreferences) {
      formatInvoiceAmount();
    }
  }, [userPreferences, invoice]);
  
  const generateShareableLink = async () => {
    setIsGeneratingLink(true);
    try {
      const link = await InvoiceService.createShareableLink(invoice.id);
      setShareableLink(link);
    } catch (error: unknown) {
      Alert.alert('Error', 'Failed to generate shareable link');
    } finally {
      setIsGeneratingLink(false);
    }
  };
  
  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(shareableLink);
      Alert.alert('Success', 'Link copied to clipboard');
    } catch (error: unknown) {
      Alert.alert('Error', 'Failed to copy link to clipboard');
    }
  };
  
  const sendEmail = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    setIsSendingEmail(true);
    
    try {
      // In a real app, this would send the email via a server
      // For this demo, we'll just simulate a successful send
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', `Invoice shared to ${email}`);
      onClose();
    } catch (error: unknown) {
      Alert.alert('Error', 'Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };
  
  const shareViaSystem = async () => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing is not available on this device');
        return;
      }
      
      await Sharing.shareAsync(invoice.fileUri, {
        dialogTitle: `Share Invoice #${invoice.invoiceNumber}`,
        UTI: invoice.fileType.includes('pdf') ? 'com.adobe.pdf' : 'public.image',
      });
    } catch (error: unknown) {
      Alert.alert('Error', 'Failed to share invoice');
    }
  };

  const shareViaWhatsApp = async () => {
    try {
      const message = `Invoice #${invoice.invoiceNumber} - ${invoice.clientName}\nAmount: $${invoice.amount}\nDate: ${invoice.date}\n\nView invoice: ${shareableLink}`;
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
      
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (!canOpen) {
        Alert.alert('Error', 'WhatsApp is not installed on this device');
        return;
      }
      
      await Linking.openURL(whatsappUrl);
    } catch (error: unknown) {
      Alert.alert('Error', 'Failed to share via WhatsApp');
    }
  };
  
  const loadUserPreferences = async () => {
    try {
      const preferences = await SettingsService.getUserPreferences();
      setUserPreferences(preferences);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const formatInvoiceAmount = async () => {
    try {
      const formatted = await formatCurrency(invoice.amount);
      setFormattedAmount(formatted);
    } catch (error) {
      console.error('Error formatting amount:', error);
      setFormattedAmount(`${invoice.amount}`);
    }
  };

  const getLabel = (key: string) => {
    const labels: { [key: string]: { [key: string]: string } } = {
      'en-US': {
        shareInvoice: 'Share Invoice',
        copyLink: 'Copy Link',
        shareEmail: 'Share via Email',
        shareWhatsApp: 'Share via WhatsApp',
        shareSystem: 'Share via System',
        close: 'Close',
        shareMessage: 'Invoice #{number} for {client} - {amount} ({date})',
        whatsAppNotInstalled: 'WhatsApp is not installed on your device'
      },
      'nl-NL': {
        shareInvoice: 'Factuur Delen',
        copyLink: 'Link Kopiëren',
        shareEmail: 'Delen via E-mail',
        shareWhatsApp: 'Delen via WhatsApp',
        shareSystem: 'Delen via Systeem',
        close: 'Sluiten',
        shareMessage: 'Factuur #{number} voor {client} - {amount} ({date})',
        whatsAppNotInstalled: 'WhatsApp is niet geïnstalleerd op uw apparaat'
      },
      'tr-TR': {
        shareInvoice: 'Faturayı Paylaş',
        copyLink: 'Bağlantıyı Kopyala',
        shareEmail: 'E-posta ile Paylaş',
        shareWhatsApp: 'WhatsApp ile Paylaş',
        shareSystem: 'Sistem ile Paylaş',
        close: 'Kapat',
        shareMessage: '{client} için #{number} numaralı fatura - {amount} ({date})',
        whatsAppNotInstalled: 'WhatsApp cihazınızda yüklü değil'
      }
    };
    
    const language = userPreferences?.language || 'en-US';
    return labels[language]?.[key] || key;
  };

  const handleCopyLink = async () => {
    try {
      await Linking.openURL(invoice.fileUri);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleShareEmail = async () => {
    try {
      const subject = getLabel('shareMessage')
        .replace('{number}', invoice.invoiceNumber)
        .replace('{client}', invoice.clientName)
        .replace('{amount}', formattedAmount)
        .replace('{date}', invoice.date);
      
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(invoice.fileUri)}`;
      await Linking.openURL(mailtoUrl);
    } catch (error) {
      console.error('Error sharing via email:', error);
    }
  };

  const handleShareWhatsApp = async () => {
    try {
      const message = getLabel('shareMessage')
        .replace('{number}', invoice.invoiceNumber)
        .replace('{client}', invoice.clientName)
        .replace('{amount}', formattedAmount)
        .replace('{date}', invoice.date);
      
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message + '\n\n' + invoice.fileUri)}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        console.error(getLabel('whatsAppNotInstalled'));
      }
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
    }
  };

  const handleShareSystem = async () => {
    try {
      await Linking.openURL(invoice.fileUri);
    } catch (error) {
      console.error('Error sharing via system:', error);
    }
  };

  return (
    <BlurView intensity={90} style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>{getLabel('shareInvoice')}</Text>
        <Text style={styles.subtitle}>Invoice #{invoice.invoiceNumber} - {invoice.clientName}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Copy Link</Text>
          
          <View style={styles.linkContainer}>
            {isGeneratingLink ? (
              <ActivityIndicator color="#007AFF" style={styles.loader} />
            ) : (
              <>
                <Text style={styles.link} numberOfLines={1}>{shareableLink}</Text>
                <TouchableOpacity onPress={handleCopyLink} style={styles.copyButton}>
                  <Ionicons name="copy-outline" size={20} color="#007AFF" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share via Email</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TouchableOpacity 
            style={[styles.button, styles.emailButton]}
            onPress={handleShareEmail}
            disabled={isSendingEmail}
          >
            <Text style={styles.buttonText}>
              {isSendingEmail ? 'Sending...' : getLabel('shareEmail')}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Options</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.whatsappButton]}
            onPress={handleShareWhatsApp}
          >
            <Ionicons name="logo-whatsapp" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{getLabel('shareWhatsApp')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.shareButton]}
            onPress={handleShareSystem}
          >
            <Ionicons name="share-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{getLabel('shareSystem')}</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={onClose}
        >
          <Text style={styles.cancelButtonText}>{getLabel('close')}</Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modal: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
  link: {
    flex: 1,
    color: '#007AFF',
    fontSize: 14,
  },
  copyButton: {
    padding: 5,
  },
  loader: {
    padding: 10,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emailButton: {
    backgroundColor: '#007AFF',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  shareButton: {
    backgroundColor: '#4CD964',
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
  },
  buttonText: {
    fontWeight: '600',
    color: '#fff',
  },
  buttonIcon: {
    marginRight: 8,
  },
  cancelButtonText: {
    fontWeight: '600',
    color: '#666',
  },
});

export default ShareInvoiceModal; 