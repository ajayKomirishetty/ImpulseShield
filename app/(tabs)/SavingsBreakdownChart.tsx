import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import Colors from '@/constants/colors';

interface SavingsBreakdownChartProps {
  data: {
    value: number;
    color: string;
    text: string;
    label: string;
  }[];
  totalSavings: number;
}

import Animated, { FadeInDown } from 'react-native-reanimated';

export const SavingsBreakdownChart: React.FC<SavingsBreakdownChartProps> = ({ data, totalSavings }) => {
  return (
    <Animated.View style={styles.chartContainer} entering={FadeInDown.duration(800).springify()}>
      <PieChart
        data={data}
        donut
        radius={90}
        innerRadius={60}
        centerLabelComponent={() => (
          <View style={styles.centerLabel}>
            <Text style={styles.centerLabelValue}>${totalSavings.toFixed(0)}</Text>
            <Text style={styles.centerLabelText}>Total Saved</Text>
          </View>
        )}
        // Styling for the chart
        sectionAutoFocus
        focusOnPress
        toggleFocusOnPress={false}
      />
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
            <Text style={styles.legendValue}>${item.value.toFixed(0)}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  centerLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabelValue: {
    fontSize: 22,
    color: Colors.text,
    fontWeight: 'bold',
  },
  centerLabelText: {
    fontSize: 14,
    color: Colors.text,
  },
  legendContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    fontFamily: 'Inter-Medium',
  },
  legendValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    fontFamily: 'Inter-App',
  },
});
