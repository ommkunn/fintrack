import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, Cell } from 'recharts';

export const DailySpendBarChart: React.FC = () => {
  const { state: { transactions } } = useFinance();
  
  const currentMonthStr = new Date().toISOString().substring(0, 7);

  const data = useMemo(() => {
    // Generate empty buckets for all days in the current month
    const year = parseInt(currentMonthStr.split('-')[0]);
    const month = parseInt(currentMonthStr.split('-')[1]);
    const daysInMonth = new Date(year, month, 0).getDate();
    
    const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      amount: 0,
      isHighSpend: false,
    }));

    // Fill buckets with expense data
    transactions.forEach(tx => {
       if (tx.type === 'expense' && tx.date.startsWith(currentMonthStr)) {
           const day = parseInt(tx.date.split('-')[2]);
           if (day >= 1 && day <= daysInMonth) {
              dailyData[day - 1].amount += tx.amount;
           }
       }
    });

    // Determine high spend days (e.g., top 15% of spending days, or simply > average * 1.5)
    let totalSpend = 0;
    let daysWithSpend = 0;
    dailyData.forEach(d => {
      if (d.amount > 0) {
        totalSpend += d.amount;
        daysWithSpend++;
      }
    });
    
    const avgSpend = daysWithSpend > 0 ? totalSpend / daysWithSpend : 0;
    const highSpendThreshold = avgSpend * 1.5;

    return dailyData.map(d => ({
      ...d,
      isHighSpend: d.amount > highSpendThreshold && d.amount > 0
    }));

  }, [transactions, currentMonthStr]);

  if (transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonthStr)).length === 0) {
      return (
        <div className="flex flex-col gap-[var(--space-4)] h-full">
          <h2 className="font-mono text-[var(--text-lg)] font-bold text-[var(--color-text-primary)]">Daily Spend</h2>
          <div className="flex-1 flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8">
              <span className="text-[var(--color-text-secondary)] font-mono text-[var(--text-sm)]">No expenses this month.</span>
          </div>
        </div>
      )
  }

  return (
    <div className="flex flex-col gap-[var(--space-4)] h-full">
      <h2 className="font-mono text-[var(--text-lg)] font-bold text-[var(--color-text-primary)]">Daily Spend</h2>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-[var(--space-4)] pt-[var(--space-6)] h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              tickFormatter={(val) => val % 5 === 0 || val === 1 ? val.toString() : ''} // Only show some ticks
              dy={10}
            />
            <Tooltip
              cursor={{ fill: 'var(--color-surface-raised)' }}
              formatter={(value: any) => [`₹ ${value.toLocaleString('en-IN')}`, 'Spent']}
              labelFormatter={(label) => `${label} ${new Date(parseInt(currentMonthStr.split('-')[0]), parseInt(currentMonthStr.split('-')[1])-1).toLocaleString('default', { month: 'short' })}`}
              contentStyle={{ 
                backgroundColor: 'var(--color-surface-raised)',
                borderColor: 'var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-mono)',
              }}
              itemStyle={{ color: 'var(--color-text-primary)' }}
              labelStyle={{ color: 'var(--color-text-secondary)', marginBottom: '4px' }}
            />
            <Bar 
              dataKey="amount" 
              radius={[4, 4, 0, 0]}
              animationBegin={0}
              animationDuration={600}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.amount === 0 ? 'transparent' : entry.isHighSpend ? 'var(--color-danger)' : 'var(--color-accent)'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
