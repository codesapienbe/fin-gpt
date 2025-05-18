import AsyncStorage from '@react-native-async-storage/async-storage';

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  date: string;
  fileName: string;
  fileUri: string;
  fileType: string;
  uploadDate: string;
  status?: 'paid' | 'pending' | 'overdue';
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
      return [];
    } catch (error) {
      console.error('Error getting invoices', error);
      return [];
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
  }
};

export default InvoiceService; 