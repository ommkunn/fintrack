import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    
    // Base styles: JetBrains Mono (font-mono), flex, center
    let classes = 'font-mono inline-flex items-center justify-center transition-all duration-[var(--duration-instant)] ease-[var(--ease-snap)] focus:outline-none ' + className;
    
    // Variant styles
    if (variant === 'primary') {
      classes += ' bg-[var(--color-accent)] text-[var(--color-bg)] rounded-[var(--radius-md)] hover:scale-[0.96] active:scale-[0.96]';
    } else if (variant === 'secondary') {
      classes += ' bg-transparent border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-[var(--radius-md)] hover:bg-[var(--color-surface-raised)]';
    } else if (variant === 'ghost') {
      classes += ' bg-transparent text-[var(--color-text-primary)] rounded-[var(--radius-md)] hover:bg-[var(--color-surface-raised)]';
    }

    // Size styles
    if (size === 'sm') {
      classes += ' px-3 py-1.5 text-[var(--text-sm)] font-medium';
    } else if (size === 'md') {
      classes += ' px-5 py-2.5 text-[14px] font-medium';
    } else if (size === 'lg') {
      classes += ' px-6 py-3 text-[var(--text-base)] font-bold';
    } else if (size === 'icon') {
      classes += ' p-2';
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
