# BUCChain Mobile App

React Native + Expo mobile application for product verification using blockchain and AI.

## Features

- 📱 **QR Code Scanning** - Scan product QR codes for instant verification
- ✓ **Blockchain Verification** - Real-time product authenticity checking via blockchain
- 📜 **Scan History** - View previously scanned products
- 👤 **User Authentication** - Secure login and registration
- 🔒 **Secure Storage** - Encrypted token storage using Expo SecureStore

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app (for testing on physical devices)
- iOS Simulator or Android Emulator (optional)

## Installation

```bash
cd mobile
npm install
```

## Configuration

1. Copy environment template:

```bash
cp .env.example .env
```

2. Update `.env` with your backend URLs:

```env
API_BASE_URL=http://YOUR_COMPUTER_IP:8001
AI_SERVICE_URL=http://YOUR_COMPUTER_IP:8002
```

**Important:** When testing on a physical device, replace `localhost` with your computer's actual IP address (e.g., `http://192.168.1.100:8001`).

## Running the App

### Start Development Server

```bash
npm start
```

This will open Expo DevTools in your browser.

### Run on iOS Simulator

```bash
npm run ios
```

### Run on Android Emulator

```bash
npm run android
```

### Run on Physical Device

1. Install **Expo Go** app from App Store or Play Store
2. Run `npm start`
3. Scan the QR code shown in the terminal or Expo DevTools

## Project Structure

```
mobile/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── LoadingSpinner.tsx
│   ├── context/         # React Context providers
│   │   └── AuthContext.tsx
│   ├── navigation/      # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/         # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── QRScannerScreen.tsx
│   │   ├── VerificationResultScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/        # API and business logic
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── verification.service.ts
│   │   └── storage.service.ts
│   ├── types/           # TypeScript definitions
│   │   └── index.ts
│   └── utils/           # Utility functions
│       ├── theme.ts
│       └── validation.ts
├── assets/              # Images and static files
├── App.tsx              # Main app component
├── app.json             # Expo configuration
└── package.json         # Dependencies
```

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tooling
- **TypeScript** - Type safety
- **React Navigation** - Navigation library
- **Expo Camera** - QR code scanning
- **Expo SecureStore** - Secure token storage
- **Axios** - HTTP client
- **AsyncStorage** - Local data persistence

## App Flow

1. **Authentication**
   - User logs in or registers
   - JWT token is stored securely

2. **Scanner Tab**
   - Request camera permissions
   - Scan product QR code
   - Extract tracking ID

3. **Verification**
   - Send request to backend API
   - Fetch blockchain data
   - Display results (Genuine/Counterfeit)
   - Save to scan history

4. **History Tab**
   - Display all previously scanned products
   - Pull to refresh

5. **Profile Tab**
   - View user information
   - Logout

## API Integration

The app connects to two backend services:

### Backend API (Port 8001)

- Authentication endpoints
- Blockchain verification
- Product data retrieval

### AI Service (Port 8002)

- Image-based counterfeit detection (future enhancement)

## Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

> Note: You'll need an Expo account and EAS CLI configured for production builds.

## Troubleshooting

### Camera Not Working

- Ensure camera permissions are granted in app settings
- On iOS simulator, camera is not available (use physical device)

### API Connection Failed

- Verify backend is running on the specified URL
- Check that your device and backend are on the same network
- Update `.env` with your computer's IP address (not localhost)

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `API_BASE_URL` | Backend API URL | `http://192.168.1.100:8001` |
| `AI_SERVICE_URL` | AI Service URL | `http://192.168.1.100:8002` |

## License

MIT License - Part of the BUCChain platform
