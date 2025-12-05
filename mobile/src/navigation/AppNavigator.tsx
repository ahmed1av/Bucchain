import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Scan, Clock, User, ShoppingBag } from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';
import { RootStackParamList, MainTabsParamList } from '../types';
import { COLORS } from '../utils/theme';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { QRScannerScreen } from '../screens/QRScannerScreen';
import { VerificationResultScreen } from '../screens/VerificationResultScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { GradientBackground } from '../components/GradientBackground';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

const MainTabs: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: COLORS.primaryLight,
                tabBarInactiveTintColor: COLORS.textSecondary,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    borderTopWidth: 0,
                    backgroundColor: 'transparent',
                    height: 85,
                },
                tabBarBackground: () => (
                    <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
                ),
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 5,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="Products"
                component={ProductsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
                    title: 'Discover',
                }}
            />
            <Tab.Screen
                name="Scanner"
                component={QRScannerScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <View style={styles.scanButtonContainer}>
                            <View style={styles.scanButton}>
                                <Scan size={28} color={COLORS.white} />
                            </View>
                        </View>
                    ),
                    title: '',
                    tabBarLabelStyle: { display: 'none' },
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
                    title: 'History',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
                    title: 'Profile',
                }}
            />
        </Tab.Navigator>
    );
};

export const AppNavigator: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <GradientBackground>
                <LoadingSpinner message="Loading..." />
            </GradientBackground>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: 'transparent' },
                    presentation: 'card',
                }}
            >
                {!isAuthenticated ? (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                        <Stack.Screen
                            name="VerificationResult"
                            component={VerificationResultScreen}
                            options={{
                                presentation: 'modal',
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    scanButtonContainer: {
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 4,
        borderColor: 'rgba(0,0,0,0.5)',
    },
});
