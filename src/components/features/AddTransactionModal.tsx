import React, { useState } from 'react';
import { useFinance, type TransactionType } from '../../context/FinanceContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DEFAULT_CATEGORIES } from '../../utils/constants';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: TransactionType;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ 
  isOpen, 
  onClose,
  initialType = 'expense'
}) => {
  const { addTransaction } = useFinance();
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0].name);
  const [source, setSource] = useState('Stipend'); // For income
  const [date, setDate] = useState(() => {
    const d = new Date();
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
  });
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    addTransaction({
      type,
      amount: Number(amount),
      currency: 'INR',
      date: date,
      category: type === 'expense' ? category : source,
      description,
      payment_mode: 'UPI', // Defaulting for simplicity for now
    });
    
    // Reset & Close
    setAmount('');
    setDescription('');
    setDate(() => {
        const d = new Date();
        return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-[var(--space-4)]">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] w-full max-w-[400px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-[var(--duration-base)]">
        
        {/* Header Tabs */}
        <div className="flex w-full border-b border-[var(--color-border)]">
          <button 
            type="button"
            className={`flex-1 py-[var(--space-4)] font-mono text-[var(--text-md)] font-bold transition-colors ${type === 'expense' ? 'text-[var(--color-danger)] border-b-2 border-[var(--color-danger)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)]'}`}
            onClick={() => setType('expense')}
          >
            Expense
          </button>
          <button 
            type="button"
            className={`flex-1 py-[var(--space-4)] font-mono text-[var(--text-md)] font-bold transition-colors ${type === 'income' ? 'text-[var(--color-success)] border-b-2 border-[var(--color-success)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)]'}`}
            onClick={() => setType('income')}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-[var(--space-6)] flex flex-col gap-[var(--space-5)]">
          
          <div className="flex flex-col gap-[var(--space-2)]">
            <label className="text-[var(--text-sm)] font-mono text-[var(--color-text-secondary)]">
              Amount
            </label>
            <div className="relative flex items-center w-full">
              <div className={`absolute left-[var(--space-4)] font-mono text-[var(--text-xl)] font-bold ${type === 'expense' ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'}`}>
                ₹
              </div>
              <input
                autoFocus
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`
                  w-full bg-transparent border border-[var(--color-border)] 
                  rounded-[var(--radius-md)] py-[var(--space-4)] px-[var(--space-4)] pl-[var(--space-10)]
                  font-mono text-[var(--text-2xl)] font-bold
                  focus:outline-none focus:border-[var(--color-accent)] 
                  transition-colors duration-[var(--duration-fast)]
                  ${type === 'expense' ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'}
                `}
                required
              />
            </div>
          </div>

          <div className="flex gap-[var(--space-3)]">
            <div className="flex-1">
              <Input
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="flex-[2]">
              <Input
                label="Description"
                placeholder={type === 'expense' ? "What did you buy?" : "Where is this from?"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-[var(--space-2)] w-full">
            <label className="text-[var(--text-sm)] font-mono text-[var(--color-text-secondary)]">
              {type === 'expense' ? 'Category' : 'Source'}
            </label>
             {type === 'expense' ? (
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
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
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
              Add {type === 'expense' ? 'Expense' : 'Income'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};
