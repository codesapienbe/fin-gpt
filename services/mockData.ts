import { InvoiceData } from './InvoiceService';
import { User } from './auth';

// Mock user profile data
export const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  company: 'Demo Company',
  role: 'user'
};

// Mock invoices data
export const mockInvoices: InvoiceData[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    clientName: 'Acme Corporation',
    amount: 2500.00,
    date: '2024-03-15',
    fileName: 'invoice_001.pdf',
    fileUri: 'file:///mock/invoice_001.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-03-15',
    status: 'paid'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    clientName: 'Tech Solutions Ltd',
    amount: 3750.00,
    date: '2024-03-10',
    fileName: 'invoice_002.pdf',
    fileUri: 'file:///mock/invoice_002.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-03-10',
    status: 'pending'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    clientName: 'Global Services Inc',
    amount: 5200.00,
    date: '2024-03-05',
    fileName: 'invoice_003.pdf',
    fileUri: 'file:///mock/invoice_003.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-03-05',
    status: 'overdue'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    clientName: 'Innovative Systems',
    amount: 1800.00,
    date: '2024-03-01',
    fileName: 'invoice_004.pdf',
    fileUri: 'file:///mock/invoice_004.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-03-01',
    status: 'paid'
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    clientName: 'Digital Solutions',
    amount: 4200.00,
    date: '2024-02-28',
    fileName: 'invoice_005.pdf',
    fileUri: 'file:///mock/invoice_005.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-02-28',
    status: 'pending'
  },
  {
    id: '6',
    invoiceNumber: 'INV-2024-006',
    clientName: 'Smart Technologies',
    amount: 3100.00,
    date: '2024-02-25',
    fileName: 'invoice_006.pdf',
    fileUri: 'file:///mock/invoice_006.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-02-25',
    status: 'paid'
  },
  {
    id: '7',
    invoiceNumber: 'INV-2024-007',
    clientName: 'Future Systems',
    amount: 4800.00,
    date: '2024-02-20',
    fileName: 'invoice_007.pdf',
    fileUri: 'file:///mock/invoice_007.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-02-20',
    status: 'overdue'
  },
  {
    id: '8',
    invoiceNumber: 'INV-2024-008',
    clientName: 'Advanced Solutions',
    amount: 2900.00,
    date: '2024-02-15',
    fileName: 'invoice_008.pdf',
    fileUri: 'file:///mock/invoice_008.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-02-15',
    status: 'paid'
  }
];

// Mock monthly revenue data for the chart
export const mockMonthlyRevenue = [
  2500, // January
  3200, // February
  4100, // March
  3800, // April
  5200, // May
  4700, // June
  6100, // July
  5800, // August
  7200, // September
  6500, // October
  8100, // November
  7500  // December
];

// Mock profile data
export const mockProfile = {
  ...mockUser,
  avatarUri: 'https://ui-avatars.com/api/?name=Demo+User&background=007AFF&color=fff',
  phone: '+1 234 567 890',
  address: '123 Business Street, Suite 100',
  city: 'New York',
  country: 'United States',
  postalCode: '10001',
  vatNumber: 'US123456789',
  website: 'www.democompany.com',
  timezone: 'America/New_York',
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  preferences: {
    defaultCurrency: 'USD',
    defaultLanguage: 'en-US',
    theme: 'light'
  }
}; 