import React, { useState, useEffect } from 'react';
import { useFinance, type Transaction } from '../../context/FinanceContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DEFAULT_CATEGORIES } from '../../utils/constants';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ 
  transaction, 
  onClose
}) => {
  const { editTransaction } = useFinance();
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  
  // Update local state when transaction prop changes
  useEffect(() => {
    if (transaction) {
      setDate(transaction.date);
      setCategory(transaction.category);
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !category) return;

    editTransaction(transaction.id, {
      date,
      category
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-[var(--space-4)]">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] w-full max-w-[400px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-[var(--duration-base)]">
        
        <div className="flex w-full border-b border-[var(--color-border)] p-[var(--space-4)]">
           <h2 className="font-mono text-[var(--text-lg)] font-bold text-[var(--color-text-primary)]">
              Edit Transaction
           </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-[var(--space-6)] flex flex-col gap-[var(--space-5)]">
          <div className="flex flex-col gap-[var(--space-2)]">
            <span className="text-[var(--text-sm)] font-mono text-[var(--color-text-secondary)]">Amount (Not Editable)</span>
            <div className={`font-mono text-[var(--text-xl)] font-bold ${transaction.type === 'expense' ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'}`}>
              ₹ {transaction.amount.toLocaleString('en-IN')}
            </div>
          </div>

          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="flex flex-col gap-[var(--space-2)] w-full">
            <label className="text-[var(--text-sm)] font-mono text-[var(--color-text-secondary)]">
              {transaction.type === 'expense' ? 'Category' : 'Source'}
            </label>
             {transaction.type === 'expense' ? (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] py-[var(--space-3)] px-[var(--space-4)] text-[var(--color-text-primary)] font-mono text-[var(--text-base)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors appearance-none"
                >
                  {DEFAULT_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
             ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] py-[var(--space-3)] px-[var(--space-4)] text-[var(--color-text-primary)] font-mono text-[var(--text-base)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors appearance-none"
                >
                  <option value="Stipend">💼 Stipend</option>
                  <option value="Freelance">💻 Freelance</option>
                  <option value="Parents">👨‍👩‍👦 Parents</option>
                  <option value="Scholarship">🎓 Scholarship</option>
                  <option value="Other">✨ Other</option>
                </select>
             )}
          </div>

          <div className="flex gap-[var(--space-3)] pt-[var(--space-2)]">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};
