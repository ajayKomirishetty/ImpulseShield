import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertCircle, ShieldCheck } from 'lucide-react-native';
import Colors from '@/constants/colors';

// Types
interface SpendingScenario {
    merchant: string;
    amount: number;
    category: string;
    emoji: string;
}

interface ConfirmationScreenProps {
    scenario: SpendingScenario;
    onYes: () => void;
    onNo: () => void;
    shakeAnim: Animated.Value;
}

export default function ConfirmationScreen({
    scenario,
    onYes,
    onNo,
    shakeAnim,
}: ConfirmationScreenProps) {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.screenContainer, { transform: [{ translateX: shakeAnim }] }]}>
            <View style={styles.iconContainer}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <View style={[styles.warningIcon, { backgroundColor: '#FF6B6B20' }]}>
                        <AlertCircle size={56} color="#FF6B6B" strokeWidth={2.5} />
                    </View>
                </Animated.View>
            </View>

            <Text style={styles.mainTitle}>Are you sure?</Text>
            <Text style={styles.subtitle}>You're about to spend on</Text>

            <View style={styles.purchaseCard}>
                <Text style={styles.merchantEmoji}>{scenario.emoji}</Text>
                <View style={styles.purchaseInfo}>
                    <Text style={styles.merchantName}>{scenario.merchant}</Text>
                    <Text style={styles.category}>{scenario.category}</Text>
                </View>
                <Text style={styles.amount}>${scenario.amount.toFixed(2)}</Text>
            </View>

            <Text style={styles.warningText}>
                This could impact your financial goals...
            </Text>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.noButton} onPress={onNo}>
                    <LinearGradient
                        colors={[Colors.success, '#10B981']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.buttonGradient}
                    >
                        <ShieldCheck size={24} color={Colors.surface} />
                        <Text style={styles.buttonText}>No, Save It!</Text>
                    </LinearGradient>
                </Pressable>

                <Pressable style={styles.yesButton} onPress={onYes}>
                    <View style={styles.yesButtonInner}>
                        <Text style={styles.yesButtonText}>Yes, Spend</Text>
                    </View>
                </Pressable>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        padding: 24,
        alignItems: 'center',
        width: '100%',
    },
    iconContainer: {
        marginBottom: 20,
        alignItems: 'center',
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
    purchaseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 20,
        width: '100%',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    merchantEmoji: {
        fontSize: 32,
        marginRight: 16,
    },
    purchaseInfo: {
        flex: 1,
    },
    merchantName: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.text,
    },
    category: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    amount: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FF6B6B',
    },
    warningText: {
        fontSize: 14,
        color: Colors.warning,
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    noButton: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    yesButton: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: Colors.surface,
        borderWidth: 2,
        borderColor: '#FF6B6B',
    },
    yesButtonInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
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
    yesButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FF6B6B',
    },
});
