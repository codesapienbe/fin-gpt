import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import InvoiceItem from '../../components/InvoiceItem';
import InvoiceUploadModal from '../../components/InvoiceUploadModal';
import ShareInvoiceModal from '../../components/ShareInvoiceModal';
import InvoiceService, { InvoiceData } from '../../services/InvoiceService';

export default function HomeScreen() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const loadedInvoices = await InvoiceService.getInvoices();
      setInvoices(loadedInvoices);
    } catch (error) {
      Alert.alert('Error', 'Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = async (invoiceData: InvoiceData) => {
    try {
      await InvoiceService.saveInvoice(invoiceData);
      loadInvoices();
      Alert.alert('Success', 'Invoice uploaded successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save invoice');
    }
  };

  const handleInvoicePress = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
    setIsShareModalVisible(true);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Invoices Yet</Text>
      <Text style={styles.emptyMessage}>
        Upload your first invoice by tapping the + button
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={invoices}
        renderItem={({ item }) => (
          <InvoiceItem 
            invoice={item} 
            onPress={handleInvoicePress}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={invoices.length === 0 ? styles.centerContent : styles.listContent}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setIsUploadModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {isUploadModalVisible && (
        <InvoiceUploadModal 
          onClose={() => setIsUploadModalVisible(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {isShareModalVisible && selectedInvoice && (
        <ShareInvoiceModal 
          invoice={selectedInvoice}
          onClose={() => {
            setIsShareModalVisible(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
