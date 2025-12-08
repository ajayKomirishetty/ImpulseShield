// GoalStore.ts (Renamed to Store.ts for broader scope)
import { makeAutoObservable, action, computed } from 'mobx';

// --- INTERFACES (Matching your component expectations) ---
interface Investment {
  name: string;
  ticker: string;
  value: number;
  quantity: number;
  gainLoss: number;
  gainPercent: number;
  isPositive: boolean;
  goalId: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  timeHorizon: 'short' | 'medium' | 'long';
}

interface Transaction {
  id: number;
  symbol: string;
  description: string;
  type: 'buy' | 'dividend' | 'contribution';
  amount: number;
  quantity: number;
  date: string;
}

interface PerformancePoint {
    date: string;
    portfolioValue: number;
    benchmark: number;
}

interface Allocation {
    name: string;
    percentage: number;
    value: number;
}


// --- INITIAL GLOBAL DATA ---
const INITIAL_PORTFOLIO: Investment[] = [
  { name: 'Vanguard S&P 500 ETF', ticker: 'VOO', value: 12456.78, quantity: 28.4521, gainLoss: 1290.50, gainPercent: 11.67, isPositive: true, goalId: 'g1' },
  { name: 'Vanguard Total Stock Market ETF', ticker: 'VTI', value: 10234.56, quantity: 45.2341, gainLoss: 1267.43, gainPercent: 14.23, isPositive: true, goalId: 'g1' },
  // This SGOV holding will act as the "Cash" reserve used for new contributions
  { name: 'iShares 0-3 Month Treasury Bond ETF (Cash)', ticker: 'SGOV', value: 9876.54, quantity: 98.7654, gainLoss: 200.00, gainPercent: 2.15, isPositive: true, goalId: 'g2' },
  { name: 'Vanguard Total Stock Market Index Fund', ticker: 'VTSAX', value: 8765.43, quantity: 32.8785, gainLoss: 1350.00, gainPercent: 18.45, isPositive: true, goalId: 'g3' },
];

const INITIAL_GOALS: Goal[] = [
    { id: 'g1', title: 'House Down Payment', description: 'Saving for a bigger place.', targetAmount: 50000, currentAmount: 22691.34, timeHorizon: 'medium' },
    { id: 'g2', title: 'Emergency Fund', description: 'Immediate liquidity.', targetAmount: 15000, currentAmount: 11111.10, timeHorizon: 'short' },
    { id: 'g3', title: 'Early Retirement', description: 'Long-term investment.', targetAmount: 1000000, currentAmount: 8765.43, timeHorizon: 'long' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
    { id: 1, symbol: 'VTI', description: 'Purchase', type: 'buy', amount: 125.50, quantity: 0.5234, date: '11/25/2025' },
    { id: 2, symbol: 'VOO', description: 'Contribution', type: 'contribution', amount: 500.00, quantity: 1.2345, date: '11/24/2025' },
];

const INITIAL_PERFORMANCE_DATA: PerformancePoint[] = [
    { date: 'Nov 1', portfolioValue: 43500, benchmark: 44000 },
    { date: 'Nov 5', portfolioValue: 44000, benchmark: 44200 },
    { date: 'Nov 10', portfolioValue: 44500, benchmark: 44400 },
    { date: 'Nov 15', portfolioValue: 45000, benchmark: 44700 },
    { date: 'Nov 20', portfolioValue: 45500, benchmark: 45000 },
    { date: 'Nov 25', portfolioValue: 46000, benchmark: 45500 },
];


class PortfolioStore {
    portfolio: Investment[] = INITIAL_PORTFOLIO;
    goals: Goal[] = INITIAL_GOALS;
    transactions: Transaction[] = INITIAL_TRANSACTIONS;
    performanceData: PerformancePoint[] = INITIAL_PERFORMANCE_DATA;

    constructor() {
        makeAutoObservable(this);
    }

    // --- COMPUTED VALUES ---
    @computed
    get totalPortfolioValue(): number {
        return this.portfolio.reduce((sum, i) => sum + i.value, 0);
    }
    
    @computed
    get summaryMetrics() {
        const totalV = this.totalPortfolioValue;
        const totalG = this.portfolio.reduce((sum, i) => sum + i.gainLoss, 0);
        const initialInvestment = totalV - totalG;
        const totalGP = initialInvestment > 0 ? (totalG / initialInvestment) * 100 : 0;
        
        // Mocking daily change (assuming 0.12% gain for today)
        const dayCP = 0.12; 
        const dayC = totalV * (dayCP / 100);

        return {
            totalValue: totalV,
            totalGain: totalG,
            totalGainPercent: totalGP,
            dayChange: dayC,
            dayChangePercent: dayCP,
        };
    }
    
    @computed
    get allocationData(): Allocation[] {
        // Calculate the real-time allocation based on current portfolio values
        const total = this.totalPortfolioValue;
        
        // Group holdings by a simplified category for the chart
        const categoryMap = {
            VOO: 'US Stocks', VTI: 'US Stocks', VTSAX: 'US Stocks', SGOV: 'Cash'
        };

        const grouped = this.portfolio.reduce((acc, item) => {
            const category = categoryMap[item.ticker as keyof typeof categoryMap] || 'Other';
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += item.value;
            return acc;
        }, {} as Record<string, number>);

        // Convert grouped data into the required Allocation[] format
        return Object.entries(grouped).map(([name, value]) => ({
            name,
            value,
            percentage: (value / total) * 100,
        }));
    }

    // --- ACTIONS (Mutability is key to MobX) ---
    @action
    contribute(goalId: string, amount: number) {
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        // 1. Update the Goal's currentAmount
        const goal = this.goals.find(g => g.id === goalId);
        if (goal) {
            goal.currentAmount += amount;
        }

        // 2. Update the Portfolio (e.g., increase the cash/SGOV reserve)
        const cashHolding = this.portfolio.find(i => i.ticker === 'SGOV');
        if (cashHolding) {
            cashHolding.value += amount;
            cashHolding.quantity += (amount / 10); // Mock quantity change
        }

        // 3. Log the Transaction
        const newTransaction: Transaction = {
            id: this.transactions.length + 1,
            symbol: goal?.title || 'Contribution',
            description: `Manual contribution to ${goal?.title || 'General Fund'}`,
            type: 'contribution',
            amount: amount,
            quantity: 0,
            date: today,
        };
        this.transactions.unshift(newTransaction); // Add to the start
        
        // 4. Update the Performance Graph's last data point
        const lastIndex = this.performanceData.length - 1;
        this.performanceData[lastIndex].portfolioValue = this.totalPortfolioValue;
    }
}

export const portfolioStore = new PortfolioStore(); 
// In a real app, you would wrap this instance in a React Context and use a custom hook.

// --- Mocking the MobX Hook (Replace with actual MobX context hook) ---
export const useMobxStore = () => portfolioStore;