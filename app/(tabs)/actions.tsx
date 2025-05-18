import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    useColorScheme
} from 'react-native';

export default function ActionsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t } = useTranslation();
  
  const [menuVisible, setMenuVisible] = useState(false);
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const menuAnimation = useRef(new Animated.Value(0)).current;

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

  const handleSearch = () => {
    handleCloseMenu();
    
    // Show search alert for now; in a real app this would navigate to a search screen
    Alert.alert(
      t('search'),
      t('searchInvoices'),
      [
        {
          text: 'OK',
          onPress: () => console.log('Search pressed')
        }
      ]
    );
  };

  const handleScan = () => {
    handleCloseMenu();
    
    // Show scan alert for now; in a real app this would open the camera
    Alert.alert(
      t('scan'),
      t('scanInvoice'),
      [
        {
          text: 'OK',
          onPress: () => console.log('Scan pressed')
        }
      ]
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkBackground]}>
      {/* Main content area - mostly empty as this is a utility screen */}
      <View style={styles.content}>
        <Text style={[styles.helpText, isDarkMode && styles.darkText]}>
          {t('actionsHelpText') || "Tap the button below to search or scan invoices"}
        </Text>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { transform: [{ scale: scaleAnimation }] }]}
        onPress={handleOpenMenu}
        onLongPress={handleOpenMenu}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={30} color="white" />
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
                  onPress={handleSearch}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: '#007AFF' }]}>
                    <Ionicons name="search" size={20} color="white" />
                  </View>
                  <Text style={[styles.menuItemText, isDarkMode && styles.darkText]}>
                    {t('search')}
                  </Text>
                </TouchableOpacity>
                
                <View style={[styles.menuDivider, isDarkMode && styles.darkMenuDivider]} />
                
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={handleScan}
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
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  helpText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 16,
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
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