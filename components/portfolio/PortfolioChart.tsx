import React, { useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { formatCurrency } from '@/app/(tabs)/formatters'; // Temporary import path

interface ChartDataPoint {
    date: string;
    portfolioValue: number;
}

interface PortfolioChartProps {
    data: ChartDataPoint[];
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ data }) => {
    if (!data || data.length === 0) return null;

    const values = data.map(d => d.portfolioValue);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const range = maxVal - minVal;

    const chartHeight = 200;
    const chartWidth = Dimensions.get('window').width - 40; // Full width minus padding
    const paddingVertical = 20;

    const [scrubbing, setScrubbing] = useState(false);
    const [scrubPos, setScrubPos] = useState({ x: 0, y: 0 });
    const [scrubData, setScrubData] = useState<ChartDataPoint | null>(null);

    const points = useMemo(() => data.map((point, index) => {
        const x = (index / (data.length - 1)) * chartWidth;
        const normalizedValue = (point.portfolioValue - minVal) / (range || 1);
        const y = chartHeight - (normalizedValue * (chartHeight - paddingVertical * 2) + paddingVertical);
        return { x, y, date: point.date, value: point.portfolioValue };
    }), [data, minVal, range, chartHeight, paddingVertical, chartWidth]);

    const path = useMemo(() => points.reduce((acc: string, point: { x: number, y: number }, index: number) => {
        if (index === 0) return `M ${point.x},${point.y}`;
        // Curve smoothing could be added here (bezier)
        return `${acc} L ${point.x},${point.y}`;
    }, ''), [points]);

    const areaPath = useMemo(() => `${path} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`, [path, chartWidth, chartHeight]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                setScrubbing(true);
                handleTouch(evt.nativeEvent.locationX);
            },
            onPanResponderMove: (evt) => {
                handleTouch(evt.nativeEvent.locationX);
            },
            onPanResponderRelease: () => {
                setScrubbing(false);
                setScrubData(null);
            },
            onPanResponderTerminate: () => {
                setScrubbing(false);
                setScrubData(null);
            },
        })
    ).current;

    const handleTouch = (touchX: number) => {
        const x = Math.max(0, Math.min(touchX, chartWidth));
        let closestPoint = points[0];
        let minDist = Infinity;

        for (const point of points) {
            const dist = Math.abs(point.x - x);
            if (dist < minDist) {
                minDist = dist;
                closestPoint = point;
            }
        }

        setScrubPos({ x: closestPoint.x, y: closestPoint.y });
        setScrubData({ date: closestPoint.date, portfolioValue: closestPoint.value });
    };

    return (
        <Animated.View style={styles.container} entering={FadeIn.duration(800)}>
            <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Portfolio Performance</Text>
                <Text style={styles.chartHighLow}>
                    High: {formatCurrency(maxVal)}
                </Text>
            </View>

            <View style={styles.chartBody} {...panResponder.panHandlers}>
                <Svg height={chartHeight} width={chartWidth}>
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={Colors.secondary} stopOpacity="0.4" />
                            <Stop offset="1" stopColor={Colors.secondary} stopOpacity="0" />
                        </LinearGradient>
                    </Defs>
                    <Path d={areaPath} fill="url(#grad)" />
                    <Path d={path} fill="none" stroke={Colors.secondary} strokeWidth="3" />

                    {scrubbing && (
                        <>
                            <Path
                                d={`M ${scrubPos.x},0 L ${scrubPos.x},${chartHeight}`}
                                stroke={Colors.text}
                                strokeWidth="1"
                                strokeDasharray="4,4"
                                opacity={0.5}
                            />
                            <Circle cx={scrubPos.x} cy={scrubPos.y} r="6" fill={Colors.surface} stroke={Colors.secondary} strokeWidth="3" />
                        </>
                    )}
                </Svg>

                {scrubbing && scrubData && (
                    <View style={[styles.tooltip, { left: Math.min(scrubPos.x - 40, chartWidth - 100), top: 10 }]}>
                        <Text style={styles.tooltipValue}>{formatCurrency(scrubData.portfolioValue)}</Text>
                        <Text style={styles.tooltipDate}>{scrubData.date}</Text>
                    </View>
                )}
            </View>

            {/* X Axis Labels */}
            <View style={styles.xAxisLabels}>
                {points.filter((_, i) => i % 2 === 0).map((point, index) => (
                    <Text key={index} style={styles.xLabel}>{point.date.split(' ')[0]}</Text>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.gray800,
        borderRadius: 24,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        marginVertical: 12,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
    },
    chartHighLow: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    chartBody: {
        overflow: 'hidden',
    },
    tooltip: {
        position: 'absolute',
        backgroundColor: 'rgba(30, 30, 40, 0.95)',
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    tooltipValue: {
        fontWeight: '800',
        fontSize: 14,
        color: Colors.text,
    },
    tooltipDate: {
        fontSize: 10,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    xAxisLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingHorizontal: 4,
    },
    xLabel: {
        fontSize: 10,
        color: Colors.gray400,
        fontWeight: '600',
    },
});
