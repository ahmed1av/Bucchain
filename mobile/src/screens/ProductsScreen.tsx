import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MotiView } from 'moti';
import { Search, Filter, ShoppingBag } from 'lucide-react-native';

import { RootStackParamList } from '../types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard } from '../components/GlassCard';
import { MOCK_PRODUCTS } from '../services/mockData';

type ProductsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export const ProductsScreen: React.FC = () => {
    const navigation = useNavigation<ProductsScreenNavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];

    const filteredProducts = MOCK_PRODUCTS.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const renderItem = ({ item, index }: { item: typeof MOCK_PRODUCTS[0]; index: number }) => (
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: index * 100 }}
            style={styles.productContainer}
        >
            <TouchableOpacity
                onPress={() => {
                    // Simulate verification for demo
                    navigation.navigate('VerificationResult', {
                        verificationData: {
                            isVerified: item.status === 'Verified',
                            product: item,
                            trackingId: item.id,
                            scannedAt: new Date().toISOString(),
                            timeline: [
                                { status: 'Manufactured', date: item.productionDate, location: 'Factory A' },
                                { status: 'Quality Check', date: item.productionDate, location: 'QC Lab' },
                                { status: 'Shipped', date: new Date().toISOString(), location: 'Distribution Center' },
                            ]
                        }
                    });
                }}
                activeOpacity={0.9}
            >
                <GlassCard style={styles.productCard}>
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                    <View style={styles.productInfo}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{item.category}</Text>
                        </View>
                        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusDot, { backgroundColor: item.status === 'Verified' ? COLORS.success : COLORS.warning }]} />
                            <Text style={styles.statusText}>{item.status}</Text>
                        </View>
                    </View>
                </GlassCard>
            </TouchableOpacity>
        </MotiView>
    );

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.title}>Discover</Text>

                <View style={styles.searchContainer}>
                    <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        placeholderTextColor={COLORS.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <FlatList
                    horizontal
                    data={categories}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedCategory(item)}
                            style={[
                                styles.categoryChip,
                                selectedCategory === item && styles.categoryChipActive
                            ]}
                        >
                            <Text style={[
                                styles.categoryChipText,
                                selectedCategory === item && styles.categoryChipTextActive
                            ]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <FlatList
                data={filteredProducts}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.productList}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: SPACING.lg,
        paddingBottom: SPACING.sm,
    },
    title: {
        ...TYPOGRAPHY.h1,
        color: COLORS.white,
        marginBottom: SPACING.md,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: BORDER_RADIUS.full,
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.md,
        height: 48,
    },
    searchIcon: {
        marginRight: SPACING.sm,
    },
    searchInput: {
        flex: 1,
        color: COLORS.white,
        ...TYPOGRAPHY.body,
    },
    categoriesList: {
        paddingVertical: SPACING.xs,
    },
    categoryChip: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginRight: SPACING.sm,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    categoryChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryChipText: {
        ...TYPOGRAPHY.small,
        color: COLORS.textSecondary,
    },
    categoryChipTextActive: {
        color: COLORS.white,
        fontWeight: '600',
    },
    productList: {
        padding: SPACING.md,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    productContainer: {
        width: '48%',
        marginBottom: SPACING.md,
    },
    productCard: {
        padding: 0,
        height: 260,
    },
    productImage: {
        width: '100%',
        height: 140,
        backgroundColor: COLORS.surfaceLight,
    },
    productInfo: {
        padding: SPACING.sm,
        flex: 1,
        justifyContent: 'space-between',
    },
    categoryBadge: {
        position: 'absolute',
        top: -130,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: SPACING.xs,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.sm,
    },
    categoryText: {
        ...TYPOGRAPHY.small,
        fontSize: 10,
        color: COLORS.white,
    },
    productName: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.white,
        fontSize: 14,
        marginBottom: 4,
    },
    productPrice: {
        ...TYPOGRAPHY.h3,
        color: COLORS.primaryLight,
        fontSize: 16,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    statusText: {
        ...TYPOGRAPHY.small,
        fontSize: 10,
        color: COLORS.textSecondary,
    },
});
