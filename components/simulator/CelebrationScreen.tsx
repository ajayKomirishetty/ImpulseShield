import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, PartyPopper, Award } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface SpendingScenario {
    merchant: string;
    amount: number;
    category: string;
    emoji: string;
}

interface CelebrationScreenProps {
    scenario: SpendingScenario;
    onClose: () => void;
    confettiAnim: Animated.Value;
    goal?: any;
}

export default function CelebrationScreen({
    scenario,
    onClose,
    confettiAnim,
    goal,
}: CelebrationScreenProps) {
    const floatAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(floatAnim, {
                        toValue: -10,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(floatAnim, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 4000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.screenContainer}>
            <Pressable style={styles.closeButton} onPress={onClose}>
                <X size={24} color={Colors.textSecondary} />
            </Pressable>

            {/* Animated confetti background */}
            <View style={styles.confettiContainer}>
                {[...Array(20)].map((_, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.confetti,
                            {
                                left: `${(i * 5) % 100}%`,
                                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF8E53'][i % 4],
                                opacity: confettiAnim,
                                transform: [
                                    {
                                        translateY: confettiAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-100, 600],
                                        }),
                                    },
                                    {
                                        rotate: confettiAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '720deg'],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />
                ))}
            </View>

            <Animated.View
                style={[
                    styles.iconContainer,
                    {
                        transform: [{ translateY: floatAnim }, { rotate }],
                    },
                ]}
            >
                <View style={[styles.warningIcon, { backgroundColor: '#10B98120' }]}>
                    <PartyPopper size={56} color="#10B981" strokeWidth={2.5} />
                </View>
            </Animated.View>

            <Text style={[styles.mainTitle, { color: Colors.success }]}>Amazing Choice!</Text>
            <Text style={styles.subtitle}>You just saved ${scenario.amount.toFixed(2)}</Text>

            <View style={styles.celebrationCard}>
                <LinearGradient
                    colors={['#10B98120', '#10B98105']}
                    style={styles.celebrationGradient}
                >
                    {/* Show goal progress if avail */}
                    {goal && (
                        <View style={{ marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' }}>
                            <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 4 }}>Contributed to:</Text>
                            <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.text }}>{goal.type === 'stock' ? goal.symbol : goal.title}</Text>
                            <Text style={{ fontSize: 13, color: Colors.success, fontWeight: '600' }}>+ ${scenario.amount.toFixed(0)} Closer to your dream!</Text>
                        </View>
                    )}

                    <View style={styles.savingsRow}>
                        <Award size={32} color="#10B981" />
                        <View style={styles.savingsInfo}>
                            <Text style={styles.savingsLabel}>Total Saved</Text>
                            <Text style={styles.savingsAmount}>${scenario.amount.toFixed(2)}</Text>
                        </View>
                    </View>

                    <View style={styles.benefitsList}>
                        <View style={styles.benefitItem}>
                            <Text style={styles.benefitIcon}>🎯</Text>
                            <Text style={styles.benefitText}>
                                Staying focused on your goals
                            </Text>
                        </View>
                        <View style={styles.benefitItem}>
                            <Text style={styles.benefitIcon}>💪</Text>
                            <Text style={styles.benefitText}>
                                Building financial discipline
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <View style={styles.motivationBox}>
                <Text style={styles.motivationText}>
                    "The secret to getting ahead is getting started. You're doing amazing!" 🌟
                </Text>
            </View>

            <Pressable style={styles.celebrateButton} onPress={onClose}>
                <LinearGradient
                    colors={[Colors.success, '#10B981']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                >
                    <Text style={styles.buttonText}>Keep It Up!</Text>
                </LinearGradient>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        padding: 24,
        alignItems: 'center',
        width: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        padding: 4,
    },
    iconContainer: {
        marginBottom: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    warningIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '500',
    },
    confettiContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
        pointerEvents: 'none',
    },
    confetti: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    celebrationCard: {
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
    },
    celebrationGradient: {
        padding: 24,
    },
    savingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
    },
    savingsInfo: {
        flex: 1,
    },
    savingsLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    savingsAmount: {
        fontSize: 32,
        fontWeight: '800',
        color: '#10B981',
    },
    benefitsList: {
        gap: 12,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    benefitIcon: {
        fontSize: 16,
    },
    benefitText: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '500',
    },
    motivationBox: {
        marginBottom: 24,
    },
    motivationText: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 24,
    },
    celebrateButton: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.surface,
    },
});
