import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Types
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  date: string;
  category: string;
  sub_category?: string;
  description: string;
  payment_mode?: string;
  created_at: string;
  user_id?: string;
}

export interface SavingsGoal {
  month: string; // YYYY-MM
  target_amount: number;
}

interface FinanceState {
  transactions: Transaction[];
  savingsGoals: Record<string, number>; // month -> target
  theme: 'default' | 'ember' | 'frost' | 'circuit' | 'void';
  isLoading: boolean;
}

interface FinanceContextType {
  state: FinanceState;
  addTransaction: (tx: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  editTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  setSavingsGoal: (month: string, amount: number) => Promise<void>;
  setTheme: (theme: FinanceState['theme']) => void;
  getMonthlySummary: (month: string) => {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    savingsRate: number;
    categoryBreakdown: Record<string, number>;
  };
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<FinanceState>({
    transactions: [],
    savingsGoals: {},
    theme: (localStorage.getItem('fintrack_theme') as any) || 'default',
    isLoading: true
  });

  // Sync Theme to document root
  useEffect(() => {
    localStorage.setItem('fintrack_theme', state.theme);
    if (state.theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', state.theme);
    }
  }, [state.theme]);

  // Fetch data from local storage when user logs in
  useEffect(() => {
    if (!user) {
      setState(prev => ({ ...prev, transactions: [], savingsGoals: {}, isLoading: false }));
      return;
    }

    try {
      const storedTx = localStorage.getItem('fintrack_transactions');
      const storedGoals = localStorage.getItem('fintrack_goals');
      
      const parsedTx: Transaction[] = storedTx ? JSON.parse(storedTx) : [];
      const parsedGoals: Record<string, number> = storedGoals ? JSON.parse(storedGoals) : {};

      setState(prev => ({
        ...prev,
        transactions: parsedTx.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
        savingsGoals: parsedGoals,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error fetching data from local storage:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user]);

  // Sync state changes to local storage
  useEffect(() => {
    if (!state.isLoading && user) {
      localStorage.setItem('fintrack_transactions', JSON.stringify(state.transactions));
      localStorage.setItem('fintrack_goals', JSON.stringify(state.savingsGoals));
    }
  }, [state.transactions, state.savingsGoals, state.isLoading, user]);

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return;
    
    const newTx: Transaction = {
      ...tx,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      user_id: user.name
    };
    
    setState(prev => ({
      ...prev,
      transactions: [newTx, ...prev.transactions].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }));
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    setState(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
  };

  const editTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!user) return;
    
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => 
        t.id === id ? { ...t, ...updates } : t
      ).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }));
  };

  const setSavingsGoal = async (month: string, amount: number) => {
    if (!user) return;
    setState(prev => ({ ...prev, savingsGoals: { ...prev.savingsGoals, [month]: amount } }));
  };

  const setTheme = (theme: FinanceState['theme']) => {
    setState(prev => ({ ...prev, theme }));
  };

  const getMonthlySummary = (month: string) => {
    const monthlyTx = state.transactions.filter(t => t.date.startsWith(month));
    
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryBreakdown: Record<string, number> = {};

    monthlyTx.forEach(t => {
      if (t.type === 'income') {
        totalIncome += Number(t.amount);
      } else {
        totalExpenses += Number(t.amount);
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + Number(t.amount);
      }
    });

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      categoryBreakdown
    };
  };

  return (
    <FinanceContext.Provider value={{
      state,
      addTransaction,
      deleteTransaction,
      editTransaction,
      setSavingsGoal,
      setTheme,
      getMonthlySummary
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
