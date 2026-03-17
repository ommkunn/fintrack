import React, { useState } from 'react';
import { useFinance, type Transaction } from '../context/FinanceContext';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Trash, MagnifyingGlass, PencilSimple } from '@phosphor-icons/react';
import { EditTransactionModal } from '../components/features/EditTransactionModal';

export const Transactions: React.FC = () => {
    const { state: { transactions }, deleteTransaction } = useFinance();
    const [search, setSearch] = useState('');
    const [editingTx, setEditingTx] = useState<Transaction | null>(null);

    const filteredTx = transactions.filter(tx => 
        tx.description.toLowerCase().includes(search.toLowerCase()) || 
        tx.category.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        {
          key: 'date',
          header: 'Date',
          render: (tx: Transaction) => (
            <span className="text-[var(--color-text-secondary)]">
              {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
            </span>
          )
        },
        {
          key: 'description',
          header: 'Description',
          render: (tx: Transaction) => (
            <span className="font-medium">
              {tx.description}
            </span>
          )
        },
        {
          key: 'category',
          header: 'Category',
          render: (tx: Transaction) => (
             <Badge variant="default">
               {tx.category}
             </Badge>
          )
        },
        {
            key: 'payment_mode',
            header: 'Mode',
            render: (tx: Transaction) => (
               <span className="text-[var(--color-text-secondary)]">
                   {tx.payment_mode || '-'}
               </span>
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
            <div className="flex gap-2 justify-center">
                <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setEditingTx(tx);
                }}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] p-2 rounded transition-colors"
                title="Edit Transaction"
                >
                <PencilSimple size={18} />
                </button>
                <button 
                onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Delete this transaction?")) {
                    deleteTransaction(tx.id);
                    }
                }}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] p-2 rounded transition-colors"
                title="Delete Transaction"
                >
                <Trash size={18} />
                </button>
            </div>
          )
        }
    ];

    return (
        <div className="flex flex-col gap-[var(--space-6)] animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[var(--space-4)]">
               <div>
                   <h1 className="text-[var(--text-xl)] font-bold text-[var(--color-text-primary)] font-mono">
                        Transactions
                   </h1>
                   <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] font-mono">
                       All your income and expenses in one place.
                   </p>
               </div>
               
               <div className="relative w-full sm:w-64">
                   <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                   <input
                       type="text"
                       placeholder="Search transactions..."
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       className="w-full pl-9 pr-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--text-sm)] font-mono focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
                   />
               </div>
            </div>

            <Table 
                columns={columns} 
                data={filteredTx}
                emptyMessage={search ? "No matches found." : "No transactions recorded."}
            />

            <EditTransactionModal 
                transaction={editingTx}
                onClose={() => setEditingTx(null)}
            />
        </div>
    );
};
