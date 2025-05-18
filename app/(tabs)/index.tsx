import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme
} from 'react-native';

import InvoiceItem from '../../components/InvoiceItem';
import InvoiceUploadModal from '../../components/InvoiceUploadModal';
import ShareInvoiceModal from '../../components/ShareInvoiceModal';
import InvoiceService, { InvoiceData } from '../../services/InvoiceService';

export default function InvoicesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Invoices state
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceData[]>([]);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // FAB menu state
  const [menuVisible, setMenuVisible] = useState(false);
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const menuAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadInvoices();
  }, []);
  
  useEffect(() => {
    // Filter invoices when search query changes
    if (searchQuery.trim() === '') {
      setFilteredInvoices(invoices);
    } else {
      handleSearch();
    }
  }, [searchQuery, invoices]);

  // Load all invoices from service
  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const loadedInvoices = await InvoiceService.getInvoices();
      setInvoices(loadedInvoices);
      setFilteredInvoices(loadedInvoices);
    } catch (error) {
      Alert.alert(t('error'), t('failedToLoadInvoices'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = async (invoiceData: InvoiceData) => {
    try {
      await InvoiceService.saveInvoice(invoiceData);
      loadInvoices();
      Alert.alert(t('success'), t('invoiceUploadedSuccessfully'));
    } catch (error) {
      Alert.alert(t('error'), t('failedToSaveInvoice'));
    }
  };

  const handleInvoicePress = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
    setIsShareModalVisible(true);
  };

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredInvoices(invoices);
      return;
    }

    setIsSearching(true);
    
    try {
      // Filter invoices based on search query
      const query = searchQuery.toLowerCase();
      const results = invoices.filter(invoice => (
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.clientName.toLowerCase().includes(query) ||
        invoice.date.includes(query) ||
        invoice.amount.toString().includes(query)
      ));
      
      setFilteredInvoices(results);

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
    setIsSearchActive(false);
    setFilteredInvoices(invoices);
  };

  // FAB menu functionality
  const handleOpenMenu = () => {
    setMenuVisible(true);
    
    Animated.parallel([
      Animated.spring(scaleAnimation, {
        toValue: 1.2,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(menuAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCloseMenu = () => {
    Animated.parallel([
      Animated.spring(scaleAnimation, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMenuVisible(false);
    });
  };

  const handleScanQR = () => {
    handleCloseMenu();
    
    // Show scan alert for now; in a real app this would open the camera
    Alert.alert(
      t('scan'),
      t('scanInvoice'),
      [{ text: 'OK' }]
    );
  };

  const handleUpload = () => {
    handleCloseMenu();
    setIsUploadModalVisible(true);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {isSearchActive && searchQuery.length > 0 ? (
        <>
          <Ionicons name="search-outline" size={64} color={isDarkMode ? "#555" : "#ccc"} />
          <Text style={[styles.emptyTitle, isDarkMode && styles.darkText]}>
            {t('noResultsFound')}
          </Text>
          <Text style={[styles.emptyMessage, isDarkMode && styles.darkSecondaryText]}>
            {t('noInvoicesMatchingQuery', { query: searchQuery })}
          </Text>
        </>
      ) : (
        <>
          <Ionicons name="document-outline" size={64} color={isDarkMode ? "#555" : "#ccc"} />
          <Text style={[styles.emptyTitle, isDarkMode && styles.darkText]}>
            {t('noInvoicesYet')}
          </Text>
          <Text style={[styles.emptyMessage, isDarkMode && styles.darkSecondaryText]}>
            {t('createFirstInvoice')}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkBackground]}>
      {/* Search bar */}
      <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
        <View style={[styles.searchBar, isDarkMode && styles.darkSearchBar]}>
          <Ionicons 
            name="search" 
            size={20} 
            color={isDarkMode ? "#8E8E93" : "#8E8E93"} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
            placeholder={t('searchInvoices')}
            placeholderTextColor={isDarkMode ? "#666" : "#8E8E93"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchActive(true)}
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
      </View>

      {/* Invoice list */}
      <FlatList
        data={filteredInvoices}
        renderItem={({ item }) => (
          <InvoiceItem 
            invoice={item} 
            onPress={handleInvoicePress}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={
          filteredInvoices.length === 0 
            ? styles.centerContent 
            : styles.listContent
        }
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, { transform: [{ scale: scaleAnimation }] }]}
        onPress={handleUpload}
        onLongPress={handleOpenMenu}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Action Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseMenu}
      >
        <TouchableWithoutFeedback onPress={handleCloseMenu}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.menuContainer, 
                  isDarkMode && styles.darkMenuContainer,
                  {
                    opacity: menuAnimation,
                    transform: [
                      {
                        translateY: menuAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={handleUpload}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: '#007AFF' }]}>
                    <Ionicons name="add-circle" size={20} color="white" />
                  </View>
                  <Text style={[styles.menuItemText, isDarkMode && styles.darkText]}>
                    {t('uploadInvoice')}
                  </Text>
                </TouchableOpacity>
                
                <View style={[styles.menuDivider, isDarkMode && styles.darkMenuDivider]} />
                
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={handleScanQR}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: '#34C759' }]}>
                    <Ionicons name="scan" size={20} color="white" />
                  </View>
                  <Text style={[styles.menuItemText, isDarkMode && styles.darkText]}>
                    {t('scan')}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
            
            {/* Same Floating Action Button, but in the modal to allow animation */}
            <TouchableOpacity
              style={[styles.fab, { transform: [{ scale: scaleAnimation }] }]}
              onPress={handleCloseMenu}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Upload Modal */}
      {isUploadModalVisible && (
        <InvoiceUploadModal 
          onClose={() => setIsUploadModalVisible(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {/* Share Modal */}
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
  darkBackground: {
    backgroundColor: '#121212',
  },
  darkText: {
    color: '#ffffff',
  },
  darkSecondaryText: {
    color: '#aaaaaa',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  darkSearchContainer: {
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#333',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F3',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  darkSearchBar: {
    backgroundColor: '#333',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  darkSearchInput: {
    color: '#ffffff',
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
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: 240,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  darkMenuContainer: {
    backgroundColor: '#2C2C2E',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  darkMenuDivider: {
    backgroundColor: '#3A3A3C',
  },
});
