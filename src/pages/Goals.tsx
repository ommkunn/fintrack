import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Target, CheckCircle, Warning } from '@phosphor-icons/react';
import { Button } from '../components/ui/Button';

export const Goals: React.FC = () => {
   const { state: { savingsGoals }, setSavingsGoal, getMonthlySummary } = useFinance();
   
   const currentMonthStr = new Date().toISOString().substring(0, 7);
   const currentGoal = savingsGoals[currentMonthStr] || 0;
   const [goalInput, setGoalInput] = useState(currentGoal.toString());
   const [isEditing, setIsEditing] = useState(currentGoal === 0);

   const { netSavings } = getMonthlySummary(currentMonthStr);
   
   const handleSave = () => {
       const amount = Number(goalInput);
       if (!isNaN(amount) && amount >= 0) {
           setSavingsGoal(currentMonthStr, amount);
           setIsEditing(false);
       }
   };

   return (
       <div className="flex flex-col gap-[var(--space-6)] max-w-2xl mx-auto animate-in fade-in">
           <div>
               <h1 className="text-[var(--text-xl)] font-bold text-[var(--color-text-primary)] font-mono">
                    Savings Goals
               </h1>
               <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] font-mono">
                   Set and track your monthly targets.
               </p>
           </div>

           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-[var(--space-6)]">
               
               <div className="flex items-center gap-3 mb-[var(--space-6)] text-[var(--color-accent)]">
                   <Target size={32} weight="duotone" />
                   <h2 className="text-[var(--text-lg)] font-bold font-mono text-[var(--color-text-primary)]">
                       {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Target
                   </h2>
               </div>

               {isEditing ? (
                   <div className="flex flex-col gap-[var(--space-4)]">
                       <label className="text-[var(--text-sm)] font-mono text-[var(--color-text-secondary)]">
                           How much do you want to save this month?
                       </label>
                       <div className="flex gap-4">
                           <div className="relative flex-1">
                               <div className="absolute left-[var(--space-4)] top-[var(--space-3)] font-mono text-[var(--text-lg)] text-[var(--color-text-secondary)]">
                                   ₹
                               </div>
                               <input
                                   type="number"
                                   value={goalInput}
                                   onChange={(e) => setGoalInput(e.target.value)}
                                   className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] py-[var(--space-3)] pl-[var(--space-10)] pr-[var(--space-4)] font-mono text-[var(--text-lg)] focus:outline-none focus:border-[var(--color-accent)]"
                               />
                           </div>
                           <Button onClick={handleSave}>Save Target</Button>
                       </div>
                   </div>
               ) : (
                   <div className="flex flex-col gap-[var(--space-6)]">
                       
                       <div className="flex justify-between items-end">
                           <div>
                               <div className="text-[var(--text-sm)] font-mono text-[var(--color-text-secondary)] mb-1">
                                   Current Goal
                               </div>
                               <div className="font-mono text-[var(--text-3xl)] font-bold text-[var(--color-text-primary)]">
                                   ₹ {currentGoal.toLocaleString('en-IN')}
                               </div>
                           </div>
                           <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit</Button>
                       </div>

                       <div className="w-full h-4 bg-[var(--color-surface-raised)] rounded-full overflow-hidden">
                           <div 
                               className="h-full bg-[var(--color-accent)] transition-all duration-[var(--duration-slow)] ease-[var(--ease-spring)]"
                               style={{ width: `${Math.min((netSavings / currentGoal) * 100, 100)}%` }}
                           />
                       </div>

                       <div className="flex justify-between font-mono text-[var(--text-sm)]">
                           <span className="text-[var(--color-text-secondary)]">
                               Saved: <span className={netSavings >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}>₹ {netSavings.toLocaleString('en-IN')}</span>
                           </span>
                           <span className="text-[var(--color-text-secondary)]">
                               {Math.round((netSavings / currentGoal) * 100)}%
                           </span>
                       </div>

                       {netSavings >= currentGoal && currentGoal > 0 ? (
                           <div className="bg-[var(--color-success)]/10 text-[var(--color-success)] p-[var(--space-4)] rounded-[var(--radius-md)] font-mono flex items-center gap-3">
                               <CheckCircle size={24} color="var(--color-success)" />
                               Amazing! You've hit your savings goal for this month.
                           </div>
                       ) : netSavings < 0 ? (
                           <div className="bg-[var(--color-danger)]/10 text-[var(--color-danger)] p-[var(--space-4)] rounded-[var(--radius-md)] font-mono flex items-center gap-3">
                               <Warning size={24} color="var(--color-danger)" />
                               You're currently spending more than you're earning.
                           </div>
                       ) : null}

                   </div>
               )}
           </div>
       </div>
   );
};
