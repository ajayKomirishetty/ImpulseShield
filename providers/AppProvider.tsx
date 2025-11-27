import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal, Transaction, Nudge } from '@/types';
import { MOCK_GOALS, MOCK_TRANSACTIONS, ETF_DATABASE } from '@/mocks/data';

export const [AppProvider, useApp] = createContextHook(() => {
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [nudges] = useState<Nudge[]>([]);
  const [streakDays, setStreakDays] = useState<number>(12);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem('goals');
      const storedStreak = await AsyncStorage.getItem('streakDays');
      
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
      if (storedStreak) {
        setStreakDays(parseInt(storedStreak, 10));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveGoals = async (newGoals: Goal[]) => {
    try {
      await AsyncStorage.setItem('goals', JSON.stringify(newGoals));
      setGoals(newGoals);
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    saveGoals([...goals, newGoal]);
  };

  const updateGoalProgress = (goalId: string, amount: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          currentAmount: goal.currentAmount + amount,
        };
      }
      return goal;
    });
    saveGoals(updatedGoals);
  };

  const getETFRecommendation = (goal: Goal) => {
    switch (goal.timeHorizon) {
      case 'short':
        return ETF_DATABASE.SGOV;
      case 'medium':
        return goal.category === 'home' ? ETF_DATABASE.SCHD : ETF_DATABASE.VTI;
      case 'long':
        return goal.category === 'retirement' ? ETF_DATABASE.VOO : ETF_DATABASE.QQQ;
      default:
        return ETF_DATABASE.VTI;
    }
  };

  const handleTransactionNudge = (transaction: Transaction, action: 'invested' | 'ignored') => {
    const primaryGoal = goals[0];
    
    if (action === 'invested' && primaryGoal) {
      updateGoalProgress(primaryGoal.id, transaction.amount);
      
      const updatedTransactions = transactions.map(t =>
        t.id === transaction.id ? { ...t, status: 'diverted' as const } : t
      );
      setTransactions(updatedTransactions);

      if (Math.random() > 0.3) {
        setStreakDays(prev => {
          const newStreak = prev + 1;
          AsyncStorage.setItem('streakDays', newStreak.toString());
          return newStreak;
        });
      }
    } else {
      const updatedTransactions = transactions.map(t =>
        t.id === transaction.id ? { ...t, status: 'spent' as const } : t
      );
      setTransactions(updatedTransactions);
    }
  };

  const totalInvested = useMemo(() => {
    return goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  }, [goals]);

  const totalSaved = useMemo(() => {
    return transactions
      .filter(t => t.status === 'diverted')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  return {
    goals,
    addGoal,
    updateGoalProgress,
    transactions,
    nudges,
    streakDays,
    handleTransactionNudge,
    getETFRecommendation,
    totalInvested,
    totalSaved,
  };
});
