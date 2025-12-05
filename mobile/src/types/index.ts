export interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    manufacturer: string;
    productionDate: string;
    batchNumber: string;
    status: string;
    quantity?: number;
    location?: string;
    trackingId?: string;
    createdAt?: string;
    isCounterfeit?: boolean;
}

export interface TimelineEvent {
    status: string;
    date: string;
    location: string;
}

export interface TrackingEvent {
    id: string;
    location: string;
    status: string;
    description: string;
    timestamp: string;
}

export interface VerificationResult {
    isVerified: boolean;
    product: Product;
    trackingId: string;
    scannedAt: string;
    timeline: TimelineEvent[];
    isAuthentic?: boolean; // Keep for backward compatibility if needed
    confidence?: number;
    trackingHistory?: TrackingEvent[];
    aiDetection?: {
        is_counterfeit: boolean;
        confidence: number;
        processing_time_seconds: number;
    };
}

export interface ScanHistoryItem {
    id: string;
    productId: string;
    productName: string;
    scannedAt: string;
    isAuthentic: boolean;
}

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    VerificationResult: { verificationData: VerificationResult };
};

export type MainTabsParamList = {
    Scanner: undefined;
    History: undefined;
    Profile: undefined;
};
