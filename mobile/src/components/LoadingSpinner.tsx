import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/theme';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, size = 'large' }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={COLORS.primary} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    message: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
        textAlign: 'center',
    },
});
