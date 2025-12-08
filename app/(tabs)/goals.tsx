import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Plus, ArrowRight, X, CheckCircle } from "lucide-react-native";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { Image } from "expo-image";
import { useState } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn, FadeOut } from 'react-native-reanimated';
import { observer } from "mobx-react-lite";
import { rootStore, Goal } from "@/stores/RootStore";

const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;


// --- 1. CONTRIBUTION MODAL COMPONENT (Moved from PortfolioScreen) ---

interface ContributionModalProps {
  visible: boolean;
  goal: Goal | null;
  onClose: () => void;
  onContribute: (goalId: string, amount: number) => void;
}

const ContributionModal: React.FC<ContributionModalProps> = ({ visible, goal, onClose, onContribute }) => {
  const [amount, setAmount] = useState('100');

  if (!goal) return null;

  const handleContribute = () => {
    const contributionAmount = parseFloat(amount);
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount greater than zero.");
      return;
    }
    onContribute(goal.id, contributionAmount);
    setAmount('100'); // Reset amount
  };

  const handleClose = () => {
    Alert.alert(
      "Don't Stop Now!",
      "Every contribution, no matter how small, moves you closer to your financial freedom. Are you sure you want to close without saving?",
      [
        { text: "Keep Saving", onPress: () => { }, style: 'cancel' },
        { text: "Close", onPress: onClose, style: 'destructive' }
      ]
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Pressable style={modalStyles.closeButton} onPress={handleClose}>
            <X size={24} color={Colors.gray400} />
          </Pressable>

          <Text style={modalStyles.title}>Contribute to {goal.title}</Text>
          <Text style={modalStyles.subtitle}>
            You are {Math.round(goal.currentAmount / goal.targetAmount * 100)}% funded! One step closer to freedom! 🌟
          </Text>

          <Text style={modalStyles.inputLabel}>Amount to Contribute (USD)</Text>
          <TextInput
            style={modalStyles.input}
            onChangeText={setAmount}
            value={amount}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor={Colors.gray500}
          />

          <Pressable
            style={({ pressed }) => [modalStyles.button, pressed && { opacity: 0.8 }]}
            onPress={handleContribute}
          >
            <Text style={modalStyles.buttonText}>Contribute {formatCurrency(parseFloat(amount) || 0)}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

// --- 2. GOAL CARD COMPONENT with Animation and Motivation ---

interface GoalCardProps {
  goal: Goal;
  onPressContribute: (goal: Goal) => void;
  timeHorizonColor: string;
  getTimeHorizonLabel: (horizon: string) => string;
}

const AnimatedGoalCard: React.FC<GoalCardProps> = ({
  goal,
  onPressContribute,
  timeHorizonColor,
  getTimeHorizonLabel
}) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const scale = useSharedValue(1);
  const animatedProgress = useSharedValue(progress);
  animatedProgress.value = withTiming(progress, { duration: 500 });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value, { duration: 150 }) }],
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${Math.min(animatedProgress.value, 100)}%`,
      backgroundColor: timeHorizonColor,
    };
  });

  return (
    <Animated.View style={[styles.goalContainer, cardAnimatedStyle]}>
      <Pressable
        style={({ pressed }) => [styles.goalCard, pressed && { opacity: 0.95 }]}
        onPressIn={() => (scale.value = 0.98)}
        onPressOut={() => (scale.value = 1)}
        onPress={() => onPressContribute(goal)}
      >
        <Image
          source={{ uri: goal.imageUrl }}
          style={styles.goalImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.goalOverlay}
        >
          <View style={styles.goalHeader}>
            <View style={[styles.timeBadge, { backgroundColor: `${timeHorizonColor}20` }]}>
              <Text style={[styles.timeText, { color: timeHorizonColor }]}>
                {getTimeHorizonLabel(goal.timeHorizon)}
              </Text>
            </View>
          </View>

          <View>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription} numberOfLines={2}>
              {goal.description}
            </Text>

            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
              </View>
              <View style={styles.amountRow}>
                <Text style={styles.currentAmount}>
                  {formatCurrency(goal.currentAmount)}
                </Text>
                <Text style={styles.targetAmount}>
                  {formatCurrency(goal.targetAmount)}
                </Text>
              </View>
              <Text style={[styles.progressPercent, { color: timeHorizonColor }]}>
                {progress.toFixed(1)}% Complete! Save today!
              </Text>
            </View>

            <View style={styles.contributeButtonRow}>
              <Text style={styles.contributeText}>Save & Contribute Now</Text>
              <ArrowRight size={24} color={Colors.surface} />
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};


// --- 3. MAIN SCREEN COMPONENT ---

const GoalsScreen = observer(() => {
  const { goals } = rootStore;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Use the real MobX action
  const handleContribute = (goalId: string, amount: number) => {
    rootStore.contributeToGoal(goalId, amount);

    setModalVisible(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleOpenModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };


  const getTimeHorizonLabel = (horizon: string) => {
    switch (horizon) {
      case 'short':
        return 'Short-Term (1-3 yrs)';
      case 'medium':
        return 'Medium-Term (3-10 yrs)';
      case 'long':
        return 'Long-Term (10+ yrs)';
      default:
        return '';
    }
  };

  const getTimeHorizonColor = (horizon: string) => {
    switch (horizon) {
      // Using consistent, vibrant colors for categorization
      case 'short':
        return Colors.accent; // Yellow/Gold
      case 'medium':
        return Colors.secondary; // Teal
      case 'long':
        return Colors.purple; // Purple
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      {/* --- SUCCESS ANIMATION --- */}
      {showSuccess && (
        <Animated.View
          entering={FadeIn.springify()}
          exiting={FadeOut.duration(500)}
          style={styles.successMessage}
        >
          <CheckCircle size={24} color={Colors.surface} />
          <Text style={styles.successText}>Success! You prioritized saving over spending! 🎉</Text>
        </Animated.View>
      )}

      <LinearGradient
        // Using a vibrant header gradient
        colors={[Colors.purple, Colors.pink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Your Financial Goals</Text>
            <Text style={styles.headerSubtitle}>
              You have **{goals.length}** dreams to fund!
            </Text>
          </View>
          <Pressable
            style={styles.headerIcon}
            onPress={() => router.push('/create-goal')}
          >
            <Plus size={28} color={Colors.surface} />
          </Pressable>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {goals.map((goal: any) => (
          <AnimatedGoalCard
            key={goal.id}
            goal={goal}
            onPressContribute={handleOpenModal}
            timeHorizonColor={getTimeHorizonColor(goal.timeHorizon)}
            getTimeHorizonLabel={getTimeHorizonLabel}
          />
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🛑 Stop & Think</Text>
          <Text style={styles.infoText}>
            Every purchase is a **choice**. Does that coffee or impulse buy get you closer to your **{goals[0]?.title || 'goal'}**? Prioritize your future self!
          </Text>
        </View>
      </ScrollView>

      <ContributionModal
        visible={modalVisible}
        goal={selectedGoal}
        onClose={handleCloseModal}
        onContribute={handleContribute}
      />
    </View>
  );
});

export default GoalsScreen;

// --- STYLES (Updated for Consistency and Interactivity) ---

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
    color: Colors.surface,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600' as const,
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
  goalContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  goalCard: {
    height: 380, // Slightly taller for more presence
    borderRadius: 24,
    overflow: 'hidden' as const,
    backgroundColor: Colors.surface,
    shadowColor: Colors.shadowStrong,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 10,
  },
  goalImage: {
    width: '100%',
    height: '100%',
    position: 'absolute' as const,
  },
  goalOverlay: {
    flex: 1,
    justifyContent: 'space-between' as const,
    padding: 24,
  },
  goalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
  },
  timeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '800' as const,
  },
  goalTitle: {
    fontSize: 30,
    fontWeight: '900' as const,
    color: Colors.surface,
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '500' as const,
  },
  progressSection: {
    gap: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  amountRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  currentAmount: {
    fontSize: 28,
    fontWeight: '900' as const,
    color: Colors.surface,
  },
  targetAmount: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700' as const,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '800' as const,
  },
  contributeButtonRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 10,
    marginTop: 5,
  },
  contributeText: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.secondaryLight, // Vivid color for action
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 5,
    borderLeftColor: Colors.warning,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  successMessage: {
    position: 'absolute' as const,
    top: 50,
    alignSelf: 'center' as const,
    zIndex: 100,
    backgroundColor: Colors.success,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    shadowColor: Colors.shadowStrong,
    shadowOpacity: 0.5,
  },
  successText: {
    marginLeft: 8,
    color: Colors.surface,
    fontWeight: '600' as const,
  }
});


const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.overlay
  },
  modalView: {
    width: '90%',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 25,
    alignItems: "center" as const,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute' as const,
    top: 15,
    right: 15,
    padding: 5,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.success,
    textAlign: 'center' as const,
    marginBottom: 20,
    fontWeight: '600' as const,
  },
  inputLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    alignSelf: 'flex-start' as const,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center' as const,
  },
  buttonText: {
    color: Colors.surface,
    fontWeight: '800' as const,
    fontSize: 18,
  }
});