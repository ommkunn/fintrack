import React from 'react';

type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'accent';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', className = '', children, ...props }) => {
  let classes = 'font-mono inline-flex items-center px-[var(--space-3)] py-1 rounded-[var(--radius-sm)] text-[var(--text-xs)] uppercase tracking-[0.06em] font-medium transition-colors duration-[var(--duration-fast)] ' + className;

  if (variant === 'default') {
    classes += ' bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)]';
  } else if (variant === 'accent') {
    classes += ' bg-[var(--color-accent-subtle)] text-[var(--color-accent)]';
  } else if (variant === 'success') {
    classes += ' bg-[#16A34A]/20 text-[var(--color-success)]'; // Fallback opacity overlay
  } else if (variant === 'danger') {
    classes += ' bg-[#DC2626]/20 text-[var(--color-danger)]';
  } else if (variant === 'warning') {
    classes += ' bg-[#CA8A04]/20 text-[var(--color-warning)]';
  }

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
