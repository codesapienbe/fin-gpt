import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  date: string;
  fileName: string;
  fileUri: string;
  fileType: string;
  uploadDate: string;
}

interface InvoiceItemProps {
  invoice: InvoiceData;
  onPress: (invoice: InvoiceData) => void;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({ invoice, onPress }) => {
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const getFileIcon = () => {
    if (invoice.fileType.includes('pdf')) {
      return 'document-text-outline' as const;
    } else if (invoice.fileType.includes('image')) {
      return 'image-outline' as const;
    }
    return 'document-outline' as const;
  };
  
  const openFile = async () => {
    try {
      if (invoice.fileUri) {
        await WebBrowser.openBrowserAsync(invoice.fileUri);
      }
    } catch (error: unknown) {
      Alert.alert('Error opening file', (error as Error).message || 'Unknown error occurred');
    }
  };
  
  const shareInvoice = async () => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing is not available on this device');
        return;
      }
      
      // For sharing a file, we need to use the shareAsync method
      await Sharing.shareAsync(invoice.fileUri, {
        dialogTitle: `Share Invoice #${invoice.invoiceNumber}`,
        UTI: invoice.fileType.includes('pdf') ? 'com.adobe.pdf' : 'public.image',
      });
    } catch (error: unknown) {
      Alert.alert('Error sharing file', (error as Error).message || 'Unknown error occurred');
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(invoice)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getFileIcon()} size={24} color="#007AFF" />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.invoiceNumber}>Invoice #{invoice.invoiceNumber}</Text>
        <Text style={styles.clientName}>{invoice.clientName}</Text>
        <Text style={styles.date}>{invoice.date}</Text>
      </View>
      
      <View style={styles.rightContainer}>
        <Text style={styles.amount}>{formatCurrency(invoice.amount)}</Text>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={openFile}
          >
            <Ionicons name="eye-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={shareInvoice}
          >
            <Ionicons name="share-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
});

export default InvoiceItem; 