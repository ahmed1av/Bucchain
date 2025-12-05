import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/theme';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
    return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        ...SHADOWS.medium,
    },
});
