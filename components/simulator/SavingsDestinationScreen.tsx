import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowRight, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Image } from 'expo-image';

interface SavingsDestinationScreenProps {
    goals: any[];
    onSelect: (item: any) => void;
    onClose: () => void;
}

const HOT_STOCKS = [
    { id: 'stk_1', type: 'stock', symbol: 'NVDA', name: 'NVIDIA Corp', returnYTD: '+214%', price: 135.50, color: '#76B900' },
    { id: 'stk_2', type: 'stock', symbol: 'AAPL', name: 'Apple Inc', returnYTD: '+32%', price: 215.30, color: '#A2AAAD' },
    { id: 'stk_3', type: 'stock', symbol: 'VOO', name: 'Vanguard S&P 500', returnYTD: '+12%', price: 480.20, color: '#BF0F34' },
];

const getHorizonColor = (horizon: 'short' | 'medium' | 'long' | undefined) => {
    switch (horizon) {
        case 'short': return Colors.success;
        case 'medium': return Colors.warning;
        case 'long': return Colors.primary;
        default: return Colors.primary;
    }
};

export default function SavingsDestinationScreen({ goals, onSelect, onClose }: SavingsDestinationScreenProps) {
    // Entrance animation
    const slideAnim = useRef(new Animated.Value(50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.screenContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.mainTitle}>Make Money 💸</Text>
                    <Text style={styles.subtitle}>Where should we put this cash?</Text>
                </View>
                <Pressable onPress={onClose} style={styles.closeButton}>
                    <X size={24} color={Colors.textSecondary} />
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* SECTION 1: GOALS */}
                <Text style={styles.sectionTitle}>Boost Your Goals 🚀</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }} style={{ marginBottom: 24, paddingBottom: 10 }}>
                    {goals.map((goal) => (
                        <Pressable
                            key={goal.id}
                            style={styles.goalCardHorizontal}
                            onPress={() => onSelect({ ...goal, type: 'goal' })}
                        >
                            <Image source={{ uri: goal.imageUrl }} style={styles.goalThumbHorizontal} contentFit="cover" />
                            <View style={styles.goalCardContent}>
                                <Text style={styles.goalTitleHorizontal} numberOfLines={1}>{goal.title}</Text>
                                <View style={styles.progressBarGeneric}>
                                    <View style={[styles.progressFillGeneric, { width: `${(goal.currentAmount / goal.targetAmount) * 100}%`, backgroundColor: getHorizonColor(goal.timeHorizon) }]} />
                                </View>
                                <Text style={styles.goalStatsHorizontal}>${goal.currentAmount} / ${goal.targetAmount}</Text>
                            </View>
                        </Pressable>
                    ))}
                    {/* Add New Goal Placeholder */}
                    <Pressable style={[styles.goalCardHorizontal, { justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: Colors.gray300 }]}>
                        <Text style={{ fontSize: 24, color: Colors.textSecondary }}>+</Text>
                        <Text style={{ fontSize: 12, color: Colors.textSecondary, fontWeight: '600', marginTop: 4 }}>New Goal</Text>
                    </Pressable>
                </ScrollView>

                {/* SECTION 2: HOT STOCKS */}
                <Text style={styles.sectionTitle}>Buy Hot Assets 🔥</Text>
                {HOT_STOCKS.map((stock) => (
                    <Pressable
                        key={stock.id}
                        style={styles.stockCard}
                        onPress={() => onSelect(stock)}
                    >
                        <View style={[styles.stockBadge, { backgroundColor: stock.color + '20' }]}>
                            <Text style={[styles.stockSymbol, { color: stock.color }]}>{stock.symbol}</Text>
                        </View>
                        <View style={styles.stockInfo}>
                            <Text style={styles.stockName}>{stock.name}</Text>
                            <Text style={styles.stockPrice}>${stock.price.toFixed(2)}</Text>
                        </View>
                        <View style={styles.stockReturnBadge}>
                            <TrendingUp size={14} color={Colors.success} />
                            <Text style={styles.stockReturnText}>{stock.returnYTD}</Text>
                        </View>
                        <ArrowRight size={20} color={Colors.gray400} />
                    </Pressable>
                ))}
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        padding: 24,
        flex: 1,
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 16,
        marginLeft: 4,
    },
    goalCardHorizontal: {
        width: 200,
        backgroundColor: Colors.surface,
        borderRadius: 20,
        overflow: 'hidden',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        height: 160,
    },
    goalThumbHorizontal: {
        width: '100%',
        height: 90,
    },
    goalCardContent: {
        padding: 12,
    },
    goalTitleHorizontal: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
    },
    progressBarGeneric: {
        height: 6,
        backgroundColor: Colors.background,
        borderRadius: 3,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressFillGeneric: {
        height: '100%',
        borderRadius: 3,
    },
    goalStatsHorizontal: {
        fontSize: 11,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    stockCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    stockBadge: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    stockSymbol: {
        fontSize: 13,
        fontWeight: '800',
    },
    stockInfo: {
        flex: 1,
    },
    stockName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
    },
    stockPrice: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    stockReturnBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B98115',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
        marginRight: 12,
    },
    stockReturnText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.success,
    },
});
