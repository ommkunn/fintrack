import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { AddTransactionModal } from '../components/features/AddTransactionModal';
import { RecentTransactions } from '../components/features/RecentTransactions';
import { CategoryDonutChart } from '../components/features/CategoryDonutChart';
import { DailySpendBarChart } from '../components/features/DailySpendBarChart';
import { CalendarHeatmap } from '../components/features/CalendarHeatmap';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  PiggyBank, 
  Target,
  DownloadSimple
} from '@phosphor-icons/react';

export const Dashboard = () => {
  const { state: { transactions, savingsGoals }, getMonthlySummary } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Use current month
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const { totalIncome, totalExpenses, netSavings } = getMonthlySummary(currentMonthStr);
  const targetAmount = savingsGoals[currentMonthStr] || 0;
  
  const handleExportCSV = () => {
    const monthlyDocs = transactions.filter(t => t.date.startsWith(currentMonthStr));
    if (monthlyDocs.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Type,Category,Description,Amount,Currency,Payment Mode\n";
    
    monthlyDocs.forEach(row => {
      const line = `${row.date},${row.type},"${row.category}","${row.description.replace(/"/g, '""')}",${row.amount},${row.currency},${row.payment_mode || ''}`;
      csvContent += line + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FinTrack_Report_${currentMonthStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const savedPercent = targetAmount > 0 ? Math.min(Math.round((netSavings / targetAmount) * 100), 100) : 0;
  // Fallback visual rendering of the progress bar using unicode characters as depicted in SRS
  const filledBlocks = Math.floor(savedPercent / 10);
  const emptyBlocks = 10 - filledBlocks;
  const progressBarAscii = "█".repeat(Math.max(0, filledBlocks)) + "░".repeat(Math.max(0, emptyBlocks));

  return (
    <div className="flex flex-col gap-[var(--space-8)] animate-in fade-in duration-[var(--duration-base)]">
        
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[var(--space-4)]">
        <div>
          <h1 className="text-[var(--text-xl)] font-bold text-[var(--color-text-primary)] font-mono">
             Overview
          </h1>
          <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] font-mono">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="w-full sm:w-auto mt-[var(--space-2)] sm:mt-0 flex gap-2">
          <Button variant="secondary" onClick={handleExportCSV} className="w-full sm:w-auto flex items-center gap-2" title="Export as CSV">
            <DownloadSimple size={18} />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
            + Add Transaction
          </Button>
        </div>
      </div>

      {/* KPI Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-4)]">
        <StatCard 
          label="Income" 
          value={totalIncome} 
          icon={<ArrowDownRight size={24} color="var(--color-success)" />} 
        />
        <StatCard 
          label="Expenses" 
          value={-totalExpenses} 
          icon={<ArrowUpRight size={24} color="var(--color-danger)" />} 
        />
        <StatCard 
          label="Savings" 
          value={netSavings} 
          icon={<PiggyBank size={24} color="var(--color-accent)" />} 
        />
        
        {/* Goal Card - custom format */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-[var(--space-4)] flex flex-col gap-[var(--space-2)] transition-transform duration-[var(--duration-fast)] hover:-translate-y-[2px] hover:shadow-sm">
          <div className="flex items-center gap-[var(--space-2)] text-[var(--color-text-secondary)] text-[var(--text-xs)] uppercase tracking-[0.06em]">
            <Target size={24} color="var(--color-accent)" />
            <span>Savings Goal</span>
          </div>
          <div className="font-mono text-[var(--text-2xl)] font-bold text-[var(--color-text-primary)] mt-1 tracking-widest">
            {progressBarAscii} <span className="text-[var(--text-sm)] tracking-normal">{savedPercent}%</span>
          </div>
          <div className="font-mono text-[var(--text-xs)] text-[var(--color-text-secondary)]">
             Target: ₹ {targetAmount.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-[var(--space-6)] items-start">
        
        {/* Left Column (60% Desktop) */}
        <div className="lg:col-span-3 flex flex-col gap-[var(--space-6)]">
          <CalendarHeatmap />
          <RecentTransactions />
        </div>
        
        {/* Right Column (40% Desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-[var(--space-6)]">
           <CategoryDonutChart />
           <DailySpendBarChart />
        </div>

      </div>

      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};
