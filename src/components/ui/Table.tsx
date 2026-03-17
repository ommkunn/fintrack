import React from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function Table<T extends { id?: string | number }>({ 
  columns, 
  data, 
  onRowClick,
  emptyMessage = "No items to display." 
}: TableProps<T>) {

  if (data.length === 0) {
    return (
      <div className="w-full p-[var(--space-8)] text-center text-[var(--color-text-secondary)] font-mono border border-[var(--color-border)] rounded-[var(--radius-lg)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
      <table className="w-full text-left font-mono text-[var(--text-sm)]">
        <thead className="bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)]">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={String(col.key)} 
                className={`py-[var(--space-3)] px-[var(--space-4)] font-medium ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${idx === 0 ? 'rounded-tl-[var(--radius-lg)]' : ''} ${idx === columns.length - 1 ? 'rounded-tr-[var(--radius-lg)]' : ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {data.map((row, rowIndex) => (
            <tr 
              key={row.id || rowIndex} 
              onClick={() => onRowClick && onRowClick(row)}
              className={`
                group
                ${onRowClick ? 'cursor-pointer hover:bg-[var(--color-surface-raised)] transition-colors duration-[var(--duration-fast)]' : ''}
              `}
            >
              {columns.map((col) => (
                <td 
                  key={String(col.key)} 
                  className={`py-[var(--space-3)] px-[var(--space-4)] ${col.align === 'right' ? 'text-right tabular-nums' : col.align === 'center' ? 'text-center' : 'text-left'} text-[var(--color-text-primary)]`}
                >
                  {col.render ? col.render(row) : String(row[col.key as keyof T] || '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
