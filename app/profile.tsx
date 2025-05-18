import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  taxId: string;
  avatarUri: string | null;
}

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    taxId: '',
    avatarUri: null,
  });
  const [isSaving, setIsSaving] = useState(false);

  // This would normally load from storage, but for demo we'll use default values
  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileJson = await AsyncStorage.getItem('profile');
        if (profileJson) {
          setProfile(JSON.parse(profileJson));
        }
      } catch (error) {
        console.error('Failed to load profile', error);
      }
    };
    
    loadProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await AsyncStorage.setItem('profile', JSON.stringify(profile));
      
      // Simulate network delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile information');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to select a profile picture.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setProfile(prev => ({
          ...prev,
          avatarUri: result.assets[0].uri,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkBackground]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={isDarkMode ? '#ffffff' : '#000000'} 
          />
          <Text style={[styles.backButtonText, isDarkMode && styles.darkText]}>Settings</Text>
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Profile</Text>
        <View style={{ width: 60 }} />
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handlePickImage}>
            {profile.avatarUri ? (
              <Image source={{ uri: profile.avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={60} color="#CCC" />
              </View>
            )}
            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={18} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.form}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Personal Information</Text>
          
          <Text style={[styles.label, isDarkMode && { color: '#aaaaaa' }]}>Full Name</Text>
          <TextInput
            style={[styles.input, isDarkMode && { backgroundColor: '#1e1e1e', borderColor: '#333', color: '#ffffff' }]}
            value={profile.name}
            onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
            placeholder="John Doe"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
          />
          
          <Text style={[styles.label, isDarkMode && { color: '#aaaaaa' }]}>Email</Text>
          <TextInput
            style={[styles.input, isDarkMode && { backgroundColor: '#1e1e1e', borderColor: '#333', color: '#ffffff' }]}
            value={profile.email}
            onChangeText={(text) => setProfile(prev => ({ ...prev, email: text }))}
            placeholder="john.doe@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
          />
          
          <Text style={[styles.label, isDarkMode && { color: '#aaaaaa' }]}>Phone</Text>
          <TextInput
            style={[styles.input, isDarkMode && { backgroundColor: '#1e1e1e', borderColor: '#333', color: '#ffffff' }]}
            value={profile.phone}
            onChangeText={(text) => setProfile(prev => ({ ...prev, phone: text }))}
            placeholder="+1 (123) 456-7890"
            keyboardType="phone-pad"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
          />
          
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Business Information</Text>
          
          <Text style={[styles.label, isDarkMode && { color: '#aaaaaa' }]}>Company Name</Text>
          <TextInput
            style={[styles.input, isDarkMode && { backgroundColor: '#1e1e1e', borderColor: '#333', color: '#ffffff' }]}
            value={profile.company}
            onChangeText={(text) => setProfile(prev => ({ ...prev, company: text }))}
            placeholder="Acme Inc."
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
          />
          
          <Text style={[styles.label, isDarkMode && { color: '#aaaaaa' }]}>Business Address</Text>
          <TextInput
            style={[styles.input, isDarkMode && { backgroundColor: '#1e1e1e', borderColor: '#333', color: '#ffffff' }]}
            value={profile.address}
            onChangeText={(text) => setProfile(prev => ({ ...prev, address: text }))}
            placeholder="123 Main St, City, State, Zip"
            multiline
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
          />
          
          <Text style={[styles.label, isDarkMode && { color: '#aaaaaa' }]}>Tax ID / VAT Number</Text>
          <TextInput
            style={[styles.input, isDarkMode && { backgroundColor: '#1e1e1e', borderColor: '#333', color: '#ffffff' }]}
            value={profile.taxId}
            onChangeText={(text) => setProfile(prev => ({ ...prev, taxId: text }))}
            placeholder="123-45-6789"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
          />
          
          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.savingButton]} 
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  darkText: {
    color: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  form: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  savingButton: {
    backgroundColor: '#78B6FF',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
}); 