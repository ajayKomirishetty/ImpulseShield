import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Trophy, Flame, TrendingUp } from "lucide-react-native";
import { useApp } from "@/providers/AppProvider";
import Colors from "@/constants/colors";
import { MOCK_LEADERBOARD } from "@/mocks/data";

export default function LeaderboardScreen() {
  const { totalInvested, streakDays } = useApp();

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.accent, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Leaderboard</Text>
            <Text style={styles.headerSubtitle}>ImpulseSwap Champions</Text>
          </View>
          <View style={styles.headerIcon}>
            <Trophy size={28} color={Colors.surface} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.userStatsCard}>
          <Text style={styles.statsTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <TrendingUp size={24} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>${totalInvested.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Total Diverted</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Flame size={24} color={Colors.accent} />
              </View>
              <Text style={styles.statValue}>{streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Savers</Text>
          {MOCK_LEADERBOARD.map((entry) => {
            const isUser = entry.username === 'You';
            
            return (
              <View 
                key={entry.id} 
                style={[
                  styles.leaderboardCard,
                  isUser && styles.leaderboardCardHighlight,
                ]}
              >
                <View style={styles.rankContainer}>
                  <Text style={styles.rankText}>{getRankMedal(entry.rank)}</Text>
                </View>

                <View style={styles.userInfo}>
                  <View style={styles.userHeader}>
                    <Text style={[styles.username, isUser && styles.usernameHighlight]}>
                      {entry.username}
                    </Text>
                    {isUser && (
                      <View style={styles.youBadge}>
                        <Text style={styles.youBadgeText}>YOU</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.userStats}>
                    <View style={styles.userStat}>
                      <TrendingUp size={14} color={Colors.primary} />
                      <Text style={styles.userStatText}>
                        ${entry.totalDiverted.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.userStat}>
                      <Flame size={14} color={Colors.accent} />
                      <Text style={styles.userStatText}>
                        {entry.streakDays} days
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.badges}>
                  {entry.badges.map((badge, idx) => (
                    <Text key={idx} style={styles.badge}>{badge}</Text>
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🏆 How to Climb</Text>
          <Text style={styles.infoText}>
            • Successfully divert impulse spending{'\n'}
            • Maintain your daily streak{'\n'}
            • Earn badges for milestones{'\n'}
            • Compete with friends!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

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
  userStatsCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center' as const,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: `${Colors.primary}15`,
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  leaderboardCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  leaderboardCardHighlight: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}08`,
  },
  rankContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  rankText: {
    fontSize: 20,
    fontWeight: '800' as const,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 6,
  },
  username: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  usernameHighlight: {
    color: Colors.primary,
  },
  youBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  youBadgeText: {
    fontSize: 10,
    fontWeight: '800' as const,
    color: Colors.surface,
  },
  userStats: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  userStat: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  userStatText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  badges: {
    flexDirection: 'row' as const,
    gap: 4,
  },
  badge: {
    fontSize: 20,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
