import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { DollarSign, TrendingUp, Target, Activity, Zap, ArrowRight, Shield, TrendingDown } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useState } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn, FadeOut } from 'react-native-reanimated';
import { router } from "expo-router"; 
// import { useMobxStore } from "@/providers/MobxProvider"; // Conceptual MobX hook

// --- MOCK DATA STRUCTURES (Simulating MobX Global State) ---
// These structures must match the data in your GoalStore.ts

interface Investment {
  name: string;
  ticker: string;
  value: number;
  changePercent: number;
  isPositive: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  currentAmount: number;
  timeHorizon: 'short' | 'medium' | 'long';
}

const MOCK_PORTFOLIO: Investment[] = [
  { name: 'Total Market ETF (VTI)', ticker: 'VTI', value: 15430.50, changePercent: 1.25, isPositive: true },
  { name: 'S&P 500 Fund (VOO)', ticker: 'VOO', value: 24500.80, changePercent: -0.45, isPositive: false },
  { name: 'International Bonds (BNDX)', ticker: 'BNDX', value: 5000.00, changePercent: 0.02, isPositive: true },
  { name: 'Technology Sector (QQQ)', ticker: 'QQQ', value: 12100.20, changePercent: 2.15, isPositive: true },
];

const MOCK_GOALS: Goal[] = [
    { id: 'g1', title: 'New Home Down Payment', description: 'Saving for a bigger place.', imageUrl: 'URL1', targetAmount: 50000, currentAmount: 35000, timeHorizon: 'medium' },
    { id: 'g2', title: 'Dream Car Fund', description: 'Putting aside money monthly.', imageUrl: 'URL2', targetAmount: 15000, currentAmount: 8000, timeHorizon: 'short' },
    { id: 'g3', title: 'Retirement Freedom', description: 'Long-term investment.', imageUrl: 'URL3', targetAmount: 1000000, currentAmount: 450000, timeHorizon: 'long' },
];

const MOCK_CHART_DATA = [
    { value: 10000, label: 'Mon' },
    { value: 10200, label: 'Tue' },
    { value: 10150, label: 'Wed' },
    { value: 10300, label: 'Thu' },
    { value: 10550, label: 'Fri' },
    { value: 10400, label: 'Sat' },
    { value: 10700, label: 'Sun' },
];

const MOCK_ALLOCATION_DATA = [
    { key: 1, amount: 15430.50, color: Colors.purple, label: 'VTI' },
    { key: 2, amount: 24500.80, color: Colors.pink, label: 'VOO' },
    { key: 3, amount: 5000.00, color: Colors.teal, label: 'BNDX' },
    { key: 4, amount: 12100.20, color: Colors.orange, label: 'QQQ' },
];

// --- UTILITY FUNCTIONS ---
const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
const formatChange = (amount: number) => `${amount >= 0 ? '+' : ''}${amount.toFixed(2)}`;
const getHorizonColor = (horizon: string) => {
    switch (horizon) {
      case 'short': return Colors.accent;
      case 'medium': return Colors.secondary;
      case 'long': return Colors.purple;
      default: return Colors.textSecondary;
    }
};

// --- SUB-COMPONENTS ---

/**
 * Goal Preview Card (Read-Only)
 */
const GoalPreviewCard: React.FC<{ goal: Goal }> = ({ goal }) => {
    const scale = useSharedValue(1);
    const progress = goal.currentAmount / goal.targetAmount;
    const progressColor = getHorizonColor(goal.timeHorizon);
    
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: withTiming(scale.value, { duration: 150 }) }],
        };
    });
    
    // Navigate to the Goals tab on press
    const handlePress = () => router.navigate('/goals'); 

    return (
        <Animated.View style={[goalStyles.goalCardWrapper, animatedStyle]}>
            <Pressable
                onPress={handlePress} 
                onPressIn={() => (scale.value = 0.98)}
                onPressOut={() => (scale.value = 1)}
                style={({ pressed }) => [
                    goalStyles.goalCard,
                    pressed && { opacity: 0.95 }
                ]}
            >
                <View style={goalStyles.goalHeader}>
                    <Text style={goalStyles.goalTitle}>{goal.title}</Text>
                    <Text style={[goalStyles.currentProgress, { color: progressColor, fontWeight: '800' }]}>
                        {Math.round(progress * 100)}% Funded
                    </Text>
                </View>

                {/* Progress Bar */}
                <View style={goalStyles.progressBarContainer}>
                    <View style={[goalStyles.progressBar, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: progressColor }]} />
                </View>

                {/* Fund Value */}
                <View style={goalStyles.progressDetails}>
                    <Text style={goalStyles.currentFundValue}>{formatCurrency(goal.currentAmount)}</Text>
                    <ArrowRight size={20} color={progressColor} />
                </View>
                <Text style={goalStyles.actionLabel}>View & Contribute</Text>
            </Pressable>
        </Animated.View>
    );
};


/**
 * Investment Item Component 
 */
const InvestmentItem: React.FC<{ item: Investment }> = ({ item }) => {
    const color = item.isPositive ? Colors.success : Colors.error;
    const Icon = item.isPositive ? TrendingUp : TrendingDown;
    
    return (
        <View style={investStyles.itemContainer}>
            <View style={investStyles.infoLeft}>
                <View style={[investStyles.iconWrapper, {backgroundColor: `${color}20`}]}>
                    <DollarSign size={20} color={color} />
                </View>
                <View>
                    <Text style={investStyles.name}>{item.ticker}</Text>
                    <Text style={investStyles.fullName}>{item.name}</Text>
                </View>
            </View>
            <View style={investStyles.infoRight}>
                <Text style={investStyles.value}>{formatCurrency(item.value)}</Text>
                <View style={investStyles.changeContainer}>
                    <Icon size={14} color={color} />
                    <Text style={[investStyles.changeText, { color }]}>
                        {formatChange(item.changePercent)}%
                    </Text>
                </View>
            </View>
        </View>
    );
};

/**
 * Mock Line/Area Chart Component 
 */
const MockLineChart = () => {
    const maxVal = Math.max(...MOCK_CHART_DATA.map(d => d.value));
    const minVal = Math.min(...MOCK_CHART_DATA.map(d => d.value));
    const range = maxVal - minVal;

    return (
        <View style={mockChartStyles.chartContainer}>
            <View style={mockChartStyles.yAxis}>
                <Text style={mockChartStyles.yLabel}>{formatCurrency(maxVal)}</Text>
                <Text style={mockChartStyles.yLabel}>{formatCurrency(minVal)}</Text>
            </View>
            <View style={mockChartStyles.dataArea}>
                {MOCK_CHART_DATA.map((point, index) => {
                    // Normalize the value to a 0-1 range based on the min/max
                    const normalizedHeight = range === 0 ? 50 : ((point.value - minVal) / range) * 80 + 20;
                    
                    return (
                        <View key={index} style={mockChartStyles.barWrapper}>
                            <View 
                                style={[
                                    mockChartStyles.bar, 
                                    { 
                                        height: `${normalizedHeight}%`, 
                                        backgroundColor: Colors.secondary // Consistent chart color
                                    }
                                ]} 
                            />
                            <Text style={mockChartStyles.xLabel}>{point.label}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};


// --- MAIN SCREEN COMPONENT ---

export default function PortfolioScreen() {
  // Simulate fetching data from the global MobX store
  const portfolio = MOCK_PORTFOLIO; 
  const goals = MOCK_GOALS;
  const allocation = MOCK_ALLOCATION_DATA;

  const totalPortfolioValue = portfolio.reduce((sum, i) => sum + i.value, 0);
  const totalChangeToday = portfolio.reduce((sum, i) => sum + (i.value * i.changePercent / 100), 0);
  const totalChangePercent = (totalChangeToday / totalPortfolioValue * 100);
  const isPositiveToday = totalChangeToday >= 0;

  return (
    <View style={styles.container}>
      {/* --- HEADER --- */}
      <LinearGradient
        colors={[Colors.backgroundDark, Colors.gray800]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Investments</Text>
            <Text style={styles.headerSubtitle}>Wealth built from smart saving</Text>
          </View>
          <View style={styles.headerIcon}>
            <Shield size={28} color={Colors.purple} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* --- 1. PORTFOLIO ANALYTICS (Overview Section) --- */}
        <View style={styles.sectionContainer}>
          
          {/* Total Value Card */}
          <View style={[styles.card, styles.totalValueCard]}>
            <Text style={styles.totalValueLabel}>Total Managed Assets</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalPortfolioValue)}</Text>
            <View style={styles.changeRow}>
              <TrendingUp size={16} color={isPositiveToday ? Colors.success : Colors.error} />
              <Text style={[styles.changeText, { color: isPositiveToday ? Colors.success : Colors.error }]}>
                {formatChange(totalChangeToday)} ({formatChange(totalChangePercent)}%) Today
              </Text>
            </View>
            <Text style={styles.motivationText}>
                Your future is growing because you chose to save!
            </Text>
          </View>

          {/* Mock Line/Area Chart */}
          <View style={[styles.card, styles.chartPlaceholder, {marginTop: 12}]}>
            <Text style={styles.chartTitle}>7-Day Performance</Text>
            <MockLineChart />
          </View>
        </View>
        
        {/* --- 2. GOALS PREVIEW (Motivation to Save More) --- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Funding Your Dreams (Goals)</Text>
          <View style={styles.goalsList}>
            {goals.map((goal) => (
              <GoalPreviewCard key={goal.id} goal={goal} />
            ))}
          </View>
        </View>

        {/* --- 3. INVESTMENT HOLDINGS LIST --- */}
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Current Holdings</Text>
            <View style={styles.goalsList}>
                {portfolio.map((item) => (
                    <InvestmentItem key={item.ticker} item={item} />
                ))}
            </View>
        </View>


        {/* --- 4. Investment Mix (Donut Chart Placeholder) --- */}
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Asset Allocation</Text>
            <View style={[styles.card, styles.chartPlaceholder, { height: 250, padding: 20, marginBottom: 40 }]}>
                <Text style={styles.chartTitle}>Diversification Breakdown</Text>
                {/* Mock Donut Chart */}
                <View style={styles.mockDonutChartArea} />
                <View style={styles.legendContainer}>
                    {allocation.map((item) => (
                        <View key={item.key} style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                            <Text style={styles.legendText}>{item.label}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
        
      </ScrollView>
    </View>
  );
}

// --- STYLES (Consistency with GoalsScreen) ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Light, clean background
  },
  headerGradient: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.surface, // Text is white/light on dark gradient
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  headerIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  content: {
    flex: 1,
    paddingTop: 0,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    shadowColor: Colors.shadowStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  totalValueCard: {
    backgroundColor: Colors.gray800,
    padding: 24,
  },
  totalValueLabel: {
    fontSize: 16,
    color: Colors.gray400,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 48,
    fontWeight: '900' as const,
    color: Colors.textDark,
  },
  changeRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray700,
    paddingBottom: 10,
  },
  changeText: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.secondaryLight,
    marginTop: 12,
  },
  chartPlaceholder: {
    height: 220,
    backgroundColor: Colors.gray800,
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.textDark,
    marginBottom: 10,
  },
  mockDonutChartArea: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.gray700, 
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 10,
    alignSelf: 'center' as const,
    borderWidth: 10,
    borderColor: Colors.teal, 
  },
  legendContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    gap: 16,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 14,
    color: Colors.gray400,
  },
  goalsList: {
    gap: 12,
  },
});

const goalStyles = StyleSheet.create({
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
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginBottom: 10,
    },
    goalTitle: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: Colors.text,
    },
    currentProgress: {
        fontSize: 15,
    },
    progressDetails: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'flex-end' as const,
        marginBottom: 8,
        marginTop: 10,
    },
    currentFundValue: {
        fontSize: 22,
        fontWeight: '800' as const,
        color: Colors.primary,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: Colors.borderLight,
        borderRadius: 4,
        overflow: 'hidden' as const,
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.secondary,
        textAlign: 'right' as const,
        marginTop: 5,
    }
});

const investStyles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    infoLeft: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 12,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    name: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: Colors.text,
    },
    fullName: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
    infoRight: {
        alignItems: 'flex-end' as const,
    },
    value: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: Colors.text,
        marginBottom: 2,
    },
    changeContainer: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
    },
    changeText: {
        fontSize: 14,
        fontWeight: '600' as const,
    }
});

const mockChartStyles = StyleSheet.create({
    chartContainer: {
        flex: 1,
        flexDirection: 'row' as const,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    yAxis: {
        justifyContent: 'space-between' as const,
        paddingRight: 10,
    },
    yLabel: {
        fontSize: 12,
        color: Colors.gray400,
        fontWeight: '500' as const,
    },
    dataArea: {
        flex: 1,
        flexDirection: 'row' as const,
        alignItems: 'flex-end' as const,
        justifyContent: 'space-around' as const,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.gray700,
    },
    barWrapper: {
        alignItems: 'center' as const,
        justifyContent: 'flex-end' as const,
        flex: 1,
        height: '100%',
        paddingHorizontal: 2,
    },
    bar: {
        width: 6, 
        borderRadius: 3,
        marginBottom: 4,
    },
    xLabel: {
        fontSize: 12,
        color: Colors.gray400,
        position: 'absolute' as const,
        bottom: -18,
    }
});