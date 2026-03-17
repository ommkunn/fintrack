import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';

export const CalendarHeatmap: React.FC = () => {
    const { state: { transactions } } = useFinance();
    const currentMonthStr = new Date().toISOString().substring(0, 7);

    const { days, blanks, maxSpend } = useMemo(() => {
        const year = parseInt(currentMonthStr.split('-')[0]);
        const month = parseInt(currentMonthStr.split('-')[1]);
        const daysInMonth = new Date(year, month, 0).getDate();
        
        // 0 = Sun, 1 = Mon ...
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
        const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
        
        const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            amount: 0,
        }));

        let maxSpend = 0;
        
        transactions.forEach(tx => {
            if (tx.type === 'expense' && tx.date.startsWith(currentMonthStr)) {
                const day = parseInt(tx.date.split('-')[2]);
                if (day >= 1 && day <= daysInMonth) {
                    dailyData[day - 1].amount += tx.amount;
                    if (dailyData[day-1].amount > maxSpend) {
                        maxSpend = dailyData[day-1].amount;
                    }
                }
            }
        });

        return { days: dailyData, blanks, maxSpend };
    }, [transactions, currentMonthStr]);

    const getIntensityClass = (amount: number) => {
        if (amount === 0) return 'bg-[#2A2A2A]'; // default dark block for obsidian theme
        // Calculate intensity based on max spend
        const ratio = amount / maxSpend;
        if (ratio > 0.75) return 'bg-[var(--color-danger)] outline outline-2 outline-[var(--color-danger)]/50 outline-offset-1 z-10'; // Highest 
        if (ratio > 0.5) return 'bg-[#DC2626]/80'; // Medium high
        if (ratio > 0.25) return 'bg-[#EF4444]/60'; // Medium
        return 'bg-[#FCA5A5]/40'; // Low
    };

    return (
        <div className="flex flex-col gap-[var(--space-4)] h-full">
            <h2 className="font-mono text-[var(--text-lg)] font-bold text-[var(--color-text-primary)]">Activity Heatmap</h2>
            
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-[var(--space-4)] flex-1 flex flex-col justify-center">
                
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-center text-[10px] sm:text-[var(--text-xs)] font-mono text-[var(--color-text-secondary)]">
                            {day}
                        </div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {blanks.map(b => (
                        <div key={`blank-${b}`} className="aspect-square rounded-sm" />
                    ))}
                    
                    {days.map(d => (
                        <div 
                            key={`day-${d.day}`} 
                            className={`aspect-square rounded-[3px] sm:rounded-[4px] relative group transition-all duration-[var(--duration-instant)] ${getIntensityClass(d.amount)}`}
                        >
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-fast)] bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-[10px] font-mono py-1 px-2 rounded-[var(--radius-sm)] shadow-lg pointer-events-none whitespace-nowrap">
                                {d.day}: ₹ {d.amount}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-[var(--space-4)] flex items-center justify-end gap-2 text-[10px] font-mono text-[var(--color-text-secondary)]">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-[#2A2A2A]"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#FCA5A5]/40"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#EF4444]/60"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#DC2626]/80"></div>
                        <div className="w-3 h-3 rounded-sm bg-[var(--color-danger)]"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
};
