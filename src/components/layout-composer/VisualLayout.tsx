'use client';

import type { Row } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface VisualLayoutProps {
  rows: Row[];
  selectedColumnId: string | null;
  onSelectColumn: (id: string) => void;
  isLoading: boolean;
}

const hAlignClassMap: Record<Row['horizontalAlignment'], string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  space: 'justify-around',
  spread: 'justify-between',
};

const vAlignClassMap: Record<Row['verticalAlignment'], string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const pullBoundariesClassMap: Record<Row['pullBoundaries'], string> = {
    none: '',
    small: '-mx-2',
    medium: '-mx-4',
    large: '-mx-8',
}

const sldsPaddingToTailwind: Record<string, string> = {
    'none': '',
    'around-small': 'p-2',
    'around-medium': 'p-4',
    'around-large': 'p-6',
    'horizontal-small': 'px-2',
    'horizontal-medium': 'px-4',
    'horizontal-large': 'px-6',
    'vertical-small': 'py-2',
    'vertical-medium': 'py-4',
    'vertical-large': 'py-6',
}

export function VisualLayout({
  rows,
  selectedColumnId,
  onSelectColumn,
  isLoading,
}: VisualLayoutProps) {
  return (
    <div className="h-full w-full bg-primary/10 p-4 rounded-lg border-2 border-primary/50 relative">
      <div className="bg-primary text-primary-foreground font-bold py-1 px-3 rounded-t-md absolute -top-8 left-4">Default</div>
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div
        className={cn(
          "h-full w-full rounded-md bg-card/50 p-4 space-y-2 overflow-auto border-2 border-border/50 relative",
          isLoading ? 'opacity-50' : 'opacity-100'
        )}
      >
        <div className="absolute inset-0 grid grid-cols-12 gap-x-2 px-4 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border-l border-r border-dashed border-border/30"></div>
            ))}
        </div>

        <div className='relative space-y-2'>
            {rows.map((row) => (
            <div
                key={row.id}
                className={cn(
                    'flex w-full min-h-[5rem]',
                    row.multipleRows ? 'flex-wrap' : 'flex-nowrap',
                    hAlignClassMap[row.horizontalAlignment],
                    vAlignClassMap[row.verticalAlignment],
                    pullBoundariesClassMap[row.pullBoundaries]
                )}
                style={{ gap: '0.75rem' }}
                >
                {row.columns.map((col, index) => {
                    const isSelected = selectedColumnId === col.id;
                    
                    const style: React.CSSProperties = {};
                    
                    if (row.columnType === 'fixed') {
                        const widthPercentage = (col.size / 12) * 100;
                        if (row.multipleRows) {
                            style.flexBasis = `calc(${widthPercentage}% - 0.75rem)`;
                            style.flexGrow = 0;
                            style.flexShrink = 0;
                        } else {
                           style.flex = `0 0 ${widthPercentage}%`;
                        }
                    } else if(row.columnType === 'grow') {
                        style.flexGrow = 1;
                        style.flexShrink = 1;
                        style.flexBasis = 0;
                    } else { // auto
                        style.flex = '0 0 auto';
                    }
                    
                    return (
                    <div
                        key={col.id}
                        className={cn(
                        'flex items-center justify-center rounded-md text-sm transition-all duration-200 ease-in-out',
                        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        'bg-card border',
                        isSelected ? 'ring-2 ring-primary ring-offset-2 border-primary' : 'border-foreground/20',
                        vAlignClassMap[row.verticalAlignment] === 'items-stretch' ? '' : 'h-20',
                         sldsPaddingToTailwind[row.padding] || ''
                        )}
                        style={style}
                        onClick={() => onSelectColumn(col.id)}
                    >
                        <div className={cn(
                            "text-center text-foreground w-full h-full flex items-center justify-center rounded-md",
                            isSelected ? "bg-primary/10" : "bg-primary/5"
                        )}>
                        <span className="font-semibold">{index + 1}</span>
                        </div>
                    </div>
                    )
                })}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
