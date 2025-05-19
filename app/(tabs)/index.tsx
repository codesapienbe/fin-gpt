import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InvoiceItem from '../../components/InvoiceItem';
import InvoiceService, { InvoiceData } from '../../services/InvoiceService';
import SettingsService, { RecentInvoice } from '../../services/SettingsService';

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<InvoiceData[]>([]);
  const [favoriteInvoices, setFavoriteInvoices] = useState<InvoiceData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceData[]>([]);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  useEffect(() => {
    if (userPreferences) {
      loadInvoices();
    }
  }, [userPreferences]);

  useEffect(() => {
    filterInvoices();
  }, [searchQuery, statusFilter, invoices]);

  const loadUserPreferences = async () => {
    try {
      const preferences = await SettingsService.getUserPreferences();
      setUserPreferences(preferences);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const allInvoices = await InvoiceService.getInvoices();
      setInvoices(allInvoices);

      // Load recent invoices
      const recentIds = await SettingsService.getRecentInvoices();
      const recent = allInvoices.filter((inv: InvoiceData) => 
        recentIds.some((recent: RecentInvoice) => recent.id === inv.id)
      ).sort((a: InvoiceData, b: InvoiceData) => {
        const aRecent = recentIds.find((r: RecentInvoice) => r.id === a.id);
        const bRecent = recentIds.find((r: RecentInvoice) => r.id === b.id);
        return (bRecent?.lastViewed || 0) - (aRecent?.lastViewed || 0);
      });
      setRecentInvoices(recent);

      // Load favorite invoices
      const favoriteIds = await SettingsService.getFavoriteInvoices();
      const favorites = allInvoices.filter((inv: InvoiceData) => 
        favoriteIds.includes(inv.id)
      );
      setFavoriteInvoices(favorites);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    let filtered = [...invoices];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.clientName.toLowerCase().includes(query) ||
        invoice.fileName.toLowerCase().includes(query)
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }
    setFilteredInvoices(filtered);
  };

  const getLabel = (key: string) => {
    const labels: { [key: string]: { [key: string]: string } } = {
      'en-US': {
        search: 'Search invoices...',
        filters: 'Filters',
        status: 'Status',
        all: 'All',
        paid: 'Paid',
        pending: 'Pending',
        overdue: 'Overdue',
        clear: 'Clear',
        apply: 'Apply',
        noResults: 'No invoices found',
        loading: 'Loading...'
      },
      'nl-NL': {
        search: 'Zoek facturen...',
        filters: 'Filters',
        status: 'Status',
        all: 'Alle',
        paid: 'Betaald',
        pending: 'In afwachting',
        overdue: 'Verlopen',
        clear: 'Wissen',
        apply: 'Toepassen',
        noResults: 'Geen facturen gevonden',
        loading: 'Laden...'
      },
      'tr-TR': {
        search: 'Faturaları ara...',
        filters: 'Filtreler',
        status: 'Durum',
        all: 'Tümü',
        paid: 'Ödendi',
        pending: 'Beklemede',
        overdue: 'Gecikmiş',
        clear: 'Temizle',
        apply: 'Uygula',
        noResults: 'Fatura bulunamadı',
        loading: 'Yükleniyor...'
      }
    };
    const language = userPreferences?.language || 'en-US';
    return labels[language]?.[key] || key;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#4CD964';
      case 'overdue':
        return '#FF3B30';
      case 'pending':
      default:
        return '#FF9500';
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={getLabel('search')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={20} color={showFilters ? '#007AFF' : '#666'} />
        </TouchableOpacity>
      </View>
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>{getLabel('status')}</Text>
          <View style={styles.statusFilters}>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                !statusFilter && styles.statusFilterActive,
                !statusFilter && { backgroundColor: '#007AFF' }
              ]}
              onPress={() => setStatusFilter(null)}
            >
              <Text style={[
                styles.statusFilterText,
                !statusFilter && styles.statusFilterTextActive
              ]}>{getLabel('all')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                statusFilter === 'paid' && styles.statusFilterActive,
                statusFilter === 'paid' && { backgroundColor: getStatusColor('paid') }
              ]}
              onPress={() => setStatusFilter('paid')}
            >
              <Text style={[
                styles.statusFilterText,
                statusFilter === 'paid' && styles.statusFilterTextActive
              ]}>{getLabel('paid')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                statusFilter === 'pending' && styles.statusFilterActive,
                statusFilter === 'pending' && { backgroundColor: getStatusColor('pending') }
              ]}
              onPress={() => setStatusFilter('pending')}
            >
              <Text style={[
                styles.statusFilterText,
                statusFilter === 'pending' && styles.statusFilterTextActive
              ]}>{getLabel('pending')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                statusFilter === 'overdue' && styles.statusFilterActive,
                statusFilter === 'overdue' && { backgroundColor: getStatusColor('overdue') }
              ]}
              onPress={() => setStatusFilter('overdue')}
            >
              <Text style={[
                styles.statusFilterText,
                statusFilter === 'overdue' && styles.statusFilterTextActive
              ]}>{getLabel('overdue')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterActions}>
            <TouchableOpacity 
              style={styles.filterActionButton}
              onPress={() => {
                setStatusFilter(null);
                setSearchQuery('');
              }}
            >
              <Text style={styles.filterActionText}>{getLabel('clear')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterActionButton, styles.filterActionButtonPrimary]}
              onPress={() => setShowFilters(false)}
            >
              <Text style={[styles.filterActionText, styles.filterActionTextPrimary]}>{getLabel('apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Invoices</Text>
          <TouchableOpacity onPress={() => router.push('/invoices' as any)}>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map(invoice => (
            <InvoiceItem key={invoice.id} invoice={invoice} />
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>{getLabel('noResults')}</Text>
          </View>
        )}
      </ScrollView>
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
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#E3F2FD',
  },
  filtersContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  statusFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  statusFilterActive: {
    backgroundColor: '#007AFF',
  },
  statusFilterText: {
    fontSize: 14,
    color: '#666',
  },
  statusFilterTextActive: {
    color: 'white',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  filterActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterActionButtonPrimary: {
    backgroundColor: '#007AFF',
  },
  filterActionText: {
    fontSize: 14,
    color: '#666',
  },
  filterActionTextPrimary: {
    color: 'white',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
