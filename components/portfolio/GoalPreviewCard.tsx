import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ArrowRight } from "lucide-react-native";
import { router } from "expo-router";
import Colors from '@/constants/colors';
import { Goal } from '@/stores/RootStore';
import { formatCurrency, getHorizonColor } from '@/app/(tabs)/formatters';

interface GoalPreviewCardProps {
    goal: Goal;
}

export const GoalPreviewCard: React.FC<GoalPreviewCardProps> = ({ goal }) => {
    const scale = useSharedValue(1);
    const progress = goal.currentAmount / goal.targetAmount;
    const progressColor = getHorizonColor(goal.timeHorizon);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: withTiming(scale.value, { duration: 150 }) }],
        };
    });

    const handlePress = () => router.navigate('/goals');

    return (
        <Animated.View style={[styles.goalCardWrapper, animatedStyle]}>
            <Pressable
                onPress={handlePress}
                onPressIn={() => (scale.value = 0.98)}
                onPressOut={() => (scale.value = 1)}
                style={({ pressed }) => [
                    styles.goalCard,
                    pressed && { opacity: 0.95 }
                ]}
            >
                <View style={styles.goalHeader}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={[styles.currentProgress, { color: progressColor, fontWeight: '800' }]}>
                        {Math.round(progress * 100)}% Funded
                    </Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: progressColor }]} />
                </View>

                {/* Fund Value */}
                <View style={styles.progressDetails}>
                    <Text style={styles.currentFundValue}>{formatCurrency(goal.currentAmount)}</Text>
                    <ArrowRight size={20} color={progressColor} />
                </View>
                <Text style={styles.actionLabel}>View & Contribute</Text>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    goalCardWrapper: {
        borderRadius: 16,
        backgroundColor: Colors.surface,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    goalCard: {
        padding: 20,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    goalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    currentProgress: {
        fontSize: 15,
    },
    progressDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 8,
        marginTop: 10,
    },
    currentFundValue: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.primary,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: Colors.borderLight,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.secondary,
        textAlign: 'right',
        marginTop: 5,
    }
});
