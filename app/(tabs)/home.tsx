import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';

import InvoiceService, { InvoiceData } from '../../services/InvoiceService';
import {
  Currency,
  Language,
  formatCurrency,
  getCurrencyConfig,
  getCurrentCurrency,
  getLocalizedMonths
} from '../../services/i18n';

// Import i18n instance to ensure it's initialized
import '../../services/i18n';

const screenWidth = Dimensions.get('window').width;

// Mock data for better visualization
const mockMonthlyData = [2500, 3200, 4100, 3800, 5200, 4700, 6100, 5800, 7200, 6500, 8100, 7500];
const mockInvoices: InvoiceData[] = [
  {
    id: 'mock1',
    invoiceNumber: 'INV-2024-001',
    clientName: 'Acme Corporation',
    amount: 4750.00,
    date: '2024-06-05',
    fileName: 'invoice-001.pdf',
    fileUri: 'https://example.com/invoices/001.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-06-05T10:23:45Z',
    status: 'paid'
  },
  {
    id: 'mock2',
    invoiceNumber: 'INV-2024-002',
    clientName: 'TechStart Inc.',
    amount: 3250.50,
    date: '2024-06-03',
    fileName: 'invoice-002.pdf',
    fileUri: 'https://example.com/invoices/002.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-06-03T14:15:22Z',
    status: 'pending'
  },
  {
    id: 'mock3',
    invoiceNumber: 'INV-2024-003',
    clientName: 'Global Logistics Ltd',
    amount: 7890.75,
    date: '2024-05-28',
    fileName: 'invoice-003.pdf',
    fileUri: 'https://example.com/invoices/003.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-05-28T09:10:15Z',
    status: 'overdue'
  },
  {
    id: 'mock4',
    invoiceNumber: 'INV-2024-004',
    clientName: 'Digital Marketing Agency',
    amount: 2350.00,
    date: '2024-05-25',
    fileName: 'invoice-004.pdf',
    fileUri: 'https://example.com/invoices/004.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-05-25T16:45:30Z',
    status: 'paid'
  },
  {
    id: 'mock5',
    invoiceNumber: 'INV-2024-005',
    clientName: 'Creative Studios',
    amount: 1875.25,
    date: '2024-05-20',
    fileName: 'invoice-005.pdf',
    fileUri: 'https://example.com/invoices/005.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-05-20T11:30:45Z',
    status: 'pending'
  }
];

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t, i18n } = useTranslation();
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18n.language as Language);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>('EUR');
  const [formattedAmounts, setFormattedAmounts] = useState<{[key: string]: string}>({});
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    avgAmount: 0,
  });

  useEffect(() => {
    loadData();
    loadCurrency();
  }, []);

  useEffect(() => {
    // Re-render when language changes from settings
    setCurrentLanguage(i18n.language as Language);
  }, [i18n.language]);

  useEffect(() => {
    // Format all amounts when currency changes
    formatAllAmounts();
  }, [currentCurrency, stats, invoices]);

  const loadCurrency = async () => {
    try {
      const currency = await getCurrentCurrency();
      setCurrentCurrency(currency);
    } catch (error) {
      console.error('Error loading currency preference:', error);
    }
  };

  const formatAllAmounts = async () => {
    if (!stats) return;
    
    try {
      // Format static amounts
      const formatted = {
        totalAmount: await formatCurrency(stats.totalAmount, currentCurrency),
        avgAmount: await formatCurrency(stats.avgAmount, currentCurrency),
      };
      
      setFormattedAmounts(formatted);
    } catch (error) {
      console.error('Error formatting amounts:', error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      let invoiceData = await InvoiceService.getInvoices();
      
      // Add mock data if no real data exists
      if (invoiceData.length === 0) {
        invoiceData = mockInvoices;
      }
      
      setInvoices(invoiceData);
      
      // Calculate statistics
      const totalAmount = invoiceData.reduce((sum, invoice) => sum + invoice.amount, 0);
      const paidInvoices = invoiceData.filter(inv => inv.status === 'paid').length;
      const pendingInvoices = invoiceData.filter(inv => inv.status === 'pending').length;
      const overdueInvoices = invoiceData.filter(inv => inv.status === 'overdue').length;
      
      setStats({
        totalInvoices: invoiceData.length,
        totalAmount,
        paidInvoices: paidInvoices || Math.floor(invoiceData.length * 0.6),
        pendingInvoices: pendingInvoices || Math.floor(invoiceData.length * 0.3),
        overdueInvoices: overdueInvoices || Math.ceil(invoiceData.length * 0.1),
        avgAmount: invoiceData.length ? (totalAmount / invoiceData.length) : 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency using the i18n service with async handling
  const handleCurrencyFormat = async (amount: number): Promise<string> => {
    try {
      return await formatCurrency(amount, currentCurrency);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return amount.toString();
    }
  };

  // Get status translation
  const getStatusTranslation = (status: string) => {
    switch (status) {
      case 'paid':
        return t('paid');
      case 'pending':
        return t('pending');
      case 'overdue':
        return t('overdue');
      default:
        return t('pending');
    }
  };

  // Group invoices by month for chart data
  const getChartData = () => {
    const months = getLocalizedMonths(currentLanguage);
    let monthlyData = new Array(12).fill(0);
    
    if (invoices.length > 0) {
      invoices.forEach(invoice => {
        const date = new Date(invoice.date);
        const month = date.getMonth();
        monthlyData[month] += invoice.amount;
      });
    } else {
      // Use mock data if no invoices
      monthlyData = mockMonthlyData;
    }
    
    // For bar chart, we'll select the last 6 months for better visibility
    const now = new Date();
    const currentMonth = now.getMonth();
    const recentMonths = [];
    const recentData = [];
    
    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentMonth - i + 12) % 12;
      recentMonths.unshift(months[monthIndex]);
      recentData.unshift(monthlyData[monthIndex]);
    }
    
    return {
      labels: recentMonths,
      datasets: [
        {
          data: recentData,
          colors: [
            (opacity = 1) => isDarkMode ? `rgba(77, 217, 100, ${opacity})` : `rgba(0, 122, 255, ${opacity})`,
            (opacity = 1) => isDarkMode ? `rgba(90, 230, 115, ${opacity})` : `rgba(30, 140, 255, ${opacity})`,
            (opacity = 1) => isDarkMode ? `rgba(105, 245, 130, ${opacity})` : `rgba(60, 158, 255, ${opacity})`,
            (opacity = 1) => isDarkMode ? `rgba(120, 255, 145, ${opacity})` : `rgba(90, 176, 255, ${opacity})`,
            (opacity = 1) => isDarkMode ? `rgba(135, 255, 160, ${opacity})` : `rgba(120, 194, 255, ${opacity})`,
            (opacity = 1) => isDarkMode ? `rgba(150, 255, 175, ${opacity})` : `rgba(150, 212, 255, ${opacity})`,
          ]
        }
      ]
    };
  };

  // Get currency symbol for Y-axis
  const getCurrencySymbol = () => {
    const config = getCurrencyConfig(currentCurrency);
    return config.symbol;
  };

  const chartConfig = {
    backgroundGradientFrom: isDarkMode ? '#1e1e1e' : '#ffffff',
    backgroundGradientTo: isDarkMode ? '#2d2d2d' : '#f8f8f8',
    backgroundGradientFromOpacity: 1,
    backgroundGradientToOpacity: 1,
    decimalPlaces: 0,
    color: (opacity = 1) => isDarkMode ? 
      `rgba(77, 217, 100, ${opacity})` : 
      `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => isDarkMode ? 
      `rgba(255, 255, 255, ${opacity})` : 
      `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    barPercentage: 0.7,
    propsForBackgroundLines: {
      strokeDasharray: '5, 5',
      strokeWidth: 1,
      stroke: isDarkMode ? '#333333' : '#ebebeb',
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, isDarkMode && styles.darkBackground]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>{t('loadingDashboard')}</Text>
      </View>
    );
  }

  const getStatusCount = () => {
    return {
      paid: stats.paidInvoices,
      pending: stats.pendingInvoices,
      overdue: stats.overdueInvoices
    };
  };

  // Currency symbol for yAxis
  const currencySymbol = getCurrencySymbol();

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkBackground]}>
      {/* Key metrics */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{stats.totalInvoices}</Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkSecondaryText]}>{t('totalInvoices')}</Text>
        </View>
        <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>
            {formattedAmounts.totalAmount || '...'}
          </Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkSecondaryText]}>{t('totalAmount')}</Text>
        </View>
        <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>
            {formattedAmounts.avgAmount || '...'}
          </Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkSecondaryText]}>{t('avgInvoice')}</Text>
        </View>
      </View>

      {/* Status indicator cards */}
      <View style={styles.statusCards}>
        <View style={[styles.statusCard, { backgroundColor: '#4CD964' }]}>
          <Text style={styles.statusCardValue}>{getStatusCount().paid}</Text>
          <Text style={styles.statusCardLabel}>{t('paid')}</Text>
        </View>
        <View style={[styles.statusCard, { backgroundColor: '#FF9500' }]}>
          <Text style={styles.statusCardValue}>{getStatusCount().pending}</Text>
          <Text style={styles.statusCardLabel}>{t('pending')}</Text>
        </View>
        <View style={[styles.statusCard, { backgroundColor: '#FF3B30' }]}>
          <Text style={styles.statusCardValue}>{getStatusCount().overdue}</Text>
          <Text style={styles.statusCardLabel}>{t('overdue')}</Text>
        </View>
      </View>

      {/* Monthly revenue chart */}
      <View style={[styles.chartContainer, isDarkMode && styles.darkCard]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t('monthlyRevenue')}</Text>
        <View style={styles.chartWrapper}>
          <BarChart
            data={getChartData()}
            width={screenWidth - 48}
            height={280}
            chartConfig={chartConfig}
            style={styles.chart}
            showBarTops={false}
            withInnerLines={false}
            showValuesOnTopOfBars={false}
            fromZero={true}
            yAxisLabel={currencySymbol}
            yAxisSuffix=""
            yAxisInterval={1}
            segments={5}
          />
        </View>
      </View>
    </ScrollView>
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
  darkCard: {
    backgroundColor: '#1e1e1e',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
  },
  darkText: {
    color: '#f5f5f5',
  },
  darkSecondaryText: {
    color: '#aaa',
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    width: '32%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statusCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statusCard: {
    width: '32%',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statusCardLabel: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
    paddingTop: 16,
  },
}); 