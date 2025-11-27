import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  AlertCircle,
  TrendingUp,
  Sparkles,
  PartyPopper,
  DollarSign,
  Target,
  Award,
  ShieldCheck,
  X,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/providers/AppProvider';

const { width, height } = Dimensions.get('window');

interface SpendingScenario {
  merchant: string;
  amount: number;
  category: string;
  emoji: string;
}

const SPENDING_SCENARIOS: SpendingScenario[] = [
  { merchant: 'Zara', amount: 127.50, category: 'Fashion', emoji: '👗' },
  { merchant: 'Nike Store', amount: 89.99, category: 'Shopping', emoji: '👟' },
  { merchant: 'Starbucks', amount: 8.75, category: 'Coffee', emoji: '☕' },
  { merchant: 'Amazon', amount: 64.99, category: 'Shopping', emoji: '📦' },
  { merchant: 'DoorDash', amount: 35.40, category: 'Food Delivery', emoji: '🍔' },
  { merchant: 'Apple Store', amount: 199.99, category: 'Electronics', emoji: '📱' },
];

export default function SpendingSimulator() {
  const { goals, handleTransactionNudge } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<SpendingScenario | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRegret, setShowRegret] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const startSimulation = () => {
    const randomScenario = SPENDING_SCENARIOS[Math.floor(Math.random() * SPENDING_SCENARIOS.length)];
    setCurrentScenario(randomScenario);
    setIsVisible(true);
    setShowConfirmation(true);
    
    // Animate modal entrance
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleYesSpending = () => {
    setShowConfirmation(false);
    
    // Shake animation for regret
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowRegret(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNoSpending = () => {
    setShowConfirmation(false);
    
    // Celebration animation
    Animated.parallel([
      Animated.spring(confettiAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCelebration(true);
    });
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      setShowConfirmation(false);
      setShowRegret(false);
      setShowCelebration(false);
      setCurrentScenario(null);
      scaleAnim.setValue(0);
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
      confettiAnim.setValue(0);
      shakeAnim.setValue(0);
    });
  };

  const calculateGoalImpact = () => {
    if (!currentScenario) return [];
    
    return goals.map(goal => {
      const percentageOfGoal = (currentScenario.amount / goal.targetAmount) * 100;
      const remainingAmount = goal.targetAmount - goal.currentAmount;
      const daysDelayed = Math.round((currentScenario.amount / remainingAmount) * 365);
      
      return {
        goal,
        percentageOfGoal,
        daysDelayed: Math.min(daysDelayed, 365),
      };
    });
  };

  if (!currentScenario) {
    return (
      <Pressable style={styles.simulatorButton} onPress={startSimulation}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.simulatorGradient}
        >
          <Sparkles size={24} color={Colors.surface} />
          <Text style={styles.simulatorButtonText}>Test Spending Control</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <>
      <Pressable style={styles.simulatorButton} onPress={startSimulation}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.simulatorGradient}
        >
          <Sparkles size={24} color={Colors.surface} />
          <Text style={styles.simulatorButtonText}>Test Spending Control</Text>
        </LinearGradient>
      </Pressable>

      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <BlurView intensity={80} style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {showConfirmation && (
              <ConfirmationScreen
                scenario={currentScenario}
                onYes={handleYesSpending}
                onNo={handleNoSpending}
                shakeAnim={shakeAnim}
              />
            )}

            {showRegret && (
              <RegretScreen
                scenario={currentScenario}
                goalImpacts={calculateGoalImpact()}
                onClose={closeModal}
                slideAnim={slideAnim}
              />
            )}

            {showCelebration && (
              <CelebrationScreen
                scenario={currentScenario}
                onClose={closeModal}
                confettiAnim={confettiAnim}
              />
            )}
          </Animated.View>
        </BlurView>
      </Modal>
    </>
  );
}

// Confirmation Screen Component
function ConfirmationScreen({
  scenario,
  onYes,
  onNo,
  shakeAnim,
}: {
  scenario: SpendingScenario;
  onYes: () => void;
  onNo: () => void;
  shakeAnim: Animated.Value;
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.screenContainer, { transform: [{ translateX: shakeAnim }] }]}>
      <View style={styles.iconContainer}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <View style={[styles.warningIcon, { backgroundColor: '#FF6B6B20' }]}>
            <AlertCircle size={56} color="#FF6B6B" strokeWidth={2.5} />
          </View>
        </Animated.View>
      </View>

      <Text style={styles.mainTitle}>Are you sure?</Text>
      <Text style={styles.subtitle}>You're about to spend on</Text>

      <View style={styles.purchaseCard}>
        <Text style={styles.merchantEmoji}>{scenario.emoji}</Text>
        <View style={styles.purchaseInfo}>
          <Text style={styles.merchantName}>{scenario.merchant}</Text>
          <Text style={styles.category}>{scenario.category}</Text>
        </View>
        <Text style={styles.amount}>${scenario.amount.toFixed(2)}</Text>
      </View>

      <Text style={styles.warningText}>
        This could impact your financial goals...
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.noButton} onPress={onNo}>
          <LinearGradient
            colors={[Colors.success, '#10B981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <ShieldCheck size={24} color={Colors.surface} />
            <Text style={styles.buttonText}>No, Save It!</Text>
          </LinearGradient>
        </Pressable>

        <Pressable style={styles.yesButton} onPress={onYes}>
          <View style={styles.yesButtonInner}>
            <Text style={styles.yesButtonText}>Yes, Spend</Text>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
}

// Regret Screen Component
function RegretScreen({
  scenario,
  goalImpacts,
  onClose,
  slideAnim,
}: {
  scenario: SpendingScenario;
  goalImpacts: any[];
  onClose: () => void;
  slideAnim: Animated.Value;
}) {
  return (
    <Animated.View
      style={[
        styles.screenContainer,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Pressable style={styles.closeButton} onPress={onClose}>
        <X size={24} color={Colors.textSecondary} />
      </Pressable>

      <View style={styles.iconContainer}>
        <View style={[styles.warningIcon, { backgroundColor: '#EF444420' }]}>
          <Text style={styles.sadEmoji}>😔</Text>
        </View>
      </View>

      <Text style={styles.mainTitle}>You Spent ${scenario.amount.toFixed(2)}</Text>
      <Text style={styles.subtitle}>Here's what it cost you...</Text>

      <ScrollView style={styles.impactList} showsVerticalScrollIndicator={false}>
        {goalImpacts.map((impact, index) => (
          <View key={impact.goal.id} style={styles.impactCard}>
            <View style={styles.impactHeader}>
              <Text style={styles.impactEmoji}>🎯</Text>
              <View style={styles.impactInfo}>
                <Text style={styles.impactGoalName}>{impact.goal.title}</Text>
                <Text style={styles.impactDescription}>
                  You needed ${scenario.amount.toFixed(2)} to reach this goal
                </Text>
              </View>
            </View>
            
            <View style={styles.impactStats}>
              <View style={styles.impactStat}>
                <Target size={20} color="#EF4444" />
                <Text style={styles.impactStatText}>
                  {impact.percentageOfGoal.toFixed(1)}% of goal
                </Text>
              </View>
              <View style={styles.impactStat}>
                <TrendingUp size={20} color="#EF4444" />
                <Text style={styles.impactStatText}>
                  ~{impact.daysDelayed} days delayed
                </Text>
              </View>
            </View>

            <View style={styles.contributionBox}>
              <Text style={styles.contributionLabel}>Should have contributed:</Text>
              <Text style={styles.contributionAmount}>
                ${(scenario.amount / goalImpacts.length).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.regretMessage}>
          <Text style={styles.regretMessageText}>
            💡 Next time, think about your future self! Every dollar counts toward your dreams.
          </Text>
        </View>
      </ScrollView>

      <Pressable style={styles.closeActionButton} onPress={onClose}>
        <Text style={styles.closeActionText}>I'll Do Better Next Time</Text>
      </Pressable>
    </Animated.View>
  );
}

// Celebration Screen Component
function CelebrationScreen({
  scenario,
  onClose,
  confettiAnim,
}: {
  scenario: SpendingScenario;
  onClose: () => void;
  confettiAnim: Animated.Value;
}) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -10,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.screenContainer}>
      <Pressable style={styles.closeButton} onPress={onClose}>
        <X size={24} color={Colors.textSecondary} />
      </Pressable>

      {/* Animated confetti background */}
      <View style={styles.confettiContainer}>
        {[...Array(20)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.confetti,
              {
                left: `${(i * 5) % 100}%`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF8E53'][i % 4],
                opacity: confettiAnim,
                transform: [
                  {
                    translateY: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 600],
                    }),
                  },
                  {
                    rotate: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '720deg'],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ translateY: floatAnim }, { rotate }],
          },
        ]}
      >
        <View style={[styles.warningIcon, { backgroundColor: '#10B98120' }]}>
          <PartyPopper size={56} color="#10B981" strokeWidth={2.5} />
        </View>
      </Animated.View>

      <Text style={[styles.mainTitle, { color: Colors.success }]}>Amazing Choice!</Text>
      <Text style={styles.subtitle}>You just saved ${scenario.amount.toFixed(2)}</Text>

      <View style={styles.celebrationCard}>
        <LinearGradient
          colors={['#10B98120', '#10B98105']}
          style={styles.celebrationGradient}
        >
          <View style={styles.savingsRow}>
            <Award size={32} color="#10B981" />
            <View style={styles.savingsInfo}>
              <Text style={styles.savingsLabel}>Money Saved</Text>
              <Text style={styles.savingsAmount}>${scenario.amount.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🎯</Text>
              <Text style={styles.benefitText}>
                Staying focused on your goals
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>💪</Text>
              <Text style={styles.benefitText}>
                Building financial discipline
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🚀</Text>
              <Text style={styles.benefitText}>
                Getting closer to your dreams
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.motivationBox}>
        <Text style={styles.motivationText}>
          "The secret to getting ahead is getting started. You're doing amazing!" 🌟
        </Text>
      </View>

      <Pressable style={styles.celebrateButton} onPress={onClose}>
        <LinearGradient
          colors={[Colors.success, '#10B981']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Keep It Up!</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  simulatorButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  simulatorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  simulatorButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.surface,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.85,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  screenContainer: {
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  warningIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sadEmoji: {
    fontSize: 64,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  purchaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    gap: 16,
  },
  merchantEmoji: {
    fontSize: 40,
  },
  purchaseInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  amount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF6B6B',
  },
  warningText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  buttonContainer: {
    gap: 12,
  },
  noButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.surface,
  },
  yesButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  yesButtonInner: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  yesButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  impactList: {
    maxHeight: 400,
    marginBottom: 20,
  },
  impactCard: {
    backgroundColor: '#EF444410',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EF444420',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  impactEmoji: {
    fontSize: 32,
  },
  impactInfo: {
    flex: 1,
  },
  impactGoalName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  impactDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  impactStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  impactStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  impactStatText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
  },
  contributionBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contributionLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  contributionAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#EF4444',
  },
  regretMessage: {
    backgroundColor: `${Colors.secondary}15`,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  regretMessageText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    textAlign: 'center',
  },
  closeActionButton: {
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  celebrationCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  celebrationGradient: {
    padding: 24,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  savingsInfo: {
    flex: 1,
  },
  savingsLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  savingsAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.success,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIcon: {
    fontSize: 24,
  },
  benefitText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  motivationBox: {
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  motivationText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  celebrateButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
