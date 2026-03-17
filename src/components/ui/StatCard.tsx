import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  trendText?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  isCurrency?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trendText,
  trendDirection,
  isCurrency = true,
}) => {
  // Determine value color
  let valueColor = 'text-[var(--color-text-primary)]';
  if (value < 0) valueColor = 'text-[var(--color-danger)]';
  else if (value > 0 && label.toLowerCase().includes('savings')) valueColor = 'text-[var(--color-success)]';
  else if (label.toLowerCase().includes('income')) valueColor = 'text-[var(--color-success)]';

  // Format currency
  const formattedValue = isCurrency
    ? `₹ ${Math.abs(value).toLocaleString('en-IN')}`
    : value.toLocaleString('en-IN');
    
  const prefix = value < 0 && isCurrency ? '- ' : '';

  // Trend color
  let trendColor = 'text-[var(--color-text-secondary)]';
  if (trendDirection === 'up') trendColor = 'text-[var(--color-warning)]'; // or success depending on context
  if (trendDirection === 'up' && label.toLowerCase().includes('savings')) trendColor = 'text-[var(--color-success)]';
  if (trendDirection === 'up' && label.toLowerCase().includes('income')) trendColor = 'text-[var(--color-success)]';
  if (trendDirection === 'down' && label.toLowerCase().includes('expense')) trendColor = 'text-[var(--color-success)]'; // down expense is good
  if (trendDirection === 'down' && !label.toLowerCase().includes('expense')) trendColor = 'text-[var(--color-danger)]'; 

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-[var(--space-4)] flex flex-col gap-[var(--space-2)] transition-transform duration-[var(--duration-fast)] ease-[var(--ease-snap)] hover:-translate-y-[2px] hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] hover:border-[var(--color-accent-subtle)]">
      <div className="flex items-center gap-[var(--space-2)] text-[var(--color-text-secondary)] text-[var(--text-xs)] uppercase tracking-[0.06em]">
        <div className="text-[var(--color-accent)]">{icon}</div>
        <span>{label}</span>
      </div>
      
      <div className={`font-mono font-bold text-[var(--text-2xl)] tabular-nums ${valueColor}`}>
        {prefix}{formattedValue}
      </div>
      
      {trendText && (
        <div className={`font-mono text-[var(--text-xs)] ${trendColor}`}>
          {trendText}
        </div>
      )}
    </div>
  );
};
