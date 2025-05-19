import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockInvoices } from './mockData';

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  amount: number;
  currency: string;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  fileUri: string;
}

const STORAGE_KEY = 'invoices';

export const InvoiceService = {
  /**
   * Get all invoices
   * @returns Promise<InvoiceData[]> Array of invoice data
   */
  getInvoices: async (): Promise<InvoiceData[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue) {
        return JSON.parse(jsonValue) as InvoiceData[];
      }
      // If no invoices in storage, initialize with mock data
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockInvoices));
      return mockInvoices;
    } catch (error) {
      console.error('Error getting invoices', error);
      return mockInvoices; // Return mock data as fallback
    }
  },

  /**
   * Save a new invoice
   * @param invoice Invoice data to save
   * @returns Promise<InvoiceData> The saved invoice data with ID
   */
  saveInvoice: async (invoice: InvoiceData): Promise<InvoiceData> => {
    try {
      // Get existing invoices
      const invoices = await InvoiceService.getInvoices();
      
      // Add new invoice to the array
      // Default to pending status if not provided
      if (!invoice.status) {
        invoice.status = 'pending';
      }
      
      invoices.push(invoice);
      
      // Save updated array
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
      
      return invoice;
    } catch (error) {
      console.error('Error saving invoice', error);
      throw error;
    }
  },

  /**
   * Get a single invoice by ID
   * @param id Invoice ID
   * @returns Promise<InvoiceData | null> Invoice data or null if not found
   */
  getInvoiceById: async (id: string): Promise<InvoiceData | null> => {
    try {
      const invoices = await InvoiceService.getInvoices();
      const invoice = invoices.find(inv => inv.id === id);
      return invoice || null;
    } catch (error) {
      console.error('Error getting invoice by ID', error);
      throw error;
    }
  },

  /**
   * Delete an invoice by ID
   * @param id Invoice ID to delete
   * @returns Promise<boolean> True if deleted, false otherwise
   */
  deleteInvoice: async (id: string): Promise<boolean> => {
    try {
      const invoices = await InvoiceService.getInvoices();
      const updatedInvoices = invoices.filter(inv => inv.id !== id);
      
      if (invoices.length === updatedInvoices.length) {
        return false; // No invoice was deleted
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
      return true;
    } catch (error) {
      console.error('Error deleting invoice', error);
      throw error;
    }
  },

  /**
   * Update invoice status
   * @param id Invoice ID
   * @param status New status
   * @returns Promise<InvoiceData | null> Updated invoice or null if not found
   */
  updateInvoiceStatus: async (id: string, status: 'paid' | 'pending' | 'overdue'): Promise<InvoiceData | null> => {
    try {
      const invoices = await InvoiceService.getInvoices();
      const index = invoices.findIndex(inv => inv.id === id);
      
      if (index === -1) {
        return null; // Invoice not found
      }
      
      invoices[index].status = status;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
      
      return invoices[index];
    } catch (error) {
      console.error('Error updating invoice status', error);
      throw error;
    }
  },

  /**
   * Create a shareable link for an invoice
   * Note: In a real app, this would create a secure server link
   * For this demo, we return a dummy URL
   * @param invoiceId Invoice ID
   * @returns Promise<string> Shareable URL
   */
  createShareableLink: async (invoiceId: string): Promise<string> => {
    // In a real application, this would generate a secure URL to access the invoice
    // For demo purposes, we'll just return a dummy URL
    return `https://invoiceapp.example.com/share/${invoiceId}?token=${Math.random().toString(36).substring(2, 15)}`;
  },

  /**
   * Generate UBL XML for an invoice
   * @param invoice Invoice data
   * @returns Promise<string> UBL XML string
   */
  generateUBL: async (invoice: InvoiceData): Promise<string> => {
    // In a real app, this would generate proper UBL XML
    // For demo purposes, we'll return a simplified version
    const ublXml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:ID>${invoice.invoiceNumber}</cbc:ID>
  <cbc:IssueDate>${invoice.date}</cbc:IssueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>USD</cbc:DocumentCurrencyCode>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>Demo Company</cbc:Name>
      </cac:PartyName>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>${invoice.clientName}</cbc:Name>
      </cac:PartyName>
    </cac:Party>
  </cac:AccountingCustomerParty>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="USD">${invoice.amount}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="USD">${invoice.amount}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="USD">${invoice.amount}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="USD">${invoice.amount}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
</Invoice>`;

    return ublXml;
  }
};

export default InvoiceService; 