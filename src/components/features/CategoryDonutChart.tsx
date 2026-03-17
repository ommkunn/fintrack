import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Simple colors for the donut chart segments based on brand guidelines
const COLORS = ['#F97316', '#3B82F6', '#22C55E', '#A855F7', '#EAB308', '#EC4899', '#06B6D4', '#64748B'];

export const CategoryDonutChart: React.FC = () => {
  const { getMonthlySummary } = useFinance();
  
  // Use current month
  const currentMonth = new Date().toISOString().substring(0, 7);
  const { categoryBreakdown } = getMonthlySummary(currentMonth);

  const data = Object.keys(categoryBreakdown).map((key) => ({
    name: key.replace(/^[^\w\s]+/g, '').trim(), // Remove emojis for cleaner tooltip
    fullName: key,
    value: categoryBreakdown[key]
  })).sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="flex flex-col gap-[var(--space-4)] h-full">
        <h2 className="font-mono text-[var(--text-lg)] font-bold text-[var(--color-text-primary)]">Category Split</h2>
        <div className="flex-1 flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8">
            <span className="text-[var(--color-text-secondary)] font-mono text-[var(--text-sm)]">No expenses to chart yet.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[var(--space-4)] h-full">
      <h2 className="font-mono text-[var(--text-lg)] font-bold text-[var(--color-text-primary)]">Category Split</h2>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-[var(--space-4)] h-[300px] flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={400}
              animationEasing="ease-out"
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => `₹ ${value.toLocaleString('en-IN')}`}
              contentStyle={{ 
                backgroundColor: 'var(--color-surface-raised)',
                borderColor: 'var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-mono)',
              }}
              itemStyle={{ color: 'var(--color-text-primary)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[var(--color-text-secondary)] text-[var(--text-xs)] uppercase tracking-wider font-mono">Top Category</span>
          <span className="text-[var(--color-text-primary)] font-bold font-mono text-[var(--text-md)] truncate max-w-[120px] text-center">
            {data[0]?.name || '-'}
          </span>
        </div>
      </div>
    </div>
  );
};
