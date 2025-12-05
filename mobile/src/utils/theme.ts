import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
    // Premium Palette
    primary: '#6366F1', // Indigo 500
    primaryDark: '#4338CA', // Indigo 700
    primaryLight: '#818CF8', // Indigo 400

    secondary: '#EC4899', // Pink 500
    secondaryDark: '#BE185D', // Pink 700
    secondaryLight: '#F472B6', // Pink 400

    accent: '#8B5CF6', // Violet 500

    // Backgrounds
    background: '#0F172A', // Slate 900
    surface: '#1E293B', // Slate 800
    surfaceLight: '#334155', // Slate 700

    // Text
    text: '#F8FAFC', // Slate 50
    textSecondary: '#94A3B8', // Slate 400
    textMuted: '#64748B', // Slate 500

    // Status
    success: '#10B981', // Emerald 500
    error: '#EF4444', // Red 500
    warning: '#F59E0B', // Amber 500
    info: '#3B82F6', // Blue 500

    // Gradients
    gradientStart: '#4F46E5',
    gradientEnd: '#EC4899',

    transparent: 'transparent',
    white: '#FFFFFF',
    black: '#000000',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    screenPadding: 20,
};

export const TYPOGRAPHY = {
    h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
        color: COLORS.text,
    },
    h2: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32,
        color: COLORS.text,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
        color: COLORS.text,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
        color: COLORS.textSecondary,
    },
    caption: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
        color: COLORS.textMuted,
    },
    small: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
        color: COLORS.textMuted,
    },
};

export const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6.27,
        elevation: 5,
    },
    large: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    glow: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 10,
    }
};

export const BORDER_RADIUS = {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 30,
    full: 9999,
};

export const LAYOUT = {
    window: {
        width,
        height,
    },
    isSmallDevice: width < 375,
};
