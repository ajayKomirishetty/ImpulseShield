import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface SpendingScenario {
    merchant: string;
    amount: number;
    category: string;
    emoji: string;
}

interface InvestmentExplainerScreenProps {
    scenario: SpendingScenario;
    goal: any;
    onInvest: () => void;
    onClose: () => void;
}

export default function InvestmentExplainerScreen({
    scenario,
    goal,
    onInvest,
    onClose,
}: InvestmentExplainerScreenProps) {
    const isStock = goal.type === 'stock';

    // If it's a generic goal, we want to show it as "Contribute to Goal"
    const ticker = isStock ? goal.symbol : 'GOAL';
    const name = isStock ? goal.name : goal.title;

    // For goals, we might assume a conservative growth rate if it's invested, 
    // or just show the savings impact. Let's keep the growth projection but make it clear.
    // We'll use the time horizon to guess a rate, but not change the name to 'VTI' etc.
    const returnRate = isStock ? 0.15 : (goal.timeHorizon === 'short' ? 0.045 : 0.07);

    const years = 10;
    const futureValue = scenario.amount * Math.pow((1 + returnRate), years);
    const profit = futureValue - scenario.amount;

    // Animation
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            <ScrollView
                contentContainerStyle={styles.screenContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerRow}>
                    <Text style={styles.mainTitle}>Simulate Growth 📈</Text>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <X size={24} color={Colors.textSecondary} />
                    </Pressable>
                </View>

                <Text style={styles.subtitle}>
                    By saving <Text style={{ fontWeight: 'bold', color: Colors.success }}>${scenario.amount.toFixed(2)}</Text> into <Text style={{ fontWeight: 'bold' }}>{isStock ? goal.symbol : goal.title}</Text>...
                </Text>

                <View style={styles.recommendationCard}>
                    <View style={styles.recHeader}>
                        <View style={styles.tickerBadge}>
                            <Text style={styles.tickerText}>{ticker}</Text>
                        </View>
                        <Text style={styles.recName}>{name}</Text>
                    </View>

                    <View style={styles.projectionBox}>
                        <View style={styles.projectionRow}>
                            <Text style={styles.projectionLabel}>Spend Now:</Text>
                            <Text style={styles.projectionValueBad}>$0.00</Text>
                        </View>
                        <View style={[styles.projectionRow, { marginTop: 8 }]}>
                            <Text style={styles.projectionLabel}>In 10 Years:</Text>
                            <Text style={styles.projectionValueGood}>${futureValue.toFixed(2)}</Text>
                        </View>
                        <View style={styles.growthBarContainer}>
                            <View style={[styles.growthBar, { width: '10%' }]} />
                            <View style={[styles.growthBarFuture, { width: '90%' }]} />
                        </View>
                        <Text style={styles.growthSubtext}>
                            potential <Text style={{ color: Colors.success, fontWeight: 'bold' }}>${profit.toFixed(2)}</Text> profit from {isStock ? goal.symbol : "compound interest"}!
                        </Text>
                    </View>
                </View>

                <Pressable style={styles.investNowButton} onPress={onInvest}>
                    <LinearGradient
                        colors={Colors.gradients.ocean as any}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Confirm & Save</Text>
                        <ArrowRight size={20} color='white' />
                    </LinearGradient>
                </Pressable>
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        padding: 24,
        paddingTop: 32,
        alignItems: 'center', // Now safely in contentContainerStyle
    },
    headerRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: Colors.text,
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: Colors.surface,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    recommendationCard: {
        width: '100%',
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },
    recHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    tickerBadge: {
        backgroundColor: Colors.background,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        marginRight: 12,
    },
    tickerText: {
        fontSize: 14,
        fontWeight: '800',
        color: Colors.text,
    },
    recName: {
        fontSize: 16,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    projectionBox: {
        backgroundColor: Colors.background,
        borderRadius: 16,
        padding: 16,
    },
    projectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    projectionLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    projectionValueBad: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textSecondary,
        textDecorationLine: 'line-through',
    },
    projectionValueGood: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.success,
    },
    growthBarContainer: {
        height: 8,
        backgroundColor: Colors.surface,
        borderRadius: 4,
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 12,
        overflow: 'hidden',
    },
    growthBar: {
        height: '100%',
        backgroundColor: Colors.textSecondary,
        opacity: 0.3,
    },
    growthBarFuture: {
        height: '100%',
        backgroundColor: Colors.success,
    },
    growthSubtext: {
        fontSize: 12,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    investNowButton: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 40,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonGradient: {
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
});
