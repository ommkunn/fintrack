import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', ...props }, ref) => {
    
    return (
      <div className="flex flex-col gap-[var(--space-2)] w-full">
        {label && (
          <label className="text-[var(--text-sm)] font-mono text-[var(--color-text-secondary)]">
            {label}
          </label>
        )}
        
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-[var(--space-3)] text-[var(--color-text-secondary)]">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              w-full bg-[var(--color-surface)] border border-[var(--color-border)] 
              rounded-[var(--radius-md)] py-[var(--space-3)] px-[var(--space-4)]
              ${leftIcon ? 'pl-[var(--space-10)]' : ''}
              text-[var(--color-text-primary)] font-mono text-[var(--text-base)]
              focus:outline-none focus:border-[var(--color-accent)] 
              transition-colors duration-[var(--duration-fast)]
              placeholder:text-[var(--color-text-secondary)]
              ${error ? 'border-[var(--color-danger)]' : ''}
              ${className}
            `}
            {...props}
          />
        </div>

        {error && (
          <span className="text-[var(--color-danger)] text-[var(--text-xs)] font-mono">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
