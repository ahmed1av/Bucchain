import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { MotiView } from 'moti';
import { CheckCircle, XCircle, MapPin, Calendar, Package, ShieldCheck, ArrowLeft } from 'lucide-react-native';

import { RootStackParamList } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';

type VerificationResultRouteProp = RouteProp<RootStackParamList, 'VerificationResult'>;

export const VerificationResultScreen: React.FC = () => {
    const route = useRoute<VerificationResultRouteProp>();
    const navigation = useNavigation();
    const { verificationData } = route.params;
    const { isVerified, product, timeline } = verificationData;

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <AnimatedButton
                    title="Back"
                    onPress={() => navigation.goBack()}
                    variant="outline"
                    style={styles.backButton}
                    icon={<ArrowLeft size={20} color={COLORS.primaryLight} />}
                />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring' }}
                    style={styles.statusContainer}
                >
                    {isVerified ? (
                        <CheckCircle size={80} color={COLORS.success} />
                    ) : (
                        <XCircle size={80} color={COLORS.error} />
                    )}
                    <Text style={[
                        styles.statusTitle,
                        { color: isVerified ? COLORS.success : COLORS.error }
                    ]}>
                        {isVerified ? 'Authentic Product' : 'Verification Failed'}
                    </Text>
                    <Text style={styles.statusSubtitle}>
                        {isVerified
                            ? 'This product has been verified on the blockchain.'
                            : 'This product could not be verified in our records.'}
                    </Text>
                </MotiView>

                {product && (
                    <MotiView
                        from={{ opacity: 0, translateY: 50 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 300 }}
                    >
                        <GlassCard style={styles.productCard}>
                            <Image
                                source={{ uri: product.image || 'https://via.placeholder.com/300' }}
                                style={styles.productImage}
                            />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productDesc}>{product.description}</Text>

                                <View style={styles.detailRow}>
                                    <ShieldCheck size={16} color={COLORS.primaryLight} />
                                    <Text style={styles.detailText}>{product.manufacturer}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Package size={16} color={COLORS.primaryLight} />
                                    <Text style={styles.detailText}>Batch: {product.batchNumber}</Text>
                                </View>
                            </View>
                        </GlassCard>
                    </MotiView>
                )}

                {timeline && timeline.length > 0 && (
                    <MotiView
                        from={{ opacity: 0, translateY: 50 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 500 }}
                        style={styles.timelineContainer}
                    >
                        <Text style={styles.sectionTitle}>Product Journey</Text>

                        {timeline.map((event: any, index: number) => (
                            <View key={index} style={styles.timelineItem}>
                                <View style={styles.timelineLeft}>
                                    <View style={[
                                        styles.timelineDot,
                                        index === 0 && styles.timelineDotActive
                                    ]} />
                                    {index !== timeline.length - 1 && <View style={styles.timelineLine} />}
                                </View>
                                <GlassCard style={styles.timelineContent}>
                                    <Text style={styles.eventStatus}>{event.status}</Text>
                                    <View style={styles.eventMeta}>
                                        <Calendar size={14} color={COLORS.textMuted} />
                                        <Text style={styles.eventDate}>
                                            {new Date(event.date).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <View style={styles.eventMeta}>
                                        <MapPin size={14} color={COLORS.textMuted} />
                                        <Text style={styles.eventLocation}>{event.location}</Text>
                                    </View>
                                </GlassCard>
                            </View>
                        ))}
                    </MotiView>
                )}
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: SPACING.md,
    },
    backButton: {
        width: 100,
        paddingVertical: SPACING.sm,
    },
    content: {
        padding: SPACING.lg,
        paddingBottom: 100,
    },
    statusContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    statusTitle: {
        ...TYPOGRAPHY.h2,
        marginTop: SPACING.md,
        marginBottom: SPACING.xs,
    },
    statusSubtitle: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
        color: COLORS.textSecondary,
    },
    productCard: {
        padding: 0,
        marginBottom: SPACING.xl,
    },
    productImage: {
        width: '100%',
        height: 200,
        backgroundColor: COLORS.surfaceLight,
    },
    productInfo: {
        padding: SPACING.lg,
    },
    productName: {
        ...TYPOGRAPHY.h2,
        color: COLORS.white,
        marginBottom: SPACING.xs,
    },
    productDesc: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    detailText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.primaryLight,
        marginLeft: SPACING.sm,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        color: COLORS.white,
        marginBottom: SPACING.lg,
    },
    timelineContainer: {
        marginTop: SPACING.md,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
    },
    timelineLeft: {
        alignItems: 'center',
        marginRight: SPACING.md,
        width: 20,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.surfaceLight,
        borderWidth: 2,
        borderColor: COLORS.textMuted,
    },
    timelineDotActive: {
        backgroundColor: COLORS.success,
        borderColor: COLORS.success,
    },
    timelineLine: {
        flex: 1,
        width: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 4,
    },
    timelineContent: {
        flex: 1,
        padding: SPACING.md,
    },
    eventStatus: {
        ...TYPOGRAPHY.h3,
        color: COLORS.white,
        fontSize: 16,
        marginBottom: SPACING.xs,
    },
    eventMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    eventDate: {
        ...TYPOGRAPHY.small,
        color: COLORS.textMuted,
        marginLeft: SPACING.xs,
    },
    eventLocation: {
        ...TYPOGRAPHY.small,
        color: COLORS.textMuted,
        marginLeft: SPACING.xs,
    },
});
