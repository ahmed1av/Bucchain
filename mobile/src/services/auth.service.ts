import apiClient from './api';
import { storageService } from './storage.service';
import { AuthResponse, User } from '../types';

export const authService = {
    async register(name: string, email: string, password: string): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', {
            name,
            email,
            password,
        });

        // Save token and user data
        await storageService.saveToken(response.data.access_token);
        await storageService.saveUserData(response.data.user);

        return response.data;
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', {
            email,
            password,
        });

        // Save token and user data
        await storageService.saveToken(response.data.access_token);
        await storageService.saveUserData(response.data.user);

        return response.data;
    },

    async getProfile(): Promise<User> {
        const response = await apiClient.get<User>('/auth/profile');
        await storageService.saveUserData(response.data);
        return response.data;
    },

    async logout(): Promise<void> {
        await storageService.clearAll();
    },

    async isAuthenticated(): Promise<boolean> {
        const token = await storageService.getToken();
        return !!token;
    },

    async getCurrentUser(): Promise<User | null> {
        return await storageService.getUserData();
    },
};
