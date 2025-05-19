import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatCurrency } from '../../services/i18n';
import InvoiceService, { InvoiceData } from '../../services/InvoiceService';
import SettingsService from '../../services/SettingsService';

export default function InvoiceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState('');
  const [userPreferences, setUserPreferences] = useState<any>(null);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  useEffect(() => {
    if (userPreferences) {
      loadInvoice();
    }
  }, [userPreferences]);

  const loadUserPreferences = async () => {
    try {
      const preferences = await SettingsService.getUserPreferences();
      setUserPreferences(preferences);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const loadInvoice = async () => {
    try {
      const invoiceData = await InvoiceService.getInvoiceById(id as string);
      setInvoice(invoiceData);
      if (invoiceData) {
        const formatted = await formatCurrency(invoiceData.amount);
        setFormattedAmount(formatted);
        // Track this invoice as recently viewed
        await SettingsService.addRecentInvoice(invoiceData.id);
        await SettingsService.setLastViewedInvoice(invoiceData.id);
      }
    } catch (error) {
      console.error('Error loading invoice:', error);
    } finally {
      setLoading(false);
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
        basicInfo: 'Basic Information',
        invoiceNumber: 'Invoice Number',
        date: 'Date',
        dueDate: 'Due Date',
        status: 'Status',
        clientInfo: 'Client Information',
        clientName: 'Client Name',
        clientEmail: 'Client Email',
        clientPhone: 'Client Phone',
        financialInfo: 'Financial Information',
        amount: 'Amount',
        currency: 'Currency',
        taxRate: 'Tax Rate',
        taxAmount: 'Tax Amount',
        totalAmount: 'Total Amount',
        documentInfo: 'Document Information',
        fileName: 'File Name',
        fileType: 'File Type',
        fileSize: 'File Size',
        uploadDate: 'Upload Date',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        share: 'Share',
        download: 'Download',
        preview: 'Preview',
        ubl: 'UBL',
        back: 'Back',
        error: 'Error',
        invoiceNotFound: 'Invoice not found',
        loading: 'Loading...',
        paid: 'Paid',
        pending: 'Pending',
        overdue: 'Overdue'
      },
      'nl-NL': {
        basicInfo: 'Basisinformatie',
        invoiceNumber: 'Factuurnummer',
        date: 'Datum',
        dueDate: 'Vervaldatum',
        status: 'Status',
        clientInfo: 'Klantinformatie',
        clientName: 'Klantnaam',
        clientEmail: 'Klant e-mail',
        clientPhone: 'Klant telefoon',
        financialInfo: 'Financiële informatie',
        amount: 'Bedrag',
        currency: 'Valuta',
        taxRate: 'BTW-tarief',
        taxAmount: 'BTW-bedrag',
        totalAmount: 'Totaalbedrag',
        documentInfo: 'Documentinformatie',
        fileName: 'Bestandsnaam',
        fileType: 'Bestandstype',
        fileSize: 'Bestandsgrootte',
        uploadDate: 'Uploaddatum',
        actions: 'Acties',
        edit: 'Bewerken',
        delete: 'Verwijderen',
        share: 'Delen',
        download: 'Downloaden',
        preview: 'Voorbeeld',
        ubl: 'UBL',
        back: 'Terug',
        error: 'Fout',
        invoiceNotFound: 'Factuur niet gevonden',
        loading: 'Laden...',
        paid: 'Betaald',
        pending: 'In afwachting',
        overdue: 'Verlopen'
      },
      'tr-TR': {
        basicInfo: 'Temel Bilgiler',
        invoiceNumber: 'Fatura Numarası',
        date: 'Tarih',
        dueDate: 'Vade Tarihi',
        status: 'Durum',
        clientInfo: 'Müşteri Bilgileri',
        clientName: 'Müşteri Adı',
        clientEmail: 'Müşteri E-posta',
        clientPhone: 'Müşteri Telefon',
        financialInfo: 'Finansal Bilgiler',
        amount: 'Tutar',
        currency: 'Para Birimi',
        taxRate: 'Vergi Oranı',
        taxAmount: 'Vergi Tutarı',
        totalAmount: 'Toplam Tutar',
        documentInfo: 'Belge Bilgileri',
        fileName: 'Dosya Adı',
        fileType: 'Dosya Türü',
        fileSize: 'Dosya Boyutu',
        uploadDate: 'Yükleme Tarihi',
        actions: 'İşlemler',
        edit: 'Düzenle',
        delete: 'Sil',
        share: 'Paylaş',
        download: 'İndir',
        preview: 'Önizleme',
        ubl: 'UBL',
        back: 'Geri',
        error: 'Hata',
        invoiceNotFound: 'Fatura bulunamadı',
        loading: 'Yükleniyor...',
        paid: 'Ödendi',
        pending: 'Beklemede',
        overdue: 'Gecikmiş'
      }
    };
    
    const language = userPreferences?.language || 'en-US';
    return labels[language]?.[key] || key;
  };

  const handleStatusChange = async (newStatus: 'paid' | 'pending' | 'overdue') => {
    if (!invoice) return;
    
    try {
      await InvoiceService.updateInvoiceStatus(invoice.id, newStatus);
      setInvoice(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (!invoice) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invoice not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>{getLabel('basicInfo')}</Text>
          <TouchableOpacity 
            onPress={() => setShowShare(true)} 
            style={styles.shareButton}
          >
            <Ionicons name="share-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getLabel('basicInfo')}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('invoiceNumber')}</Text>
              <Text style={styles.value}>#{invoice.invoiceNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('date')}</Text>
              <Text style={styles.value}>{invoice.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('dueDate')}</Text>
              <Text style={styles.value}>{invoice.dueDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('status')}</Text>
              <View style={styles.statusActions}>
                <TouchableOpacity 
                  style={[
                    styles.statusButton,
                    invoice.status === 'paid' ? { backgroundColor: getStatusColor('paid') } : styles.statusButtonDefault
                  ]}
                  onPress={() => handleStatusChange('paid')}
                >
                  <Text style={[
                    styles.statusButtonText,
                    invoice.status === 'paid' ? styles.statusButtonTextActive : styles.statusButtonTextDefault
                  ]}>{getLabel('paid')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.statusButton,
                    invoice.status === 'pending' ? { backgroundColor: getStatusColor('pending') } : styles.statusButtonDefault
                  ]}
                  onPress={() => handleStatusChange('pending')}
                >
                  <Text style={[
                    styles.statusButtonText,
                    invoice.status === 'pending' ? styles.statusButtonTextActive : styles.statusButtonTextDefault
                  ]}>{getLabel('pending')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.statusButton,
                    invoice.status === 'overdue' ? { backgroundColor: getStatusColor('overdue') } : styles.statusButtonDefault
                  ]}
                  onPress={() => handleStatusChange('overdue')}
                >
                  <Text style={[
                    styles.statusButtonText,
                    invoice.status === 'overdue' ? styles.statusButtonTextActive : styles.statusButtonTextDefault
                  ]}>{getLabel('overdue')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getLabel('clientInfo')}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('clientName')}</Text>
              <Text style={styles.value}>{invoice.clientName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('clientEmail')}</Text>
              <Text style={styles.value}>{invoice.clientEmail}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('clientPhone')}</Text>
              <Text style={styles.value}>{invoice.clientPhone}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getLabel('financialInfo')}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('amount')}</Text>
              <Text style={styles.value}>{formattedAmount}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('currency')}</Text>
              <Text style={styles.value}>{invoice.currency}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('taxRate')}</Text>
              <Text style={styles.value}>{invoice.taxRate}%</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('taxAmount')}</Text>
              <Text style={styles.value}>{formattedAmount}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('totalAmount')}</Text>
              <Text style={styles.value}>{formattedAmount}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getLabel('documentInfo')}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('fileName')}</Text>
              <Text style={styles.value}>{invoice.fileName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('fileType')}</Text>
              <Text style={styles.value}>{invoice.fileType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('fileSize')}</Text>
              <Text style={styles.value}>{invoice.fileSize}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel('uploadDate')}</Text>
              <Text style={styles.value}>{invoice.uploadDate}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  shareButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  amount: {
    color: '#007AFF',
    fontWeight: '600',
  },
  statusActions: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusButtonDefault: {
    backgroundColor: '#f0f0f0',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusButtonTextDefault: {
    color: '#666',
  },
  statusButtonTextActive: {
    color: 'white',
  },
  errorButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
}); 