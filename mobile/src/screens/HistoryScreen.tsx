import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MotiView } from 'moti';
import { Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react-native';

import { storageService } from '../services/storage.service';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard } from '../components/GlassCard';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export const HistoryScreen: React.FC = () => {
    const navigation = useNavigation<HistoryScreenNavigationProp>();
    const [history, setHistory] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadHistory = async () => {
        const data = await storageService.getScanHistory();
        setHistory(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        const isVerified = item.isVerified;

        return (
            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', delay: index * 100 }}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate('VerificationResult', { verificationData: item })}
                    activeOpacity={0.7}
                >
                    <GlassCard style={styles.itemCard}>
                        <View style={styles.itemHeader}>
                            <View style={styles.statusContainer}>
                                {isVerified ? (
                                    <CheckCircle size={20} color={COLORS.success} />
                                ) : (
                                    <XCircle size={20} color={COLORS.error} />
                                )}
                                <Text style={[
                                    styles.statusText,
                                    { color: isVerified ? COLORS.success : COLORS.error }
                                ]}>
                                    {isVerified ? 'Verified' : 'Invalid'}
                                </Text>
                            </View>
                            <Text style={styles.dateText}>
                                {new Date(item.scannedAt).toLocaleDateString()}
                            </Text>
                        </View>

                        <Text style={styles.productName}>
                            {item.product?.name || 'Unknown Product'}
                        </Text>

                        <View style={styles.itemFooter}>
                            <Text style={styles.trackingId}>ID: {item.trackingId}</Text>
                            <ChevronRight size={20} color={COLORS.textSecondary} />
                        </View>
                    </GlassCard>
                </TouchableOpacity>
            </MotiView>
        );
    };

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.title}>Scan History</Text>
            </View>

            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.trackingId}-${index}`}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                        colors={[COLORS.primary]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Clock size={48} color={COLORS.textMuted} />
                        <Text style={styles.emptyText}>No scan history yet</Text>
                        <Text style={styles.emptySubtext}>
                            Scanned products will appear here
                        </Text>
                    </View>
                }
            />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: SPACING.lg,
    },
    title: {
        ...TYPOGRAPHY.h1,
        color: COLORS.white,
    },
    listContent: {
        padding: SPACING.lg,
        paddingTop: 0,
    },
    itemCard: {
        marginBottom: SPACING.md,
        padding: SPACING.md,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        ...TYPOGRAPHY.small,
        fontWeight: '600',
        marginLeft: SPACING.xs,
    },
    dateText: {
        ...TYPOGRAPHY.small,
        color: COLORS.textMuted,
    },
    productName: {
        ...TYPOGRAPHY.h3,
        color: COLORS.white,
        marginBottom: SPACING.xs,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    trackingId: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        fontFamily: 'monospace',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyText: {
        ...TYPOGRAPHY.h3,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
    },
    emptySubtext: {
        ...TYPOGRAPHY.body,
        color: COLORS.textMuted,
        marginTop: SPACING.xs,
    },
});
