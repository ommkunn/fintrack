import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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

  // Fetch data when user logs in
  useEffect(() => {
    if (!user) {
      setState(prev => ({ ...prev, transactions: [], savingsGoals: {}, isLoading: false }));
      return;
    }

    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        const [txResponse, goalsResponse] = await Promise.all([
          supabase.from('transactions').select('*').order('created_at', { ascending: false }),
          supabase.from('savings_goals').select('*')
        ]);

        if (txResponse.error) throw txResponse.error;
        if (goalsResponse.error) throw goalsResponse.error;

        const goals: Record<string, number> = {};
        goalsResponse.data.forEach(g => {
          goals[g.month] = Number(g.target_amount);
        });

        setState(prev => ({
          ...prev,
          transactions: txResponse.data,
          savingsGoals: goals,
          isLoading: false
        }));
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();
  }, [user]);

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...tx, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      return;
    }
    
    setState(prev => ({
      ...prev,
      transactions: [data, ...prev.transactions].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }));
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      console.error('Error deleting transaction:', error);
      return;
    }
    setState(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
  };

  const editTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!user) return;
    // Don't want to update user_id or id or created_at
    const safeUpdates = { ...updates };
    delete safeUpdates.id;
    delete safeUpdates.user_id;
    delete safeUpdates.created_at;

    const { data, error } = await supabase
      .from('transactions')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error editing transaction:', error);
      return;
    }

    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => 
        t.id === id ? data : t
      ).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }));
  };

  const setSavingsGoal = async (month: string, amount: number) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('savings_goals')
      .upsert(
        { user_id: user.id, month, target_amount: amount, currency: 'INR' },
        { onConflict: 'user_id, month' }
      );

    if (error) {
      console.error('Error setting savings goal:', error);
      return;
    }

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
