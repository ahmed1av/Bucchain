import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const isAuth = await authService.isAuthenticated();
            if (isAuth) {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login(email, password);
            setUser(response.user);
        } catch (error) {
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const response = await authService.register(name, email, password);
            setUser(response.user);
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const refreshUser = async () => {
        try {
            const userData = await authService.getProfile();
            setUser(userData);
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
