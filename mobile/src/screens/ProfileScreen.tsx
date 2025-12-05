import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/theme';

export const ProfileScreen: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await logout();
                },
            },
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text style={styles.name}>{user?.name || 'User'}</Text>
                    <Text style={styles.email}>{user?.email || ''}</Text>
                </View>

                {/* Account Information */}
                <Card style={styles.card}>
                    <Text style={styles.sectionTitle}>Account Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Name</Text>
                        <Text style={styles.infoValue}>{user?.name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>{user?.email}</Text>
                    </View>
                    {user?.role && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Role</Text>
                            <Text style={styles.infoValue}>{user.role}</Text>
                        </View>
                    )}
                </Card>

                {/* App Information */}
                <Card style={styles.card}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>App Version</Text>
                        <Text style={styles.infoValue}>1.0.0</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Platform</Text>
                        <Text style={styles.infoValue}>BUCChain</Text>
                    </View>
                </Card>

                {/* Logout Button */}
                <Button
                    title="Logout"
                    onPress={handleLogout}
                    variant="danger"
                    style={styles.logoutButton}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.md,
    },
    header: {
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    avatarText: {
        ...TYPOGRAPHY.h1,
        color: '#FFFFFF',
    },
    name: {
        ...TYPOGRAPHY.h2,
        marginBottom: SPACING.xs,
    },
    email: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
    },
    card: {
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        marginBottom: SPACING.md,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
        paddingVertical: SPACING.xs,
    },
    infoLabel: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
    },
    infoValue: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
    },
    logoutButton: {
        marginTop: SPACING.lg,
        marginBottom: SPACING.xl,
    },
});
