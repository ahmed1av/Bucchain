import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration } from 'react-native';
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { Scan, X } from 'lucide-react-native';

import { verificationService } from '../services/verification.service';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, LAYOUT } from '../utils/theme';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard } from '../components/GlassCard';

type QRScannerNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export const QRScannerScreen: React.FC = () => {
    const navigation = useNavigation<QRScannerNavigationProp>();
    const isFocused = useIsFocused();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        requestCameraPermission();
    }, []);

    const requestCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
        if (scanned || isProcessing) return;

        setScanned(true);
        setIsProcessing(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        try {
            // Extract tracking ID
            let trackingId = data;
            try {
                const parsed = JSON.parse(data);
                trackingId = parsed.trackingId || parsed.id || data;
            } catch {
                // Not JSON, use as is
            }

            // Verify product
            const verificationData = await verificationService.verifyProduct(trackingId);

            // Navigate to result screen
            navigation.navigate('VerificationResult', { verificationData });
        } catch (error: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Verification Failed', error.message || 'Could not verify product', [
                { text: 'OK', onPress: () => setScanned(false) },
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    if (hasPermission === null) {
        return (
            <ScreenWrapper>
                <View style={styles.centerContent}>
                    <LoadingSpinner message="Requesting camera permission..." />
                </View>
            </ScreenWrapper>
        );
    }

    if (hasPermission === false) {
        return (
            <ScreenWrapper>
                <View style={styles.centerContent}>
                    <GlassCard style={styles.permissionCard}>
                        <Text style={styles.errorText}>No access to camera</Text>
                        <Text style={styles.permissionText}>
                            We need camera access to scan product QR codes.
                        </Text>
                        <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
                            <Text style={styles.permissionButtonText}>Grant Permission</Text>
                        </TouchableOpacity>
                    </GlassCard>
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <View style={styles.container}>
            {isFocused && (
                <CameraView
                    style={styles.camera}
                    facing="back"
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                >
                    <View style={styles.overlay}>
                        <View style={styles.header}>
                            <GlassCard style={styles.headerCard}>
                                <Text style={styles.title}>Scan Product</Text>
                                <Text style={styles.subtitle}>Align QR code within the frame</Text>
                            </GlassCard>
                        </View>

                        <View style={styles.scanArea}>
                            <MotiView
                                from={{ scale: 1, opacity: 0.5 }}
                                animate={{ scale: 1.05, opacity: 1 }}
                                transition={{
                                    type: 'timing',
                                    duration: 1500,
                                    loop: true,
                                }}
                                style={styles.scanFrame}
                            >
                                <View style={[styles.corner, styles.topLeft]} />
                                <View style={[styles.corner, styles.topRight]} />
                                <View style={[styles.corner, styles.bottomLeft]} />
                                <View style={[styles.corner, styles.bottomRight]} />

                                <MotiView
                                    from={{ translateY: -125 }}
                                    animate={{ translateY: 125 }}
                                    transition={{
                                        type: 'timing',
                                        duration: 2000,
                                        loop: true,
                                    }}
                                    style={styles.scanLine}
                                />
                            </MotiView>
                        </View>

                        {isProcessing && (
                            <View style={styles.processingContainer}>
                                <GlassCard>
                                    <LoadingSpinner message="Verifying..." size="large" />
                                </GlassCard>
                            </View>
                        )}

                        {scanned && !isProcessing && (
                            <View style={styles.footer}>
                                <TouchableOpacity
                                    style={styles.rescanButton}
                                    onPress={() => setScanned(false)}
                                >
                                    <Scan size={24} color={COLORS.white} />
                                    <Text style={styles.rescanText}>Scan Again</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </CameraView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    camera: {
        flex: 1,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: SPACING.lg,
        alignItems: 'center',
    },
    headerCard: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.xl,
        alignItems: 'center',
    },
    title: {
        ...TYPOGRAPHY.h3,
        color: COLORS.white,
    },
    subtitle: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
    },
    scanArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: COLORS.primary,
        borderWidth: 4,
    },
    topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
    scanLine: {
        width: '90%',
        height: 2,
        backgroundColor: COLORS.secondary,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    processingContainer: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    rescanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDER_RADIUS.full,
    },
    rescanText: {
        ...TYPOGRAPHY.body,
        color: COLORS.white,
        fontWeight: '600',
        marginLeft: SPACING.sm,
    },
    permissionCard: {
        alignItems: 'center',
        padding: SPACING.xl,
    },
    errorText: {
        ...TYPOGRAPHY.h3,
        color: COLORS.error,
        marginBottom: SPACING.sm,
    },
    permissionText: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    permissionButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDER_RADIUS.md,
    },
    permissionButtonText: {
        ...TYPOGRAPHY.body,
        color: COLORS.white,
        fontWeight: '600',
    },
});
