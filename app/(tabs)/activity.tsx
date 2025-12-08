import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingUp, Check, X } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useState, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { rootStore } from "@/stores/RootStore";


type FilterType = 'all' | 'diverted' | 'spent';

// MOCK DATA - This should come from the store eventually
const MOCK_TRANSACTIONS = [
    { id: 't1', merchantName: 'Zara', category: 'Fashion', amount: 87.50, date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), status: 'pending' as const },
    { id: 't2', merchantName: 'Starbucks', category: 'Dining', amount: 6.25, date: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), status: 'diverted' as const },
    { id: 't3', merchantName: 'Amazon', category: 'Shopping', amount: 129.99, date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), status: 'spent' as const },
];

const ActivityScreen = observer(() => {
  // NOTE: The logic for transactions, nudging, and recommendations is complex
  // and would need to be built into the RootStore. For now, we use mock data.
  const { goals } = rootStore;
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const handleTransactionNudge = (transaction: any, status: string) => console.log('Nudge action', transaction.id, status);
  const getETFRecommendation = (goal: any) => ({ ticker: 'SGOV', name: 'iShares 0-3 Month Treasury Bond ETF', riskLevel: 'Low', description: 'A safe haven for short-term savings.' });

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredTransactions = useMemo(() => {
    if (activeFilter === 'all') return transactions;
    if (activeFilter === 'diverted') return transactions.filter(t => t.status === 'diverted');
    if (activeFilter === 'spent') return transactions.filter(t => t.status === 'spent');
    return transactions;
  }, [transactions, activeFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getCategoryIcon = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Fashion': '👗',
      'Dining': '☕',
      'Shopping': '🛍️',
      'Food Delivery': '🍔',
    };
    return categoryMap[category] || '💳';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.secondary, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Activity</Text>
            <Text style={styles.headerSubtitle}>Impulse spending monitor</Text>
          </View>
          <View style={styles.headerIcon}>
            <TrendingUp size={28} color={Colors.surface} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.filterRow}>
          <Pressable 
            style={[styles.filterButton, activeFilter === 'all' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>All</Text>
          </Pressable>
          <Pressable 
            style={[styles.filterButton, activeFilter === 'diverted' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('diverted')}
          >
            <Text style={[styles.filterText, activeFilter === 'diverted' && styles.filterTextActive]}>Diverted</Text>
          </Pressable>
          <Pressable 
            style={[styles.filterButton, activeFilter === 'spent' && styles.filterButtonActive]}
            onPress={() => setActiveFilter('spent')}
          >
            <Text style={[styles.filterText, activeFilter === 'spent' && styles.filterTextActive]}>Spent</Text>
          </Pressable>
        </View>

        {filteredTransactions.map((transaction) => {
          const etf = goals[0] ? getETFRecommendation(goals[0]) : null;
          
          return (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <View style={styles.transactionIcon}>
                  <Text style={styles.categoryEmoji}>{getCategoryIcon(transaction.category)}</Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.merchantName}>{transaction.merchantName}</Text>
                  <Text style={styles.category}>{transaction.category}</Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.amount}>${transaction.amount.toFixed(2)}</Text>
                  <Text style={styles.timestamp}>{formatDate(transaction.date)}</Text>
                </View>
              </View>

              {transaction.status === 'pending' && etf && (
                <View style={styles.nudgeSection}>
                  <View style={styles.etfCard}>
                    <View style={styles.etfHeader}>
                      <Text style={styles.etfTicker}>{etf.ticker}</Text>
                      <View style={[styles.riskBadge, { backgroundColor: `${Colors.primary}15` }]}>
                        <Text style={[styles.riskText, { color: Colors.primary }]}>
                          {etf.riskLevel}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.etfName}>{etf.name}</Text>
                    <Text style={styles.etfDescription}>{etf.description}</Text>
                  </View>
                  
                  <View style={styles.actionRow}>
                    <Pressable 
                      style={styles.investButton}
                      onPress={() => handleTransactionNudge(transaction, 'invested')}
                    >
                      <Check size={20} color={Colors.surface} />
                      <Text style={styles.investButtonText}>Invest ${transaction.amount.toFixed(2)}</Text>
                    </Pressable>
                    <Pressable 
                      style={styles.ignoreButton}
                      onPress={() => handleTransactionNudge(transaction, 'ignored')}
                    >
                      <X size={20} color={Colors.textSecondary} />
                    </Pressable>
                  </View>
                </View>
              )}

              {transaction.status === 'diverted' && (
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
                  <Text style={[styles.statusText, { color: Colors.success }]}>
                    Invested 🎉
                  </Text>
                </View>
              )}

              {transaction.status === 'spent' && (
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: Colors.textTertiary }]} />
                  <Text style={[styles.statusText, { color: Colors.textSecondary }]}>
                    Spent
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Smart Nudging</Text>
            <Text style={styles.tipText}>
              We analyze your spending patterns and suggest optimal investments based on your goals.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
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
    color: 'rgba(255,255,255,0.8)',
  },
  headerIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  filterRow: {
    flexDirection: 'row' as const,
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.surface,
  },
  transactionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  transactionRight: {
    alignItems: 'flex-end' as const,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  nudgeSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  etfCard: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  etfHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 6,
  },
  etfTicker: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
  },
  etfName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  etfDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  investButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  investButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.surface,
  },
  ignoreButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 12,
  },
  statusBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  tipCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row' as const,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipIcon: {
    fontSize: 32,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
