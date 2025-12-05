import apiClient from './api';
import { storageService } from './storage.service';
import { VerificationResult, Product, TrackingEvent } from '../types';

export const verificationService = {
    async verifyProduct(trackingId: string): Promise<VerificationResult> {
        try {
            // Get blockchain verification
            const blockchainResponse = await apiClient.get(`/blockchain/product/${trackingId}`);
            const product = blockchainResponse.data;

            // Get tracking history
            const historyResponse = await apiClient.get(`/blockchain/history/${trackingId}`);
            const trackingHistory = historyResponse.data;

            // For now, determine authenticity based on blockchain data
            // In a real scenario, you'd integrate with the AI service for image verification
            const isAuthentic = product && product.manufacturer;

            const result: VerificationResult = {
                isAuthentic,
                confidence: isAuthentic ? 0.95 : 0.5,
                product,
                trackingHistory,
            };

            // Save to scan history
            await storageService.saveScanHistory({
                id: trackingId,
                productId: product.id,
                productName: product.name,
                isAuthentic,
            });

            return result;
        } catch (error: any) {
            console.error('Verification error:', error);
            throw new Error(error.response?.data?.message || 'Failed to verify product');
        }
    },

    async getScanHistory(): Promise<any[]> {
        return await storageService.getScanHistory();
    },

    async clearHistory(): Promise<void> {
        await storageService.clearScanHistory();
    },

    // AI-based image verification (optional enhancement)
    async verifyProductImage(imageUri: string): Promise<any> {
        // This would upload an image to the AI service for counterfeit detection
        // Implementation depends on your AI service API
        // For now, this is a placeholder
        throw new Error('Image verification not yet implemented');
    },
};
