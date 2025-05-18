import { BlurView } from 'expo-blur';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  date: string;
  fileName: string;
  fileUri: string;
  fileType: string;
  uploadDate: string;
}

interface InvoiceUploadModalProps {
  onClose: () => void;
  onUploadSuccess: (invoiceData: InvoiceData) => void;
}

const InvoiceUploadModal: React.FC<InvoiceUploadModalProps> = ({ onClose, onUploadSuccess }) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        return;
      }
      
      const asset = result.assets[0];
      
      // Check file size (limit to 5MB)
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);
      if (fileInfo.exists && fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
        Alert.alert('File too large', 'Please select a file smaller than 5MB');
        return;
      }
      
      setSelectedFile(asset);
    } catch (error: unknown) {
      Alert.alert('Error picking document', (error as Error).message || 'Unknown error occurred');
    }
  };
  
  const uploadInvoice = async () => {
    if (!selectedFile) {
      Alert.alert('Missing file', 'Please select an invoice file');
      return;
    }
    
    if (!invoiceNumber || !clientName || !amount) {
      Alert.alert('Missing information', 'Please fill all required fields');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real app, this would upload to a server
      // For this demo, we'll simulate storage locally
      const invoiceData: InvoiceData = {
        id: Date.now().toString(),
        invoiceNumber,
        clientName,
        amount: parseFloat(amount),
        date,
        fileName: selectedFile.name,
        fileUri: selectedFile.uri,
        fileType: selectedFile.mimeType || 'application/octet-stream',
        uploadDate: new Date().toISOString(),
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUploadSuccess(invoiceData);
      onClose();
    } catch (error: unknown) {
      Alert.alert('Upload failed', (error as Error).message || 'Unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <BlurView intensity={90} style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>Upload Invoice</Text>
        
        <TouchableOpacity 
          style={styles.filePicker} 
          onPress={pickDocument}
        >
          <Text style={styles.filePickerText}>
            {selectedFile ? selectedFile.name : 'Select PDF, JPG, or PNG file'}
          </Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Invoice Number"
          value={invoiceNumber}
          onChangeText={setInvoiceNumber}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Client Name"
          value={clientName}
          onChangeText={setClientName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Amount ($)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
        
        <View style={styles.buttons}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={onClose}
            disabled={isUploading}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.uploadButton]} 
            onPress={uploadInvoice}
            disabled={isUploading}
          >
            <Text style={styles.buttonText}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modal: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filePicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  filePickerText: {
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontWeight: '600',
    color: '#fff',
  },
});

export default InvoiceUploadModal; 