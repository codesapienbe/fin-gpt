import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatCurrency } from '../services/i18n';
import { InvoiceData } from '../services/InvoiceService';
import SettingsService from '../services/SettingsService';
import ShareInvoiceModal from './ShareInvoiceModal';

interface InvoiceItemProps {
  invoice: InvoiceData;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({ invoice }) => {
  const router = useRouter();
  const [showShare, setShowShare] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState('');
  const [userPreferences, setUserPreferences] = useState<any>(null);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  useEffect(() => {
    if (userPreferences) {
      formatInvoiceAmount();
    }
  }, [userPreferences, invoice]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#4CD964'; // Green
      case 'overdue':
        return '#FF3B30'; // Red
      case 'pending':
      default:
        return '#FF9500'; // Orange
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: { [key: string]: string } } = {
      'en-US': {
        paid: 'Paid',
        pending: 'Pending',
        overdue: 'Overdue'
      },
      'nl-NL': {
        paid: 'Betaald',
        pending: 'In afwachting',
        overdue: 'Verlopen'
      },
      'tr-TR': {
        paid: 'Ödendi',
        pending: 'Beklemede',
        overdue: 'Gecikmiş'
      }
    };
    
    const language = userPreferences?.language || 'en-US';
    return labels[language]?.[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getLabel = (key: string) => {
    const labels: { [key: string]: { [key: string]: string } } = {
      'en-US': {
        invoiceNumber: 'Invoice #{number}',
        clientName: 'Client',
        amount: 'Amount',
        date: 'Date',
        fileName: 'File',
        preview: 'Preview',
        ubl: 'UBL',
        share: 'Share',
        paid: 'Paid',
        pending: 'Pending',
        overdue: 'Overdue'
      },
      'nl-NL': {
        invoiceNumber: 'Factuur #{number}',
        clientName: 'Klant',
        amount: 'Bedrag',
        date: 'Datum',
        fileName: 'Bestand',
        preview: 'Voorbeeld',
        ubl: 'UBL',
        share: 'Delen',
        paid: 'Betaald',
        pending: 'In afwachting',
        overdue: 'Verlopen'
      },
      'tr-TR': {
        invoiceNumber: 'Fatura #{number}',
        clientName: 'Müşteri',
        amount: 'Tutar',
        date: 'Tarih',
        fileName: 'Dosya',
        preview: 'Önizleme',
        ubl: 'UBL',
        share: 'Paylaş',
        paid: 'Ödendi',
        pending: 'Beklemede',
        overdue: 'Gecikmiş'
      }
    };
    
    const language = userPreferences?.language || 'en-US';
    return labels[language]?.[key] || key;
  };

  const getFileIcon = (fileType: string): keyof typeof Ionicons.glyphMap => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'document-text-outline';
      case 'doc':
      case 'docx':
        return 'document-outline';
      case 'xls':
      case 'xlsx':
        return 'grid-outline';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image-outline';
      default:
        return 'document-outline';
    }
  };

  const handleOpenFile = async () => {
    try {
      await Linking.openURL(invoice.fileUri);
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const handleShare = () => {
    setShowShare(true);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={() => router.push(`/invoice/${invoice.id}` as any)}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.invoiceNumber}>{getLabel('invoiceNumber').replace('{number}', invoice.invoiceNumber)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(invoice.status || 'pending') }]}>
              <Text style={styles.statusText}>{getLabel(invoice.status || 'pending')}</Text>
            </View>
          </View>
          
          <View style={styles.detailsRow}>
            <Text style={styles.clientName}>{invoice.clientName}</Text>
            <Text style={styles.amount}>{formattedAmount}</Text>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={14} color="#666" />
              <Text style={styles.date}>{invoice.date}</Text>
            </View>
            <View style={styles.fileContainer}>
              <Ionicons name={getFileIcon(invoice.fileType || '')} size={14} color="#666" />
              <Text style={styles.fileName}>{invoice.fileName}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.previewButton]}
              onPress={handleOpenFile}
            >
              <Ionicons name="eye-outline" size={20} color="#007AFF" />
              <Text style={[styles.actionButtonText, styles.previewButtonText]}>{getLabel('preview')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.ublButton]}
              onPress={handleOpenFile}
            >
              <Ionicons name="code-outline" size={20} color="#007AFF" />
              <Text style={[styles.actionButtonText, styles.ublButtonText]}>{getLabel('ubl')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.shareButton]}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={20} color="#007AFF" />
              <Text style={[styles.actionButtonText, styles.shareButtonText]}>{getLabel('share')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {showShare && (
        <ShareInvoiceModal
          invoice={invoice}
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceNumber: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    color: '#333',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  previewButton: {
    backgroundColor: '#F0F8FF',
  },
  previewButtonText: {
    color: '#007AFF',
  },
  ublButton: {
    backgroundColor: '#F0F8FF',
    marginHorizontal: 8,
  },
  ublButtonText: {
    color: '#007AFF',
  },
  shareButton: {
    backgroundColor: '#F0F8FF',
  },
  shareButtonText: {
    color: '#007AFF',
  },
});

export default InvoiceItem; 