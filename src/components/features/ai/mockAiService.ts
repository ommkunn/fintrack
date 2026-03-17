import type { Transaction } from '../../../context/FinanceContext';

export const generateMockAIResponse = (
  query: string, 
  summary: any,
  _transactions: Transaction[],
  goal: number
): string => {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('where') && lowerQuery.includes('most')) {
    const topCat = Object.entries(summary.categoryBreakdown as Record<string, number>).sort(([,a], [,b]) => (b as number) - (a as number))[0];
    if (topCat) {
       return `You're spending the most on ${topCat[0]} at ₹${topCat[1].toLocaleString('en-IN')}. That's ${Math.round((topCat[1] as number / summary.totalExpenses) * 100)}% of your total spending this month!`;
    }
    return "You haven't spent anything yet this month.";
  }

  if (lowerQuery.includes('save') && lowerQuery.includes('more')) {
    const categories = Object.keys(summary.categoryBreakdown);
    if (categories.includes('🍿 Snacks & Junk')) {
        return "I noticed you spend quite a bit on Snacks & Junk. Cutting down cold drinks to 3x/week and grabbing snacks from the mess instead of the canteen could save you ~₹400/month.";
    }
    if (categories.includes('🍔 Food & Meals')) {
         return "Cooking at home or sticking to the mess for dinner twice a week could significantly lower your Food & Meal expenses.";
    }
    return "Try reviewing your smaller subscriptions. Sometimes those ₹99/mo charges add up quickly!";
  }

  if (lowerQuery.includes('goal') || lowerQuery.includes('track')) {
    if (goal === 0) return "You haven't set a goal for this month yet. Go to the Settings or Goals page to set one up!";
    
    if (summary.netSavings >= goal) {
        return `You've already hit your goal of ₹${goal.toLocaleString('en-IN')}! You've saved ₹${summary.netSavings.toLocaleString('en-IN')}. Great job!`;
    }
    
    const remaining = goal - summary.netSavings;
    const daysLeft = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();
    
    return `You have ₹${remaining.toLocaleString('en-IN')} left to save to hit your goal. With ${daysLeft} days left in the month, you need to save roughly ₹${Math.round(remaining / daysLeft)} per day. You can do it!`;
  }

  if (lowerQuery.includes('unnecessary') || lowerQuery.includes('biggest')) {
     return "Looking at your recent transactions, that 'Online Course Subscription' for ₹1500 was a big hit. Make sure you're actually taking the course! Also, frequent small chip purchases add up.";
  }

  // Fallback
  return "That's a good question! Right now your total savings this month sit at ₹" + summary.netSavings.toLocaleString('en-IN') + ". How else can I help you optimize your tracking?";
};
