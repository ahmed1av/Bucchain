import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await register(name, email, password);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join the secure network</Text>
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', delay: 300 }}
                    >
                        <GlassCard style={styles.card}>
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}

                            <Input
                                label="Full Name"
                                placeholder="Enter your full name"
                                value={name}
                                onChangeText={setName}
                            />

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
                                placeholder="Create a password"
                                value={password}
                                onChangeText={setPassword}
                                isPassword
                            />

                            <Input
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                isPassword
                            />

                            <View style={styles.buttonContainer}>
                                <AnimatedButton
                                    title="Create Account"
                                    onPress={handleRegister}
                                    isLoading={isLoading}
                                />
                            </View>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.linkText}>Sign In</Text>
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
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        color: COLORS.primaryLight,
    },
    card: {
        padding: SPACING.lg,
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
