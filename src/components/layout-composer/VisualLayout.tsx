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
    'none': 'p-2',
    'slds-p-around_small': 'p-2',
    'slds-p-around_medium': 'p-4',
    'slds-p-around_large': 'p-6',
    'slds-p-horizontal_small': 'px-2',
    'slds-p-horizontal_medium': 'px-4',
    'slds-p-horizontal_large': 'px-6',
    'slds-p-vertical_small': 'py-2',
    'slds-p-vertical_medium': 'py-4',
    'slds-p-vertical_large': 'py-6',
}

const flexClassMap: Record<Row['flexibility'], string> = {
    'default': '', 
    'fluid': 'flex-1',
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
      <div
        className={cn(
          "h-full w-full rounded-md bg-card p-4 space-y-2 overflow-auto border-2 border-border relative",
          isLoading ? 'opacity-50' : 'opacity-100'
        )}
      >
        <div className="absolute inset-0 grid grid-cols-12 gap-x-2 px-4 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border-l border-r border-dashed border-border/50"></div>
            ))}
        </div>

        <div className='relative'>
            {rows.map((row) => (
            <div key={row.id} className={cn(pullBoundariesClassMap[row.pullBoundaries])}>
                <div
                className={cn(
                    'flex min-h-[100px]',
                    row.multipleRows && 'flex-wrap',
                    hAlignClassMap[row.horizontalAlignment],
                    vAlignClassMap[row.verticalAlignment]
                )}
                style={{ gap: '0.75rem' }}
                >
                {row.columns.map((col, index) => {
                    const isSelected = selectedColumnId === col.id;
                    
                    const widthPercentage = (col.size / 12) * 100;
                    
                    const style: React.CSSProperties = {};

                    if (row.flexibility === 'default') {
                        if (row.multipleRows) {
                            style.flexBasis = `calc(${widthPercentage}% - ${widthPercentage === 100 ? '0px' : '0.75rem'})`;
                            style.flexGrow = 0;
                            style.flexShrink = 0;
                            style.maxWidth = `${widthPercentage}%`;
                        } else {
                            style.flex = `0 1 ${widthPercentage}%`;
                        }
                    } else {
                        style.flexGrow = 1;
                        style.flexShrink = 1;
                        style.flexBasis = 0;
                    }
                    
                    return (
                    <div
                        key={col.id}
                        className={cn(
                        'flex items-center justify-center rounded-md text-sm transition-all duration-200 ease-in-out',
                        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        'bg-card border',
                        isSelected ? 'ring-2 ring-primary ring-offset-2 border-primary' : 'border-foreground/50',
                        vAlignClassMap[row.verticalAlignment] === 'items-stretch' ? '' : 'h-20',
                        flexClassMap[row.flexibility],
                        )}
                        style={style}
                        onClick={() => onSelectColumn(col.id)}
                    >
                        <div className={cn(
                            "text-center text-foreground w-full h-full flex items-center justify-center rounded-md",
                            sldsPaddingToTailwind[row.padding] || 'p-2',
                            isSelected ? "bg-primary/10" : ""
                        )}>
                        <span className="font-semibold">{index + 1}</span>
                        </div>
                    </div>
                    )
                })}
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}
