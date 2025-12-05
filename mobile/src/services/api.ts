import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { storageService } from './storage.service';

// Use environment variable for API URL, fallback to localhost
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8001';

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await storageService.getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear auth data
            await storageService.clearAll();
        }
        return Promise.reject(error);
    }
);

export default apiClient;
