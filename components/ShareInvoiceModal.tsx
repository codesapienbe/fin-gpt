import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import InvoiceService, { InvoiceData } from '../services/InvoiceService';

interface ShareInvoiceModalProps {
  invoice: InvoiceData;
  onClose: () => void;
}

const ShareInvoiceModal: React.FC<ShareInvoiceModalProps> = ({ invoice, onClose }) => {
  const [shareableLink, setShareableLink] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isGeneratingLink, setIsGeneratingLink] = useState<boolean>(false);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  
  useEffect(() => {
    generateShareableLink();
  }, []);
  
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
  
  return (
    <BlurView intensity={90} style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>Share Invoice</Text>
        <Text style={styles.subtitle}>Invoice #{invoice.invoiceNumber} - {invoice.clientName}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Copy Link</Text>
          
          <View style={styles.linkContainer}>
            {isGeneratingLink ? (
              <ActivityIndicator color="#007AFF" style={styles.loader} />
            ) : (
              <>
                <Text style={styles.link} numberOfLines={1}>{shareableLink}</Text>
                <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
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
            onPress={sendEmail}
            disabled={isSendingEmail}
          >
            <Text style={styles.buttonText}>
              {isSendingEmail ? 'Sending...' : 'Send Email'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Options</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.shareButton]}
            onPress={shareViaSystem}
          >
            <Text style={styles.buttonText}>Share via System</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={onClose}
        >
          <Text style={styles.cancelButtonText}>Close</Text>
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
  },
  emailButton: {
    backgroundColor: '#007AFF',
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
  cancelButtonText: {
    fontWeight: '600',
    color: '#666',
  },
});

export default ShareInvoiceModal; 