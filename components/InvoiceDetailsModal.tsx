import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { InvoiceData } from '../services/InvoiceService';

interface InvoiceDetailsModalProps {
  invoice: InvoiceData;
  onClose: () => void;
  onShare: () => void;
}

const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({ invoice, onClose, onShare }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = () => {
    switch (invoice.status) {
      case 'paid':
        return '#4CD964'; // Green
      case 'overdue':
        return '#FF3B30'; // Red
      case 'pending':
      default:
        return '#FF9500'; // Orange
    }
  };

  const getStatusLabel = () => {
    return invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : 'Pending';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <BlurView intensity={90} style={styles.blurView}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.title}>Invoice Details</Text>
              <TouchableOpacity onPress={onShare} style={styles.shareButton}>
                <Ionicons name="share-outline" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Basic Information</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Invoice Number</Text>
                  <Text style={styles.value}>#{invoice.invoiceNumber}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Date</Text>
                  <Text style={styles.value}>{invoice.date}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                    <Text style={styles.statusText}>{getStatusLabel()}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Client Information</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Client Name</Text>
                  <Text style={styles.value}>{invoice.clientName}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Financial Details</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Amount</Text>
                  <Text style={[styles.value, styles.amount]}>{formatCurrency(invoice.amount)}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Document Information</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>File Name</Text>
                  <Text style={styles.value}>{invoice.fileName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>File Type</Text>
                  <Text style={styles.value}>{invoice.fileType}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Upload Date</Text>
                  <Text style={styles.value}>{new Date(invoice.uploadDate).toLocaleDateString()}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </BlurView>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  blurView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
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
});

export default InvoiceDetailsModal; 