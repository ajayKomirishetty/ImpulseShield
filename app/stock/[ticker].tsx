import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Pressable } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Star, Share2, Bell } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { PortfolioChart } from '@/components/portfolio/PortfolioChart';
import { formatCurrency, formatChange } from '../(tabs)/formatters';

// Mock Data Generators
const generateStockData = (ticker: string) => {
    const basePrice = Math.random() * 200 + 50;
    const isPositive = Math.random() > 0.4;
    const changePercent = (Math.random() * 5) * (isPositive ? 1 : -1);

    return {
        ticker: ticker.toUpperCase(),
        name: `${ticker.toUpperCase()} Corp.`,
        price: basePrice,
        change: basePrice * (changePercent / 100),
        changePercent: changePercent,
        marketCap: '2.4T',
        peRatio: '32.5',
        dividendYield: '0.45%',
        volume: '54.2M',
        high52: basePrice * 1.2,
        low52: basePrice * 0.8,
        description: `This is a simulated description for ${ticker.toUpperCase()}. It is a leading technology company known for innovation and solid financial performance. Analysts recently upgraded the stock due to strong earnings growth.`,
        analystRating: 'Strong Buy',
        analystTarget: basePrice * 1.15,
    };
};

const generateChartData = (basePrice: number) => {
    const points = [];
    let price = basePrice * 0.9;
    for (let i = 0; i < 30; i++) {
        price = price * (1 + (Math.random() * 0.04 - 0.02));
        points.push({
            date: `Day ${i + 1}`,
            portfolioValue: price
        });
    }
    return points;
};

export default function StockDetailsScreen() {
    const { ticker } = useLocalSearchParams();
    const stockTicker = typeof ticker === 'string' ? ticker : 'STOCK';
    const stock = generateStockData(stockTicker);
    const chartData = generateChartData(stock.price);

    const isPositive = stock.change >= 0;
    const color = isPositive ? Colors.success : Colors.error;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <LinearGradient
                colors={[Colors.backgroundDark, Colors.gray900]}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.header}>
                        <Pressable onPress={() => router.back()} style={styles.iconButton}>
                            <ArrowLeft size={24} color={Colors.text} />
                        </Pressable>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>{stock.ticker}</Text>
                            <Text style={styles.headerSubtitle}>{stock.name}</Text>
                        </View>
                        <View style={styles.headerActions}>
                            <Pressable style={styles.iconButton}>
                                <Bell size={22} color={Colors.text} />
                            </Pressable>
                            <Pressable style={styles.iconButton}>
                                <Share2 size={22} color={Colors.text} />
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.priceSection}>
                    <Text style={styles.currentPrice}>{formatCurrency(stock.price)}</Text>
                    <View style={[styles.changeBadge, { backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }]}>
                        {isPositive ? <TrendingUp size={16} color={color} /> : <TrendingDown size={16} color={color} />}
                        <Text style={[styles.changeText, { color }]}>
                            {formatCurrency(Math.abs(stock.change))} ({Math.abs(stock.changePercent).toFixed(2)}%)
                        </Text>
                        <Text style={styles.timeText}>Today</Text>
                    </View>
                </Animated.View>

                {/* Chart */}
                <View style={styles.chartContainer}>
                    <PortfolioChart data={chartData} />
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                    <Pressable style={[styles.actionButton, { backgroundColor: Colors.primary }]}>
                        <Text style={styles.actionButtonText}>Buy</Text>
                    </Pressable>
                    <Pressable style={[styles.actionButton, { backgroundColor: Colors.gray700 }]}>
                        <Text style={styles.actionButtonText}>Sell</Text>
                    </Pressable>
                </View>

                {/* Stats Grid */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsContainer}>
                    <Text style={styles.sectionTitle}>Key Statistics</Text>
                    <View style={styles.statsGrid}>
                        <StatItem label="Market Cap" value={stock.marketCap} icon={<BarChart3 size={18} color={Colors.secondary} />} />
                        <StatItem label="Vol" value={stock.volume} icon={<Activity size={18} color={Colors.secondary} />} />
                        <StatItem label="P/E Ratio" value={stock.peRatio} icon={<DollarSign size={18} color={Colors.secondary} />} />
                        <StatItem label="Div. Yield" value={stock.dividendYield} icon={<Star size={18} color={Colors.secondary} />} />
                        <StatItem label="52W High" value={formatCurrency(stock.high52)} />
                        <StatItem label="52W Low" value={formatCurrency(stock.low52)} />
                    </View>
                </Animated.View>

                {/* Analyst Ratings */}
                <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.analystSection}>
                    <Text style={styles.sectionTitle}>Analyst Rating</Text>
                    <View style={styles.ratingCard}>
                        <View style={styles.ratingHeader}>
                            <Text style={styles.ratingLabel}>Consensus</Text>
                            <Text style={[styles.ratingValue, { color: Colors.success }]}>{stock.analystRating}</Text>
                        </View>
                        <View style={styles.ratingBarData}>
                            <View style={[styles.ratingBar, { width: '80%', backgroundColor: Colors.success }]} />
                            <View style={[styles.ratingBar, { width: '15%', backgroundColor: Colors.warning }]} />
                            <View style={[styles.ratingBar, { width: '5%', backgroundColor: Colors.error }]} />
                        </View>
                        <View style={styles.targetPriceRow}>
                            <Text style={styles.targetLabel}>Avg. Price Target</Text>
                            <Text style={styles.targetValue}>{formatCurrency(stock.analystTarget)}</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* About */}
                <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.aboutSection}>
                    <Text style={styles.sectionTitle}>About {stock.ticker}</Text>
                    <Text style={styles.aboutText}>{stock.description}</Text>
                </Animated.View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const StatItem = ({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) => (
    <View style={styles.statItem}>
        <View style={styles.statLabelRow}>
            {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
            <Text style={styles.statLabel}>{label}</Text>
        </View>
        <Text style={styles.statValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerGradient: {
        paddingBottom: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.text,
    },
    headerSubtitle: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
    },
    content: {
        flex: 1,
    },
    priceSection: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 16,
    },
    currentPrice: {
        fontSize: 48,
        fontWeight: '900',
        color: Colors.text,
        letterSpacing: -1,
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8,
        gap: 6,
    },
    changeText: {
        fontSize: 16,
        fontWeight: '700',
    },
    timeText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
        marginLeft: 4,
    },
    chartContainer: {
        paddingHorizontal: 16,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 16,
        marginVertical: 24,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.surface,
    },
    statsContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statItem: {
        width: '48%',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        gap: 8,
    },
    statLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    analystSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    ratingCard: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 20,
    },
    ratingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    ratingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    ratingValue: {
        fontSize: 18,
        fontWeight: '800',
    },
    ratingBarData: {
        flexDirection: 'row',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 16,
    },
    ratingBar: {
        height: '100%',
    },
    targetPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: 12,
    },
    targetLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    targetValue: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text,
    },
    aboutSection: {
        paddingHorizontal: 20,
    },
    aboutText: {
        fontSize: 16,
        color: Colors.textSecondary,
        lineHeight: 24,
    }
});
