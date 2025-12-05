import { authUtils } from './auth';

const API_BASE = '/api';

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  retries?: number;
}

class ApiService {
  private baseURL: string;
  private maxRetries: number = 3;

  constructor() {
    this.baseURL = API_BASE;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async request(endpoint: string, options: RequestConfig = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const { skipAuth = false, retries = this.maxRetries, ...fetchOptions } = options;

    // Only log requests if not for refresh endpoint (reduces console noise)
    if (!url.includes('/auth/refresh')) {
      console.log('🔍 API Request:', url);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    };

    // Add authentication header if not skipped
    if (!skipAuth) {
      const token = authUtils.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers,
    };

    let lastError: Error | null = null;

    // Retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, config);

        // Only log response status if it's not an expected 401 on refresh
        if (!(response.status === 401 && url.includes('/auth/refresh'))) {
          console.log('📡 API Response Status:', response.status);
        }

        // Handle 401 Unauthorized
        if (response.status === 401) {
          // If this was a refresh attempt that failed, or if we shouldn't retry
          if (url.includes('/auth/refresh')) {
            authUtils.clearAuth();
            // Don't log to console - this is expected when no session exists
            throw new Error('Session expired');
          }

          // Try to refresh token
          try {
            console.log('🔄 Refreshing token...');
            const refreshResponse = await this.refreshToken();
            authUtils.setAuth(refreshResponse.access_token, refreshResponse.user);

            // Update header with new token
            config.headers = {
              ...config.headers,
              'Authorization': `Bearer ${refreshResponse.access_token}`,
            };

            // Retry original request
            console.log('🔄 Retrying original request...');
            const retryResponse = await fetch(url, config);
            if (!retryResponse.ok) {
              const errorData = await retryResponse.json().catch(() => ({}));
              throw new Error(errorData.message || `HTTP error! status: ${retryResponse.status}`);
            }
            return await retryResponse.json();
          } catch (refreshError) {
            console.error('Refresh failed:', refreshError);
            authUtils.clearAuth();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            throw new Error('Session expired');
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;

        // Only log errors if they're not expected session expiration (which is normal)
        const isExpectedSessionError = error instanceof Error &&
          error.message.includes('Session expired') &&
          url.includes('/auth/refresh');

        if (!isExpectedSessionError) {
          console.error(`🌐 API Error (Attempt ${attempt + 1}/${retries + 1}):`, error);
        }

        // Don't retry on auth errors or client errors (unless it was the 401 we just handled)
        if (error instanceof Error &&
          (error.message.includes('Unauthorized') ||
            error.message.includes('Session expired') ||
            error.message.includes('400') ||
            error.message.includes('403') ||
            error.message.includes('404') ||
            error.message.includes('409'))) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < retries) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw new Error(lastError?.message || 'Unable to connect to backend server');
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
      skipAuth: true, // Refresh endpoint uses cookie, not Bearer token
      retries: 0, // Never retry refresh requests to avoid rate limiting
      credentials: 'include', // Ensure cookies are sent
    });
  }

  // 🔐 Authentication
  async register(data: { email: string; password: string; name: string; role?: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // 📦 Products
  async getProducts() {
    return this.request('/products');
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async createProduct(data: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // 🏭 Suppliers
  async getSuppliers() {
    return this.request('/suppliers');
  }

  // 📊 Analytics
  async getMetrics() {
    return this.request('/analytics/metrics');
  }

  async getDashboard() {
    return this.request('/analytics/dashboard');
  }

  // 🔍 Tracking
  async trackProduct(trackingId: string) {
    return this.request(`/track/${trackingId}`);
  }

  // 📈 Predictions
  async getPredictions() {
    return this.request('/analytics/predictions');
  }

  // 🩺 Health Check
  async getHealth() {
    return this.request('/health', { skipAuth: true });
  }
}

export const apiService = new ApiService();

