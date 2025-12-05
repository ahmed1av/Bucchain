import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/theme';

interface GradientBackgroundProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, style }) => {
    return (
        <LinearGradient
            colors={[COLORS.background, '#1e1b4b', COLORS.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, style]}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
