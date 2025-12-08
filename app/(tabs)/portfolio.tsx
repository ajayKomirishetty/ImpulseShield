import React, { useState, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, PanResponder } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { DollarSign, TrendingUp, ArrowRight, Shield, TrendingDown } from "lucide-react-native";
import Colors from "@/constants/colors";
// IMPORTING FADE-IN FOR CHART ANIMATION
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn } from 'react-native-reanimated';
import { router } from "expo-router";
import { observer } from 'mobx-react-lite';
import { rootStore, Goal, Investment } from '@/stores/RootStore';
import { formatCurrency, formatChange, getHorizonColor } from './formatters';
import { SavingsBreakdownChart } from './SavingsBreakdownChart';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop, Circle } from 'react-native-svg';

// --- SUB-COMPONENTS ---

/**
 * Goal Preview Card (Read-Only) - Must be observer if goal data changes often
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
  const scale = useSharedValue(1);
  const color = item.isPositive ? Colors.success : Colors.error;
  const Icon = item.isPositive ? TrendingUp : TrendingDown;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value, { duration: 150 }) }],
    };
  });

  return (
    <Animated.View style={[investStyles.itemContainerWrapper, animatedStyle]}>
      <Pressable
        onPressIn={() => (scale.value = 0.99)}
        onPressOut={() => (scale.value = 1)}
        style={investStyles.itemContainer}
      >
        <View style={investStyles.infoLeft}>
          <View style={[investStyles.iconWrapper, { backgroundColor: `${color}20` }]}>
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
              {formatChange(item.gainPercent)}%
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

/**
 * Mock Line/Area Chart Component (Using data from the MobX store)
 */
const AreaChart: React.FC<{ chartData: { date: string, portfolioValue: number }[] }> = ({ chartData }) => {
  const values = chartData.map(d => d.portfolioValue);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal;

  // Layout constants
  const chartHeight = 180;
  const chartWidth = 300;
  const paddingVertical = 20;

  const [scrubbing, setScrubbing] = useState(false);
  const [scrubPos, setScrubPos] = useState({ x: 0, y: 0 });
  const [scrubData, setScrubData] = useState<{ date: string, value: number } | null>(null);

  const points = useMemo(() => chartData.map((point, index) => {
    const x = (index / (chartData.length - 1)) * chartWidth;
    const normalizedValue = (point.portfolioValue - minVal) / (range || 1);
    const y = chartHeight - (normalizedValue * (chartHeight - paddingVertical * 2) + paddingVertical);
    return { x, y, date: point.date, value: point.portfolioValue };
  }), [chartData, minVal, range, chartHeight, paddingVertical, chartWidth]);

  const path = useMemo(() => points.reduce((acc: string, point: { x: number, y: number }, index: number) => {
    if (index === 0) return `M ${point.x},${point.y}`;
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
    // Clamp x to chart width
    const x = Math.max(0, Math.min(touchX, chartWidth));

    // Find closest point
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
    setScrubData({ date: closestPoint.date, value: closestPoint.value });
  };

  return (
    <Animated.View style={mockChartStyles.chartContainer} entering={FadeIn.duration(800)}>
      <View style={mockChartStyles.yAxis}>
        <Text style={mockChartStyles.yLabel}>{formatCurrency(maxVal)}</Text>
        <Text style={mockChartStyles.yLabel}>{formatCurrency(minVal)}</Text>
      </View>
      <View style={mockChartStyles.dataArea} {...panResponder.panHandlers}>
        <Svg height="100%" width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <Defs>
            <SvgGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={Colors.secondary} stopOpacity="0.3" />
              <Stop offset="1" stopColor={Colors.secondary} stopOpacity="0" />
            </SvgGradient>
          </Defs>
          <Path d={areaPath} fill="url(#grad)" />
          <Path d={path} fill="none" stroke={Colors.secondary} strokeWidth="2.5" />

          {/* Scrubber Line & Dot */}
          {scrubbing && (
            <>
              <Path
                d={`M ${scrubPos.x},0 L ${scrubPos.x},${chartHeight}`}
                stroke={Colors.text}
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <Circle cx={scrubPos.x} cy={scrubPos.y} r="6" fill={Colors.surface} stroke={Colors.secondary} strokeWidth="3" />
            </>
          )}
        </Svg>

        {/* Tooltip Overlay */}
        {scrubbing && scrubData && (
          <View style={[mockChartStyles.tooltip, { left: Math.min(scrubPos.x - 30, chartWidth - 80), top: 10 }]}>
            <Text style={mockChartStyles.tooltipValue}>{formatCurrency(scrubData.value)}</Text>
            <Text style={mockChartStyles.tooltipDate}>{scrubData.date}</Text>
          </View>
        )}

        <View style={mockChartStyles.xAxisLabels}>
          {points.filter((_, i) => i % 2 === 0).map((point, index) => ( // Show fewer labels
            <Text key={index} style={mockChartStyles.xLabel}>{point.date.split(' ')[0]}</Text>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

/**
 * Asset Allocation Donut Chart Component
 */
const AssetAllocationChart: React.FC<{ allocation: any[] }> = ({ allocation }) => {
  const size = 140;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  const totalPercentage = allocation.reduce((sum, item) => sum + item.percentage, 0);

  return (
    <View style={styles.chartAllocationContainer}>
      {/* Visual Placeholder mimicking the donut chart style in the screenshot */}
      <View style={styles.mockDonutChartArea}>
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
          <Text style={styles.donutChartCenterSubText}>Diversified</Text>
        </View>
      </View>

      <View style={styles.legendContainer}>
        {allocation.map((item: any) => (
          <View key={item.key} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label} {item.percentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};


// --- MAIN SCREEN COMPONENT ---
const PortfolioScreen = observer(() => {
  const { portfolio, goals, allocationData, performanceData, summaryMetrics, totalInvestmentsValue } = rootStore;

  const { dayChange, dayChangePercent } = summaryMetrics;
  const isPositiveToday = dayChange >= 0;
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
            <Text style={styles.totalValue}>{formatCurrency(totalInvestmentsValue)}</Text>
            <View style={styles.changeRow}>
              <TrendingUp size={16} color={isPositiveToday ? Colors.success : Colors.error} />
              <Text style={[styles.changeText, { color: isPositiveToday ? Colors.success : Colors.error }]}>
                {formatChange(dayChange)} ({formatChange(dayChangePercent)}%) Today
              </Text>
            </View>
            <Text style={styles.motivationText}>
              Your smart choices today are building a wealthier tomorrow. Keep it up!
            </Text>
          </View>

          {/* Mock Line/Area Chart */}
          <View style={[styles.card, styles.chartCard, { marginTop: 12 }]}>
            <Text style={styles.chartTitle}>Portfolio Performance</Text>
            <AreaChart chartData={performanceData} />
          </View>
        </View>

        {/* --- NEW SAVINGS BREAKDOWN CHART --- */}
        <SavingsBreakdownChart data={rootStore.getSavingsBreakdownData()} totalSavings={rootStore.totalSavings} />

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
          <View style={[styles.card, styles.chartCard, { height: 'auto', padding: 20, marginBottom: 40 }]}>
            <Text style={styles.chartTitle}>Diversification Breakdown</Text>
            <AssetAllocationChart allocation={allocationData} />
          </View>
        </View>

      </ScrollView>
    </View>
  );
});

export default PortfolioScreen;

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.surface,
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
  chartCard: {
    height: 220,
    backgroundColor: Colors.gray800,
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.textDark,
    marginBottom: 10,
  },
  chartAllocationContainer: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginTop: 16,
  },
  mockDonutChartArea: {
    width: 140,
    height: 140,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 20,
  },
  donutChartCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutChartCenterText: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textDark
  },
  donutChartCenterSubText: {
    fontSize: 12,
    color: Colors.gray400,
    fontWeight: '500',
  },
  legendContainer: {
    flex: 1,
    flexDirection: 'column' as const,
    gap: 8,
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
  itemContainerWrapper: {
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: Colors.surface, // Background for shadow
  },
  itemContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 16,
    borderRadius: 12,
    // Removed borderBottomWidth to rely on card shadow
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
    marginTop: 10,
  },
  yAxis: {
    justifyContent: 'space-between' as const,
    paddingRight: 10,
    height: '90%', // Align with chart area
  },
  yLabel: {
    fontSize: 12,
    color: Colors.gray400,
    fontWeight: '500' as const,
  },
  dataArea: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray700,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  xLabel: {
    fontSize: 12,
    color: Colors.gray400,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: Colors.surface,
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  tooltipValue: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Colors.text,
  },
  tooltipDate: {
    fontSize: 10,
    color: Colors.textSecondary,
  }
});