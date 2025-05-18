# Invoice Management App

A simple invoice management mobile application built with React Native and Expo for self-employed individuals and small companies.

## Features

- **Upload Invoice:** Upload invoice files (PDF, JPG, or PNG) with metadata (invoice number, date, amount, client name).
- **View Invoices:** Browse all your uploaded invoices in a clean list view with basic invoice details.
- **Share Invoice:** Share invoices via email or by generating shareable links.

## Getting Started

### Prerequisites

- Node.js (v14.0 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/invoice-management-app.git
cd invoice-management-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the application
```bash
npm start
# or
yarn start
```

4. Open the app on your device using the Expo Go app or an emulator.

## Tech Stack

- **React Native**: Core framework for building the mobile application
- **Expo**: Development platform and tools
- **AsyncStorage**: Local data persistence
- **Expo Document Picker**: For file selection
- **Expo Sharing**: For sharing files and links

## Project Structure

```
invoice-management-app/
├── app/                      # Main application screens
│   ├── (tabs)/               # Tab-based navigation screens
│   │   ├── index.tsx         # Home/Invoices screen
│   │   └── settings.tsx      # Settings screen
│   └── _layout.tsx           # Root layout component
├── components/               # Reusable UI components
│   ├── InvoiceItem.tsx       # Invoice list item component
│   ├── InvoiceUploadModal.tsx # Modal for uploading invoices
│   └── ShareInvoiceModal.tsx # Modal for sharing invoices
├── services/                 # Business logic and services
│   └── InvoiceService.ts     # Invoice data management service
└── assets/                   # Static assets
```

## Planned Future Enhancements

- User authentication and secure login
- Invoice search and filtering
- Automated invoice scanning and data extraction
- Invoice templates and customization
- Cloud synchronization for invoice data
- Multi-device access
- Integration with accounting software

## Security Considerations

This app currently does not include authentication. For production use, you should implement:

- User authentication
- Secure file storage
- Data encryption
- API security if connecting to a backend service

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Expo team for the excellent development platform
- React Native community for their comprehensive documentation

---

*This app was built as a simple demo and may require additional features for production use.*
