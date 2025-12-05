import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../utils/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
}) => {
    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            ...styles.button,
            ...SHADOWS.small,
        };

        // Size styles
        const sizeStyles: Record<string, ViewStyle> = {
            small: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
            medium: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
            large: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl },
        };

        // Variant styles
        const variantStyles: Record<string, ViewStyle> = {
            primary: { backgroundColor: COLORS.primary },
            secondary: { backgroundColor: COLORS.secondary },
            outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: COLORS.primary },
            danger: { backgroundColor: COLORS.danger },
        };

        return {
            ...baseStyle,
            ...sizeStyles[size],
            ...variantStyles[variant],
            ...(disabled && { backgroundColor: COLORS.disabled, opacity: 0.6 }),
        };
    };

    const getTextStyle = (): TextStyle => {
        const baseTextStyle: TextStyle = {
            ...TYPOGRAPHY.body,
            fontWeight: '600',
            textAlign: 'center',
        };

        const sizeTextStyles: Record<string, TextStyle> = {
            small: { fontSize: 14 },
            medium: { fontSize: 16 },
            large: { fontSize: 18 },
        };

        const variantTextStyles: Record<string, TextStyle> = {
            primary: { color: '#FFFFFF' },
            secondary: { color: '#FFFFFF' },
            outline: { color: COLORS.primary },
            danger: { color: '#FFFFFF' },
        };

        return {
            ...baseTextStyle,
            ...sizeTextStyles[size],
            ...variantTextStyles[variant],
        };
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[getButtonStyle(), style]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? COLORS.primary : '#FFFFFF'} />
            ) : (
                <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
});
