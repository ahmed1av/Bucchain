import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../utils/theme';

interface AnimatedButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    isLoading = false,
    disabled = false,
    style,
    textStyle,
    icon,
}) => {
    const getColors = () => {
        if (disabled) return [COLORS.surfaceLight, COLORS.surfaceLight];
        switch (variant) {
            case 'primary':
                return [COLORS.primary, COLORS.secondary];
            case 'secondary':
                return [COLORS.surfaceLight, COLORS.surfaceLight];
            case 'outline':
                return ['transparent', 'transparent'];
            default:
                return [COLORS.primary, COLORS.secondary];
        }
    };

    const getTextColor = () => {
        if (disabled) return COLORS.textMuted;
        if (variant === 'outline') return COLORS.primaryLight;
        return COLORS.white;
    };

    return (
        <MotiView
            from={{ scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || isLoading}
                activeOpacity={0.8}
                style={[styles.touchable, style]}
            >
                <LinearGradient
                    colors={getColors() as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                        styles.container,
                        variant === 'outline' && styles.outline,
                    ]}
                >
                    {isLoading ? (
                        <ActivityIndicator color={getTextColor()} />
                    ) : (
                        <>
                            {icon}
                            <Text style={[
                                styles.text,
                                { color: getTextColor() },
                                icon ? { marginLeft: SPACING.sm } : {},
                                textStyle
                            ]}>
                                {title}
                            </Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </MotiView>
    );
};

const styles = StyleSheet.create({
    touchable: {
        width: '100%',
        ...SHADOWS.medium,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.full,
        width: '100%',
    },
    outline: {
        borderWidth: 1,
        borderColor: COLORS.primaryLight,
    },
    text: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
        textAlign: 'center',
    },
});
