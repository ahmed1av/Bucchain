import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const storageService = {
    // Secure token storage
    async saveToken(token: string): Promise<void> {
        if (Platform.OS === 'web') {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } else {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        }
    },

    async getToken(): Promise<string | null> {
        if (Platform.OS === 'web') {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } else {
            return await SecureStore.getItemAsync(TOKEN_KEY);
        }
    },

    async deleteToken(): Promise<void> {
        if (Platform.OS === 'web') {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
    },

    // User data storage
    async saveUserData(userData: any): Promise<void> {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    },

    async getUserData(): Promise<any | null> {
        const data = await AsyncStorage.getItem(USER_KEY);
        return data ? JSON.parse(data) : null;
    },

    async deleteUserData(): Promise<void> {
        await AsyncStorage.removeItem(USER_KEY);
    },

    // Scan history storage
    async saveScanHistory(scanData: any): Promise<void> {
        try {
            const existing = await AsyncStorage.getItem('scan_history');
            const history = existing ? JSON.parse(existing) : [];
            history.unshift({ ...scanData, scannedAt: new Date().toISOString() });
            // Keep only last 50 scans
            const limited = history.slice(0, 50);
            await AsyncStorage.setItem('scan_history', JSON.stringify(limited));
        } catch (error) {
            console.error('Error saving scan history:', error);
        }
    },

    async getScanHistory(): Promise<any[]> {
        try {
            const data = await AsyncStorage.getItem('scan_history');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting scan history:', error);
            return [];
        }
    },

    async clearScanHistory(): Promise<void> {
        await AsyncStorage.removeItem('scan_history');
    },

    // Clear all data
    async clearAll(): Promise<void> {
        await this.deleteToken();
        await this.deleteUserData();
        await this.clearScanHistory();
    },
};
