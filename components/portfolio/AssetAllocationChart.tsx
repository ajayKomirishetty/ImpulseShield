import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Colors from '@/constants/colors';

interface AllocationItem {
    key: number;
    amount: number;
    color: string;
    label: string;
    percentage: number;
}

interface AssetAllocationChartProps {
    allocation: AllocationItem[];
}

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ allocation }) => {
    const size = 160;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let cumulativePercent = 0;

    const totalPercentage = allocation.reduce((sum, item) => sum + item.percentage, 0);

    return (
        <View style={styles.chartAllocationContainer}>
            <View style={styles.donutChartWrapper}>
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {allocation.map((item) => {
                        const dashoffset = circumference - (cumulativePercent / 100) * circumference;
                        const segmentLength = (item.percentage / 100) * circumference;
                        cumulativePercent += item.percentage;
                        return (
                            <Circle
                                key={item.key}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke={item.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${segmentLength} ${circumference}`}
                                strokeDashoffset={dashoffset}
                                strokeLinecap="round"
                                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                            />
                        );
                    })}
                </Svg>
                <View style={styles.donutChartCenter}>
                    <Text style={styles.donutChartCenterText}>{totalPercentage}%</Text>
                    <Text style={styles.donutChartCenterSubText}>Invested</Text>
                </View>
            </View>

            <View style={styles.legendContainer}>
                {allocation.map((item) => (
                    <View key={item.key} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                        <Text style={styles.legendText}>{item.label}</Text>
                        <Text style={styles.legendPercent}>{item.percentage}%</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    chartAllocationContainer: {
        padding: 20,
        backgroundColor: Colors.surface,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        marginBottom: 40,
    },
    donutChartWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    donutChartCenter: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    donutChartCenterText: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.text
    },
    donutChartCenterSubText: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    legendContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '45%', // Two columns
        paddingVertical: 4,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
        flex: 1,
    },
    legendPercent: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text,
    }
});
