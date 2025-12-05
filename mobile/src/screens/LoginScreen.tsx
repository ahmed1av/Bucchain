import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MotiView } from 'moti';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/theme';
import { Input } from '../components/Input';
import { AnimatedButton } from '../components/AnimatedButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard } from '../components/GlassCard';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <MotiView
                        from={{ opacity: 0, translateY: 50 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 1000 }}
                        style={styles.headerContainer}
                    >
                        <Text style={styles.title}>BUCChain</Text>
                        <Text style={styles.subtitle}>Secure Product Verification</Text>
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', delay: 300 }}
                    >
                        <GlassCard style={styles.card}>
                            <Text style={styles.cardTitle}>Welcome Back</Text>

                            {error ? <Text style={styles.errorText}>{error}</Text> : null}

                            <Input
                                label="Email Address"
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />

                            <Input
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                isPassword
                            />

                            <View style={styles.buttonContainer}>
                                <AnimatedButton
                                    title="Sign In"
                                    onPress={handleLogin}
                                    isLoading={isLoading}
                                />
                            </View>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Don't have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <Text style={styles.linkText}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    </MotiView>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        ...TYPOGRAPHY.h1,
        color: COLORS.white,
        marginBottom: SPACING.xs,
        textShadowColor: COLORS.primary,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        color: COLORS.primaryLight,
    },
    card: {
        padding: SPACING.lg,
    },
    cardTitle: {
        ...TYPOGRAPHY.h2,
        color: COLORS.white,
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: SPACING.md,
    },
    errorText: {
        ...TYPOGRAPHY.body,
        color: COLORS.error,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.lg,
    },
    footerText: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
    },
    linkText: {
        ...TYPOGRAPHY.body,
        color: COLORS.primaryLight,
        fontWeight: '600',
    },
});
