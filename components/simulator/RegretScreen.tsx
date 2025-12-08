import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import { X, Target, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';

// Types
interface SpendingScenario {
    merchant: string;
    amount: number;
    category: string;
    emoji: string;
}

interface RegretScreenProps {
    scenario: SpendingScenario;
    goalImpacts: any[];
    onClose: () => void;
    slideAnim: Animated.Value;
}

export default function RegretScreen({
    scenario,
    goalImpacts,
    onClose,
    slideAnim,
}: RegretScreenProps) {
    return (
        <Animated.View
            style={[
                styles.screenContainer,
                {
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <Pressable style={styles.closeButton} onPress={onClose}>
                <X size={24} color={Colors.textSecondary} />
            </Pressable>

            <View style={styles.iconContainer}>
                <View style={[styles.warningIcon, { backgroundColor: '#EF444420' }]}>
                    <Text style={styles.sadEmoji}>😔</Text>
                </View>
            </View>

            <Text style={styles.mainTitle}>You Spent ${scenario.amount.toFixed(2)}</Text>
            <Text style={styles.subtitle}>Here's what it cost you...</Text>

            <ScrollView style={styles.impactList} showsVerticalScrollIndicator={false}>
                {goalImpacts.map((impact) => (
                    <View key={impact.goal.id} style={styles.impactCard}>
                        <View style={styles.impactHeader}>
                            <Text style={styles.impactEmoji}>🎯</Text>
                            <View style={styles.impactInfo}>
                                <Text style={styles.impactGoalName}>{impact.goal.title}</Text>
                                <Text style={styles.impactDescription}>
                                    You needed ${scenario.amount.toFixed(2)} to reach this goal
                                </Text>
                            </View>
                        </View>

                        <View style={styles.impactStats}>
                            <View style={styles.impactStat}>
                                <Target size={20} color="#EF4444" />
                                <Text style={styles.impactStatText}>
                                    {impact.percentageOfGoal.toFixed(1)}% of goal
                                </Text>
                            </View>
                            <View style={styles.impactStat}>
                                <TrendingUp size={20} color="#EF4444" />
                                <Text style={styles.impactStatText}>
                                    ~{impact.daysDelayed} days delayed
                                </Text>
                            </View>
                        </View>

                        <View style={styles.contributionBox}>
                            <Text style={styles.contributionLabel}>Should have contributed:</Text>
                            <Text style={styles.contributionAmount}>
                                ${(scenario.amount / goalImpacts.length).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                ))}

                <View style={styles.regretMessage}>
                    <Text style={styles.regretMessageText}>
                        💡 Next time, think about your future self! Every dollar counts toward your dreams.
                    </Text>
                </View>
            </ScrollView>

            <Pressable style={styles.closeActionButton} onPress={onClose}>
                <Text style={styles.closeActionText}>I'll Do Better Next Time</Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        padding: 24,
        alignItems: 'center',
        width: '100%',
        flex: 1, // Ensure it takes full height in the modal
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
    },
    warningIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sadEmoji: {
        fontSize: 48,
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
    impactList: {
        width: '100%',
        maxHeight: 300,
    },
    impactCard: {
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#EF4444',
    },
    impactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    impactEmoji: {
        fontSize: 24,
        marginRight: 12,
    },
    impactInfo: {
        flex: 1,
    },
    impactGoalName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
    },
    impactDescription: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    impactStats: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },
    impactStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    impactStatText: {
        fontSize: 13,
        color: Colors.text,
        fontWeight: '500',
    },
    contributionBox: {
        backgroundColor: '#EF444410',
        padding: 12,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contributionLabel: {
        fontSize: 12,
        color: '#EF4444',
        fontWeight: '600',
    },
    contributionAmount: {
        fontSize: 14,
        fontWeight: '800',
        color: '#EF4444',
    },
    regretMessage: {
        marginTop: 12,
        padding: 16,
        backgroundColor: Colors.background,
        borderRadius: 12,
    },
    regretMessageText: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 20,
    },
    closeActionButton: {
        marginTop: 20,
        paddingVertical: 12,
    },
    closeActionText: {
        fontSize: 15,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
});
