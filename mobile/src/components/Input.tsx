import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
    label: string;
    error?: string;
    isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    isPassword,
    style,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={[
                styles.label,
                isFocused && styles.labelFocused,
                !!error && styles.labelError
            ]}>
                {label}
            </Text>

            <MotiView
                animate={{
                    borderColor: error
                        ? COLORS.error
                        : isFocused
                            ? COLORS.primary
                            : 'rgba(255, 255, 255, 0.1)',
                    scale: isFocused ? 1.01 : 1,
                }}
                transition={{ type: 'timing', duration: 200 }}
                style={styles.inputContainer}
            >
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry={isPassword && !showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    selectionColor={COLORS.primary}
                    {...props}
                />

                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.iconContainer}
                    >
                        {showPassword ? (
                            <EyeOff size={20} color={COLORS.textSecondary} />
                        ) : (
                            <Eye size={20} color={COLORS.textSecondary} />
                        )}
                    </TouchableOpacity>
                )}
            </MotiView>

            {error && (
                <MotiView
                    from={{ opacity: 0, translateY: -10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                >
                    <Text style={styles.errorText}>{error}</Text>
                </MotiView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    label: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    labelFocused: {
        color: COLORS.primaryLight,
    },
    labelError: {
        color: COLORS.error,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    input: {
        flex: 1,
        padding: SPACING.md,
        color: COLORS.text,
        ...TYPOGRAPHY.body,
    },
    iconContainer: {
        padding: SPACING.md,
    },
    errorText: {
        ...TYPOGRAPHY.small,
        color: COLORS.error,
        marginTop: SPACING.xs,
        marginLeft: SPACING.xs,
    },
});
