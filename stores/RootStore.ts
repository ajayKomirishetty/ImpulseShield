import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/colors';

export interface Investment {
    name: string;
    ticker: string;
    value: number;
    gainPercent: number;
    isPositive: boolean;
    goalId: string;
}

export interface Goal {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    targetAmount: number;
    currentAmount: number;
    timeHorizon: 'short' | 'medium' | 'long';
}

export interface PerformancePoint {
    date: string;
    portfolioValue: number;
}

export class RootStore {
    portfolio: Investment[] = [];
    goals: Goal[] = [];
    performanceData: PerformancePoint[] = [];

    summaryMetrics = {
        dayChange: 550.80,
        dayChangePercent: 0.97,
    };

    constructor() {
        makeAutoObservable(this);

        makePersistable(this, {
            name: 'RootStore',
            properties: ['portfolio', 'goals', 'performanceData'],
            storage: AsyncStorage,
        }).then(() => {
            // After hydration, if the store is empty, initialize with mock data
            if (this.portfolio.length === 0) {
                this.initializeWithMockData();
            }
        });
    }

    // Use an action to initialize data
    initializeWithMockData() {
        runInAction(() => {
            this.portfolio = [
                { name: 'Total Market ETF (VTI)', ticker: 'VTI', value: 15430.50, gainPercent: 1.25, isPositive: true, goalId: 'g1' },
                { name: 'S&P 500 Fund (VOO)', ticker: 'VOO', value: 24500.80, gainPercent: -0.45, isPositive: false, goalId: 'g1' },
                { name: 'International Bonds (BNDX)', ticker: 'BNDX', value: 5000.00, gainPercent: 0.02, isPositive: true, goalId: 'g2' },
                { name: 'Technology Sector (QQQ)', ticker: 'QQQ', value: 12100.20, gainPercent: 2.15, isPositive: true, goalId: 'g3' },
            ];
            this.goals = [
                { id: 'g1', title: 'New Home Down Payment', description: 'Saving for a bigger place.', imageUrl: 'https://picsum.photos/id/10/800/600', targetAmount: 50000, currentAmount: 35000, timeHorizon: 'medium' },
                { id: 'g2', title: 'Dream Car Fund', description: 'Putting aside money monthly.', imageUrl: 'https://picsum.photos/id/19/800/600', targetAmount: 15000, currentAmount: 8000, timeHorizon: 'short' },
                { id: 'g3', title: 'Retirement Freedom', description: 'Long-term investment.', imageUrl: 'https://picsum.photos/id/21/800/600', targetAmount: 1000000, currentAmount: 450000, timeHorizon: 'long' },
            ];
            this.performanceData = [
                { portfolioValue: 43500, date: 'Nov 1' },
                { portfolioValue: 44000, date: 'Nov 5' },
                { portfolioValue: 44500, date: 'Nov 10' },
                { portfolioValue: 45000, date: 'Nov 15' },
                { portfolioValue: 45500, date: 'Nov 20' },
                { portfolioValue: 46000, date: 'Nov 25' },
            ];
        });
    }

    // --- COMPUTED VALUES ---
    get totalInvestmentsValue() {
        return this.portfolio.reduce((sum, item) => sum + item.value, 0);
    }

    get totalGoalsValue() {
        return this.goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    }

    get totalSavings() {
        return this.totalInvestmentsValue + this.totalGoalsValue;
    }

    get allocationData() {
        return [
            { key: 1, amount: 15430.50, color: Colors.purple, label: 'VTI', percentage: 27 },
            { key: 2, amount: 24500.80, color: Colors.pink, label: 'VOO', percentage: 43 },
            { key: 3, amount: 5000.00, color: Colors.teal, label: 'BNDX', percentage: 9 },
            { key: 4, amount: 12100.20, color: Colors.orange, label: 'QQQ', percentage: 21 },
        ];
    }

    // --- ACTIONS ---
    contributeToGoal(goalId: string, amount: number) {
        const goal = this.goals.find(g => g.id === goalId);
        if (goal) {
            runInAction(() => {
                goal.currentAmount += amount;
                console.log(`Contributed $${amount} to ${goal.title}. New amount: ${goal.currentAmount}`);
            });
        }
    }

    buyStock(symbol: string, amount: number, name: string) {
        runInAction(() => {
            const existingInvestment = this.portfolio.find(i => i.ticker === symbol);
            if (existingInvestment) {
                existingInvestment.value += amount;
            } else {
                this.portfolio.push({
                    name: name,
                    ticker: symbol,
                    value: amount,
                    gainPercent: 0,
                    isPositive: true,
                    goalId: 'general_investing'
                });
            }
            // Add a mock "jump" in performance data for the chart
            const lastPoint = this.performanceData[this.performanceData.length - 1];
            if (lastPoint) {
                this.performanceData.push({
                    date: 'Now',
                    portfolioValue: lastPoint.portfolioValue + amount
                });
            }
        });
    }

    getSavingsBreakdownData() {
        // Calculate total investments
        const investmentsTotal = this.totalInvestmentsValue;

        // Calculate total goals
        const goalsTotal = this.totalGoalsValue;

        // Calculate percentages for text labels if needed (optional)
        const total = investmentsTotal + goalsTotal;
        const investPercent = total > 0 ? Math.round((investmentsTotal / total) * 100) : 0;
        const goalsPercent = total > 0 ? Math.round((goalsTotal / total) * 100) : 0;

        return [
            {
                value: investmentsTotal,
                color: Colors.purple, // Using primary/purple for investments
                text: `${investPercent}%`,
                label: 'Investments',
            },
            {
                value: goalsTotal,
                color: Colors.pink, // Using secondary/pink for goals
                text: `${goalsPercent}%`,
                label: 'Goals',
            },
        ];
    }

    // For cleanup if needed
    stopStorePersistence() {
        stopPersisting(this);
    }
}

export const rootStore = new RootStore();