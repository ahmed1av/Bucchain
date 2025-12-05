import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, BORDER_RADIUS, SPACING } from '../utils/theme';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, intensity = 20 }) => {
    return (
        <View style={[styles.container, style]}>
            <BlurView intensity={intensity} tint="dark" style={styles.blur}>
                <View style={styles.content}>
                    {children}
                </View>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        backgroundColor: 'rgba(30, 41, 59, 0.4)', // Semi-transparent slate
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    blur: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: SPACING.md,
    },
});
