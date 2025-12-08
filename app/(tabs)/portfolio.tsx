import React from 'react';
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Shield, TrendingUp } from "lucide-react-native";
import Colors from "@/constants/colors";
import { observer } from 'mobx-react-lite';
import { rootStore } from '@/stores/RootStore';
import { formatCurrency, formatChange } from './formatters';
import { SavingsBreakdownChart } from './SavingsBreakdownChart';

// New Modular Components
import { PortfolioChart } from '@/components/portfolio/PortfolioChart';
import { AssetList } from '@/components/portfolio/AssetList';
import { AssetAllocationChart } from '@/components/portfolio/AssetAllocationChart';
import { GoalPreviewCard } from '@/components/portfolio/GoalPreviewCard';

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
          </View>

          {/* Portfolio Chart */}
          <PortfolioChart data={performanceData} />
        </View>

        {/* --- NEW SAVINGS BREAKDOWN CHART --- */}
        <View style={styles.sectionContainer}>
          <SavingsBreakdownChart data={rootStore.getSavingsBreakdownData()} totalSavings={rootStore.totalSavings} />
        </View>

        {/* --- 2. GOALS PREVIEW --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Funding Your Dreams</Text>
            <Text style={styles.sectionSubtitle}>Active Goals</Text>
          </View>
          <View style={styles.goalsList}>
            {goals.map((goal) => (
              <GoalPreviewCard key={goal.id} goal={goal} />
            ))}
          </View>
        </View>

        {/* --- 3. ASSET ALLOCATION --- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Asset Allocation</Text>
          <AssetAllocationChart allocation={allocationData} />
        </View>

        {/* --- 4. INVESTMENT HOLDINGS --- */}
        <View style={[styles.sectionContainer, { marginBottom: 40 }]}>
          <Text style={styles.sectionTitle}>Current Holdings</Text>
          <AssetList portfolio={portfolio} />
        </View>

      </ScrollView>
    </View>
  );
});

export default PortfolioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.surface,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 24,
    shadowColor: Colors.shadowStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  totalValueCard: {
    backgroundColor: Colors.gray800,
    padding: 24,
    marginBottom: 4,
  },
  totalValueLabel: {
    fontSize: 14,
    color: Colors.gray400,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.textDark,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  goalsList: {
    gap: 16,
  },
});