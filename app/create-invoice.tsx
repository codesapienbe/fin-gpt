import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateInvoiceScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    amount: '',
    currency: 'EUR',
    dueDate: '',
    description: '',
  });

  const handleSave = () => {
    // TODO: Implement invoice creation logic
    Alert.alert(
      'Success',
      'Invoice created successfully',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Invoice</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Invoice Number</Text>
            <TextInput
              style={styles.input}
              value={formData.invoiceNumber}
              onChangeText={(text) => setFormData({ ...formData, invoiceNumber: text })}
              placeholder="Enter invoice number"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Client Name</Text>
            <TextInput
              style={styles.input}
              value={formData.clientName}
              onChangeText={(text) => setFormData({ ...formData, clientName: text })}
              placeholder="Enter client name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Client Email</Text>
            <TextInput
              style={styles.input}
              value={formData.clientEmail}
              onChangeText={(text) => setFormData({ ...formData, clientEmail: text })}
              placeholder="Enter client email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Client Phone</Text>
            <TextInput
              style={styles.input}
              value={formData.clientPhone}
              onChangeText={(text) => setFormData({ ...formData, clientPhone: text })}
              placeholder="Enter client phone"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
              placeholder="Enter amount"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Due Date</Text>
            <TextInput
              style={styles.input}
              value={formData.dueDate}
              onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Create Invoice</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 