import React, { useMemo, useState } from 'react';
import { useFinance, type Transaction } from '../../context/FinanceContext';
import { Table } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Trash, PencilSimple } from '@phosphor-icons/react';
import { EditTransactionModal } from './EditTransactionModal';

export const RecentTransactions: React.FC = () => {
  const { state: { transactions }, deleteTransaction } = useFinance();
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const columns = useMemo(() => [
    {
      key: 'date',
      header: 'Date',
      render: (tx: Transaction) => (
        <span className="text-[var(--color-text-secondary)] whitespace-nowrap">
          {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
        </span>
      )
    },
    {
      key: 'description',
      header: 'Description',
      render: (tx: Transaction) => (
        <span className="truncate max-w-[150px] md:max-w-xs block" title={tx.description}>
          {tx.description}
        </span>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (tx: Transaction) => (
         <Badge variant="default" className="text-[10px] hidden sm:inline-flex">
           {tx.category.split(' ')[0]} {/* Show just the emoji and first word on mobile if needed, or full on desktop. Keeping it simple here. */}
           <span className="hidden md:inline ml-1">{tx.category.substring(tx.category.indexOf(' ') + 1)}</span>
         </Badge>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right' as const,
      render: (tx: Transaction) => {
        const isIncome = tx.type === 'income';
        return (
          <span className={`font-bold ${isIncome ? 'text-[var(--color-success)]' : 'text-[var(--color-text-primary)]'}`}>
            {isIncome ? '+ ' : '- '}₹ {tx.amount.toLocaleString('en-IN')}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: '',
      align: 'center' as const,
      render: (tx: Transaction) => (
        <div className="flex gap-1 justify-center">
            <button 
            onClick={(e) => {
                e.stopPropagation();
                setEditingTx(tx);
            }}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] p-1 rounded transition-colors"
            title="Edit Transaction"
            >
            <PencilSimple size={16} />
            </button>
            <button 
            onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Delete this transaction?")) {
                deleteTransaction(tx.id);
                }
            }}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] p-1 rounded transition-colors"
            title="Delete Transaction"
            >
            <Trash size={16} />
            </button>
        </div>
      )
    }
  ], [deleteTransaction]);

  // Show only top 5 recent ones for the dashboard
  const recentData = transactions.slice(0, 5);

  return (
    <div className="flex flex-col gap-[var(--space-4)] h-full">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-[var(--text-lg)] font-bold text-[var(--color-text-primary)]">
          Recent Transactions
        </h2>
        {transactions.length > 5 && (
          <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-[var(--text-sm)] transition-colors underline decoration-[var(--color-border)] underline-offset-4">
            View All
          </button>
        )}
      </div>
      
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-sm flex-1 overflow-x-auto">
        <Table 
          columns={columns} 
          data={recentData} 
          emptyMessage="No transactions yet. Add one to get started!"
        />
      </div>

      <EditTransactionModal 
        transaction={editingTx}
        onClose={() => setEditingTx(null)}
      />
    </div>
  );
};
