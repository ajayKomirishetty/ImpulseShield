
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react-native";
import Colors from '@/constants/colors';
import { router } from 'expo-router';
import { Investment } from '@/stores/RootStore';
import { formatCurrency, formatChange } from '@/app/(tabs)/formatters';

interface InvestmentItemProps {
    item: Investment;
    index: number;
}

export const InvestmentItem: React.FC<InvestmentItemProps> = ({ item, index }) => {
    const scale = useSharedValue(0.9);
    const opacity = useSharedValue(0);
    const color = item.isPositive ? Colors.success : Colors.error;
    const Icon = item.isPositive ? TrendingUp : TrendingDown;

    useEffect(() => {
        opacity.value = withDelay(index * 100, withTiming(1, { duration: 400 }));
        scale.value = withDelay(index * 100, withTiming(1, { duration: 400 }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }],
        };
    });

    const handlePress = () => {
        router.push(`/stock/${item.ticker}`);
    };

    return (
        <Animated.View style={[styles.itemContainerWrapper, animatedStyle]}>
            <Pressable
                onPress={handlePress}
                style={({ pressed }) => [
                    styles.itemContainer,
                    pressed && { backgroundColor: Colors.backgroundSecondary }
                ]}
            >
                <View style={styles.infoLeft}>
                    <Animated.View style={[styles.iconWrapper, { backgroundColor: `${color}15` }]}>
                        <DollarSign size={20} color={color} />
                    </Animated.View>
                    <View>
                        <Text style={styles.name}>{item.ticker}</Text>
                        <Text style={styles.fullName}>{item.name}</Text>
                    </View>
                </View>
                <View style={styles.infoRight}>
                    <Text style={styles.value}>{formatCurrency(item.value)}</Text>
                    <View style={styles.changeContainer}>
                        <Icon size={14} color={color} />
                        <Text style={[styles.changeText, { color }]}>
                            {formatChange(item.gainPercent)}%
                        </Text>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    itemContainerWrapper: {
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: Colors.surface,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 2,
    },
    fullName: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    infoRight: {
        alignItems: 'flex-end',
    },
    value: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 2,
        paddingHorizontal: 6,
        backgroundColor: 'rgba(0,0,0,0.03)',
        gap: 4,
    },
    changeText: {
        fontSize: 12,
        fontWeight: '700',
    }
});
