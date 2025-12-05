import React from 'react';
import { StyleSheet, ViewStyle, SafeAreaView, StatusBar, Platform } from 'react-native';
import { GradientBackground } from './GradientBackground';
import { COLORS, SPACING } from '../utils/theme';

interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
    withScrollView?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style }) => {
    return (
        <GradientBackground>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
                <React.Fragment>
                    {children}
                </React.Fragment>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});
