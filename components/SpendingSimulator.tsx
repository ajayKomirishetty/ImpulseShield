import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Pressable,
  Modal,
  Animated,
  Dimensions,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/providers/AppProvider'; // Keep for now if needed, or rely on RootStore
import { rootStore } from '@/stores/RootStore';

// Import refactored components
import ConfirmationScreen from './simulator/ConfirmationScreen';
import RegretScreen from './simulator/RegretScreen';
import CelebrationScreen from './simulator/CelebrationScreen';
import SavingsDestinationScreen from './simulator/SavingsDestinationScreen';
import InvestmentExplainerScreen from './simulator/InvestmentExplainerScreen';

const { width, height } = Dimensions.get('window');

// --- Interfaces ---

export interface SpendingScenario {
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
  const { goals } = rootStore;
  const [isVisible, setIsVisible] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<SpendingScenario | null>(null);

  // State for flow control
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRegret, setShowRegret] = useState(false);
  const [showGoalSelection, setShowGoalSelection] = useState(false);
  const [showInvestmentExplainer, setShowInvestmentExplainer] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
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

    // Shake animation logic for regret transition
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

    // Smooth transition to goal selection
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowGoalSelection(true);
    });
  };

  const handleGoalSelected = (goal: any) => {
    setSelectedGoal(goal);
    setShowGoalSelection(false);
    setShowInvestmentExplainer(true);
  };

  const handleInvestNow = () => {
    if (selectedGoal && currentScenario) {
      if (selectedGoal.type === 'stock') {
        rootStore.buyStock(selectedGoal.symbol, currentScenario.amount, selectedGoal.name);
      } else {
        // It's a goal
        rootStore.contributeToGoal(selectedGoal.id, currentScenario.amount);
      }
    }

    setShowInvestmentExplainer(false);

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
      setShowGoalSelection(false);
      setShowInvestmentExplainer(false);
      setShowCelebration(false);
      setCurrentScenario(null);
      setSelectedGoal(null);

      // Reset animations
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
            {showConfirmation && currentScenario && (
              <ConfirmationScreen
                scenario={currentScenario}
                onYes={handleYesSpending}
                onNo={handleNoSpending}
                shakeAnim={shakeAnim}
              />
            )}

            {showRegret && currentScenario && (
              <RegretScreen
                scenario={currentScenario}
                goalImpacts={calculateGoalImpact()}
                onClose={closeModal}
                slideAnim={slideAnim}
              />
            )}

            {showCelebration && currentScenario && (
              <CelebrationScreen
                scenario={currentScenario}
                onClose={closeModal}
                confettiAnim={confettiAnim}
                goal={selectedGoal}
              />
            )}

            {showGoalSelection && (
              <SavingsDestinationScreen
                goals={goals}
                onSelect={handleGoalSelected}
                onClose={closeModal}
              />
            )}

            {showInvestmentExplainer && selectedGoal && currentScenario && (
              <InvestmentExplainerScreen
                scenario={currentScenario}
                goal={selectedGoal}
                onInvest={handleInvestNow}
                onClose={closeModal}
              />
            )}
          </Animated.View>
        </BlurView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  simulatorButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  simulatorGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});
