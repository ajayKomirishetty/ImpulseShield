import { StyleSheet, Text, View, ScrollView, Pressable, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingUp, Flame, Award, Plus, TrendingDown, Zap, Target, Rocket } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Image } from "expo-image";
import { useState, useRef, useEffect } from "react";
import { router } from "expo-router";
import SpendingSimulator from "@/components/SpendingSimulator";
import { observer } from "mobx-react-lite";
import { rootStore } from "@/stores/RootStore";

const DashboardScreen = observer(() => {
  const { goals, totalInvestmentsValue } = rootStore;
  const streakDays = 12; // This should be moved to the store later
  const [showNudge, setShowNudge] = useState<boolean>(false);
  
  // Animations
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -15,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      setShowNudge(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  const primaryGoal = goals[0];
  const progress = primaryGoal ? (primaryGoal.currentAmount / primaryGoal.targetAmount) * 100 : 0;

  const yearlySpending = 15480;
  const averageReturn = 0.10;
  const potentialValue = yearlySpending * (1 + averageReturn);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.gradient1 as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.header}>
          <View>
            <Animated.Text style={[styles.greeting, { transform: [{ scale: pulseAnim }] }]}>
              Welcome back! 👋
            </Animated.Text>
            <Text style={styles.headerTitle}>Your Financial Journey</Text>
          </View>
          <Animated.View style={[styles.streakBadge, { transform: [{ scale: bounceAnim }] }]}>
            <Flame size={20} color={Colors.accent} />
            <Text style={styles.streakText}>{streakDays}</Text>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Animated Stats Cards */}
        <View style={styles.statsGrid}>
          <Animated.View style={[styles.statCard, { transform: [{ translateY: floatAnim1 }] }]}>
            <LinearGradient
              colors={[Colors.purple + '20', Colors.pink + '10']}
              style={styles.statCardGradient}
            >
              <View style={styles.statIconContainer}>
                <Animated.View style={{ transform: [{ rotate }] }}>
                  <TrendingUp size={28} color={Colors.purple} strokeWidth={2.5} />
                </Animated.View>
              </View>
              <Text style={styles.statValue}>${totalInvestmentsValue.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Total Invested</Text>
              <View style={styles.shimmerContainer}>
                <Animated.View
                  style={[
                    styles.shimmer,
                    {
                      transform: [{ translateX: shimmerTranslate }],
                    },
                  ]}
                />
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={[styles.statCard, { transform: [{ translateY: floatAnim2 }] }]}>
            <LinearGradient
              colors={[Colors.orange + '20', Colors.accent + '10']}
              style={styles.statCardGradient}
            >
              <View style={styles.statIconContainer}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Award size={28} color={Colors.orange} strokeWidth={2.5} />
                </Animated.View>
              </View>
              <Text style={styles.statValue}>{goals.length}</Text>
              <Text style={styles.statLabel}>Active Goals</Text>
              <View style={styles.shimmerContainer}>
                <Animated.View
                  style={[
                    styles.shimmer,
                    {
                      transform: [{ translateX: shimmerTranslate }],
                    },
                  ]}
                />
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Primary Goal with Enhanced Design */}
        {primaryGoal && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎯 Primary Goal</Text>
              <Animated.View style={{ transform: [{ rotate }] }}>
                <Zap size={24} color={Colors.primary} />
              </Animated.View>
            </View>
            <Pressable 
              style={styles.goalCard}
              onPress={() => router.push('/(tabs)/goals')}
            >
              <Image
                source={{ uri: primaryGoal.imageUrl }}
                style={styles.goalImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(26, 29, 46, 0.95)']}
                style={styles.goalOverlay}
              >
                <View>
                  <Text style={styles.goalTitle}>{primaryGoal.title}</Text>
                  <Text style={styles.goalDescription}>{primaryGoal.description}</Text>
                </View>
                <View style={styles.goalProgress}>
                  <View style={styles.progressBar}>
                  <LinearGradient
                    colors={Colors.gradient4 as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]}
                  />
                  </View>
                  <View style={styles.goalAmounts}>
                    <Text style={styles.goalAmount}>${primaryGoal.currentAmount.toLocaleString()}</Text>
                    <Text style={styles.goalTarget}>of ${primaryGoal.targetAmount.toLocaleString()}</Text>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        )}

        {/* Animated Nudge */}
        {showNudge && (
          <Animated.View 
            style={[
              styles.nudgeContainer,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <LinearGradient
              colors={[Colors.secondary + '15', Colors.blue + '10'] as any}
              style={styles.nudgeCard}
            >
              <View style={styles.nudgeHeader}>
                <LinearGradient
                  colors={Colors.gradient2 as any}
                  style={styles.nudgeIconContainer}
                >
                  <Text style={styles.nudgeIcon}>🎯</Text>
                </LinearGradient>
                <View style={styles.nudgeContent}>
                  <Text style={styles.nudgeTitle}>Trade Up Alert!</Text>
                  <Text style={styles.nudgeMessage}>
                    Detected: Zara purchase for $87.50
                  </Text>
                  <Text style={styles.nudgeSubtext}>
                    Future You is choosing Bali over fast fashion 🌴
                  </Text>
                </View>
              </View>
              <Pressable style={styles.nudgeButtonWrapper}>
                <LinearGradient
                  colors={Colors.gradient2 as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.nudgeButton}
                >
                  <Text style={styles.nudgeButtonText}>Invest $87.50 in SGOV</Text>
                  <TrendingUp size={18} color={Colors.surface} />
                </LinearGradient>
              </Pressable>
              <Pressable 
                style={styles.nudgeClose}
                onPress={() => {
                  Animated.timing(slideAnim, {
                    toValue: -100,
                    duration: 200,
                    useNativeDriver: true,
                  }).start(() => setShowNudge(false));
                }}
              >
                <Text style={styles.nudgeCloseText}>Maybe later</Text>
              </Pressable>
            </LinearGradient>
          </Animated.View>
        )}

        {/* What If You Invested - Redesigned */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💰 Investment Impact</Text>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Rocket size={24} color={Colors.secondary} />
            </Animated.View>
          </View>
          <View style={styles.visualizerCard}>
            <LinearGradient
              colors={[Colors.purple + '10', Colors.pink + '05']}
              style={styles.visualizerGradient}
            >
              <View style={styles.comparisonRow}>
                <View style={styles.comparisonItem}>
                  <LinearGradient
                    colors={['#EF444420', '#EF444410']}
                    style={styles.comparisonIcon}
                  >
                    <TrendingDown size={24} color="#EF4444" />
                  </LinearGradient>
                  <Text style={styles.comparisonLabel}>Impulse Spending</Text>
                  <Text style={styles.comparisonAmount}>${yearlySpending.toLocaleString()}</Text>
                </View>
                
                <View style={styles.vsContainer}>
                  <LinearGradient
                    colors={Colors.gradient3 as any}
                    style={styles.vsBadge}
                  >
                    <Text style={styles.vsLabel}>VS</Text>
                  </LinearGradient>
                </View>
                
                <View style={styles.comparisonItem}>
                  <LinearGradient
                    colors={[Colors.success + '20', Colors.success + '10']}
                    style={styles.comparisonIcon}
                  >
                    <TrendingUp size={24} color={Colors.success} />
                  </LinearGradient>
                  <Text style={styles.comparisonLabel}>If Invested</Text>
                  <Text style={[styles.comparisonAmount, { color: Colors.success }]}>
                    ${potentialValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </Text>
                </View>
              </View>

              <LinearGradient
                colors={[Colors.secondary + '15', Colors.blue + '10']}
                style={styles.visualizerInsight}
              >
                <Text style={styles.insightEmoji}>💡</Text>
                <Text style={styles.insightText}>
                  You could earn an extra{' '}
                  <Text style={styles.insightHighlight}>
                    ${(potentialValue - yearlySpending).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </Text>
                  {' '}this year with 10% returns!
                </Text>
              </LinearGradient>

              <View style={styles.breakdown}>
                <Text style={styles.breakdownTitle}>Top Impulse Categories</Text>
                
                <View style={styles.categoryBar}>
                  <View style={styles.categoryBarItem}>
                    <Text style={styles.categoryEmoji}>☕</Text>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>Dining Out</Text>
                      <Text style={styles.categoryAmount}>$4,200/year</Text>
                    </View>
                  </View>
                  <LinearGradient
                    colors={['#F59E0B', '#FCD34D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.categoryProgress, { width: '60%' }]}
                  />
                </View>

                <View style={styles.categoryBar}>
                  <View style={styles.categoryBarItem}>
                    <Text style={styles.categoryEmoji}>👗</Text>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>Fashion & Shopping</Text>
                      <Text style={styles.categoryAmount}>$6,800/year</Text>
                    </View>
                  </View>
                  <LinearGradient
                    colors={['#EC4899', '#F472B6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.categoryProgress, { width: '80%' }]}
                  />
                </View>

                <View style={styles.categoryBar}>
                  <View style={styles.categoryBarItem}>
                    <Text style={styles.categoryEmoji}>🍔</Text>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>Food Delivery</Text>
                      <Text style={styles.categoryAmount}>$4,480/year</Text>
                    </View>
                  </View>
                  <LinearGradient
                    colors={['#3B82F6', '#60A5FA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.categoryProgress, { width: '65%' }]}
                  />
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        <SpendingSimulator />

        {/* Quick Actions with Animation */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          </View>
          <Pressable 
            style={styles.actionButton}
            onPress={() => router.push('/create-goal')}
          >
            <LinearGradient
              colors={Colors.gradient5 as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <View style={styles.actionIcon}>
                <Plus size={28} color={Colors.surface} strokeWidth={2.5} />
              </View>
              <Text style={styles.actionText}>Create New Goal</Text>
              <Text style={styles.actionSubtext}>Start your next journey</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
});

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  headerGradient: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 4,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.surface,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  streakText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.surface,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  statCardGradient: {
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  statIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  shimmer: {
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ skewX: '-20deg' }],
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  goalCard: {
    height: 300,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  goalImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  goalOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  goalTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.surface,
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 22,
    fontWeight: '500',
  },
  goalProgress: {
    gap: 12,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  goalAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.surface,
  },
  goalTarget: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  nudgeContainer: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  nudgeCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.secondary + '40',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  nudgeHeader: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  nudgeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nudgeIcon: {
    fontSize: 32,
  },
  nudgeContent: {
    flex: 1,
  },
  nudgeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
  },
  nudgeMessage: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  nudgeSubtext: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '700',
  },
  nudgeButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  nudgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  nudgeButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.surface,
  },
  nudgeClose: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  nudgeCloseText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  visualizerCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  visualizerGradient: {
    padding: 24,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  comparisonItem: {
    flex: 1,
    alignItems: 'center',
  },
  comparisonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  comparisonLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  comparisonAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  vsContainer: {
    paddingHorizontal: 16,
  },
  vsBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  vsLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.surface,
  },
  visualizerInsight: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  insightEmoji: {
    fontSize: 28,
  },
  insightText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    fontWeight: '500',
  },
  insightHighlight: {
    fontWeight: '800',
    color: Colors.success,
  },
  breakdown: {
    gap: 20,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  categoryBar: {
    position: 'relative',
  },
  categoryBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  categoryAmount: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  categoryProgress: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  actionButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.blue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  actionGradient: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.surface,
  },
  actionSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
});
