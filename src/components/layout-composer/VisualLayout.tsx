'use client';

import type { Column, Row } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface VisualLayoutProps {
  rows: Row[];
  selectedColumnId: string | null;
  onSelectColumn: (id: string) => void;
  isLoading: boolean;
}

const hAlignClassMap: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  'space-around': 'justify-around',
  'space-between': 'justify-between',
};

const vAlignClassMap: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const pullBoundariesClassMap: Record<string, string> = {
    none: '',
    small: '-mx-2',
    medium: '-mx-4',
    large: '-mx-8',
}

const sldsPaddingToTailwind: Record<string, string> = {
    'slds-p-around_small': 'p-2',
    'slds-p-around_medium': 'p-4',
    'slds-p-around_large': 'p-6',
    'slds-p-horizontal_small': 'px-2',
    'slds-p-vertical_small': 'py-2',
    'slds-m-around_small': 'm-2',
}

const flexClassMap: Record<Column['flexibility'], string> = {
    'default': '', // Uses flex-basis for sizing
    'auto': 'flex-1',
    'shrink': 'flex-shrink',
    'no-shrink': 'flex-shrink-0',
    'grow': 'flex-grow',
    'no-grow': 'flex-grow-0',
    'no-flex': 'flex-none'
};

export function VisualLayout({
  rows,
  selectedColumnId,
  onSelectColumn,
  isLoading,
}: VisualLayoutProps) {
  return (
    <div className="h-full w-full bg-primary/20 p-4 rounded-lg border-2 border-primary relative">
        <div className="bg-primary text-primary-foreground font-bold py-1 px-3 rounded-t-md absolute -top-8 left-4">Default</div>
        {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        <div className={cn(
            "h-full w-full rounded-md bg-card p-4 space-y-2 overflow-auto",
            isLoading ? 'opacity-50' : 'opacity-100'
        )}>
          {rows.map((row) => (
            <div key={row.id} className={cn("bg-background border border-dashed border-gray-300 p-1", pullBoundariesClassMap[row.pullBoundaries])}>
              <div
                className={cn(
                  'flex min-h-[100px] rounded bg-muted/30',
                  row.multipleRows && 'flex-wrap',
                  hAlignClassMap[row.horizontalAlignment],
                  vAlignClassMap[row.verticalAlignment]
                )}
                style={{ gap: '0.75rem' }}
              >
                {row.columns.map((col, index) => {
                  const isSelected = selectedColumnId === col.id;
                  const flexBasis = col.flexibility === 'default' ? `calc(${(col.size / 12) * 100}% - 0.75rem)` : 'auto';

                  return (
                  <button
                    key={col.id}
                    onClick={() => onSelectColumn(col.id)}
                    className={cn(
                      'flex items-center justify-center rounded border text-sm transition-all duration-200 ease-in-out',
                      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                      isSelected
                        ? 'bg-white border-primary shadow-lg ring-2 ring-primary'
                        : 'bg-white hover:border-primary/50 border-input',
                      vAlignClassMap[row.verticalAlignment] === 'items-stretch' ? '' : 'h-20',
                      flexClassMap[col.flexibility],
                      sldsPaddingToTailwind[col.padding] || 'p-2'
                    )}
                    style={{ flexBasis: flexBasis }}
                    aria-pressed={isSelected}
                  >
                    <div className={cn("text-center text-foreground w-full h-full flex items-center justify-center", isSelected ? "bg-primary/10" : "bg-gray-50")}>
                        <span className="font-semibold">{index + 1}</span>
                    </div>
                  </button>
                )})}
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
