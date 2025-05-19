import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import InvoiceItem from '../../components/InvoiceItem';
import InvoiceService, { InvoiceData } from '../../services/InvoiceService';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<InvoiceData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    try {
      // Get all invoices and filter them client-side
      // In a real app, this would be a server-side search
      const allInvoices = await InvoiceService.getInvoices();
      
      // Simulate network delay for demo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter invoices based on search query
      const filteredInvoices = allInvoices.filter(invoice => {
        const query = searchQuery.toLowerCase();
        return (
          invoice.invoiceNumber.toLowerCase().includes(query) ||
          invoice.clientName.toLowerCase().includes(query) ||
          invoice.date.includes(query) ||
          invoice.amount.toString().includes(query)
        );
      });
      
      setSearchResults(filteredInvoices);

      // Add to recent searches if not already there
      if (!recentSearches.includes(searchQuery)) {
        const newRecentSearches = [searchQuery, ...recentSearches.slice(0, 4)];
        setRecentSearches(newRecentSearches);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleInvoicePress = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
    // In a real app, this would navigate to invoice details or open a share modal
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {searchQuery.length > 0 ? (
        <>
          <Ionicons name="search-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptyMessage}>
            We couldn't find any invoices matching "{searchQuery}"
          </Text>
        </>
      ) : (
        <>
          <Ionicons name="search" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Search Invoices</Text>
          <Text style={styles.emptyMessage}>
            Search by invoice number, client name, date, or amount
          </Text>
          
          {recentSearches.length > 0 && (
            <View style={styles.recentContainer}>
              <Text style={styles.recentTitle}>Recent Searches</Text>
              {recentSearches.map((term, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.recentItem}
                  onPress={() => {
                    setSearchQuery(term);
                    setTimeout(() => handleSearch(), 100);
                  }}
                >
                  <Ionicons name="time-outline" size={16} color="#007AFF" />
                  <Text style={styles.recentText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search invoices..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={!searchQuery.trim() || isSearching}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <InvoiceItem 
              invoice={item} 
              onPress={handleInvoicePress}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={
            searchResults.length === 0 
              ? styles.centerContent 
              : styles.listContent
          }
          ListEmptyComponent={renderEmptyState}
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F3',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  recentContainer: {
    width: '100%',
    marginTop: 24,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#666',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  recentText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
  },
}); 