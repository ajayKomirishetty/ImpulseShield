import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, FlatList, ActivityIndicator, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

interface StockSearchModalProps {
    visible: boolean;
    onClose: () => void;
}

const MOCK_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.23, change: 1.25 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 334.56, change: 0.89 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 136.78, change: -0.45 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.67, change: 2.34 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 467.89, change: 4.56 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 256.78, change: -1.23 },
    { symbol: 'META', name: 'Meta Platforms', price: 312.45, change: 0.67 },
    { symbol: 'BRK.B', name: 'Berkshire Hathaway', price: 356.78, change: 0.12 },
    { symbol: 'LLY', name: 'Eli Lilly & Co.', price: 567.89, change: 1.45 },
    { symbol: 'V', name: 'Visa Inc.', price: 245.67, change: 0.56 },
];

export default function StockSearchModal({ visible, onClose }: StockSearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(MOCK_STOCKS);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.trim() === '') {
            setResults(MOCK_STOCKS);
        } else {
            setLoading(true);
            // Simulate network delay
            const timer = setTimeout(() => {
                const filtered = MOCK_STOCKS.filter(
                    s => s.symbol.includes(query.toUpperCase()) || s.name.toLowerCase().includes(query.toLowerCase())
                );
                setResults(filtered);
                setLoading(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [query]);

    const handleSelectStock = (ticker: string) => {
        onClose();
        // Navigate to Stock Details
        router.push(`/stock/${ticker}`);
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <BlurView intensity={20} style={styles.container}>
                <Pressable style={styles.overlay} onPress={onClose} />

                <Animated.View entering={FadeInUp.springify()} exiting={FadeOutDown} style={styles.modalContent}>
                    <View style={styles.header}>
                        <View style={styles.searchBar}>
                            <Search size={20} color={Colors.textSecondary} />
                            <TextInput
                                style={styles.input}
                                placeholder="Search stocks (e.g. AAPL)"
                                placeholderTextColor={Colors.gray500}
                                value={query}
                                onChangeText={setQuery}
                                autoFocus
                            />
                            {query.length > 0 && (
                                <Pressable onPress={() => setQuery('')}>
                                    <X size={18} color={Colors.gray400} />
                                </Pressable>
                            )}
                        </View>
                        <Pressable onPress={onClose} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                    </View>

                    <View style={styles.resultsContainer}>
                        {loading ? (
                            <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 20 }} />
                        ) : (
                            <FlatList
                                data={results}
                                keyExtractor={item => item.symbol}
                                keyboardShouldPersistTaps="handled"
                                renderItem={({ item }) => (
                                    <Pressable
                                        style={({ pressed }) => [styles.resultItem, pressed && styles.resultItemPressed]}
                                        onPress={() => handleSelectStock(item.symbol)}
                                    >
                                        <View style={styles.stockInfo}>
                                            <Text style={styles.stockSymbol}>{item.symbol}</Text>
                                            <Text style={styles.stockName}>{item.name}</Text>
                                        </View>
                                        <View style={styles.priceInfo}>
                                            <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
                                            <View style={[styles.changeBadge, { backgroundColor: item.change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                                                {item.change >= 0 ? <TrendingUp size={12} color={Colors.success} /> : <TrendingDown size={12} color={Colors.error} />}
                                                <Text style={[styles.changeText, { color: item.change >= 0 ? Colors.success : Colors.error }]}>
                                                    {item.change.toFixed(2)}%
                                                </Text>
                                            </View>
                                        </View>
                                    </Pressable>
                                )}
                                ListEmptyComponent={
                                    <View style={styles.emptyState}>
                                        <Text style={styles.emptyText}>No stocks found</Text>
                                    </View>
                                }
                            />
                        )}
                    </View>
                </Animated.View>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        backgroundColor: Colors.background,
        marginTop: 60,
        marginHorizontal: 16,
        borderRadius: 24,
        height: '70%',
        shadowColor: Colors.shadowStrong,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
    },
    cancelButton: {
        paddingVertical: 8,
    },
    cancelText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    resultsContainer: {
        flex: 1,
    },
    resultItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    resultItemPressed: {
        backgroundColor: Colors.backgroundSecondary,
    },
    stockInfo: {
        gap: 4,
    },
    stockSymbol: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.text,
    },
    stockName: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    priceInfo: {
        alignItems: 'flex-end',
        gap: 4,
    },
    priceText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 4,
    },
    changeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: Colors.textSecondary,
        fontSize: 16,
    }
});
