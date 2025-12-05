// Token management utilities
const TOKEN_KEY = 'bucchain_token';
const USER_KEY = 'bucchain_user';

export const authUtils = {
    // Store token and user data
    setAuth(token: string, user: any) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    },

    // Get stored token
    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    // Get stored user
    getUser(): any | null {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem(USER_KEY);
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    // Clear auth data
    clearAuth() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};
