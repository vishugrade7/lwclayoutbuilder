'use client';

import type { Row } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface VisualLayoutProps {
  rows: Row[];
  selectedColumnId: string | null;
  onSelectColumn: (id: string) => void;
  onAddColumn: (rowId: string) => void;
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

export function VisualLayout({
  rows,
  selectedColumnId,
  onSelectColumn,
  onAddColumn,
  isLoading,
}: VisualLayoutProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Visual Preview</CardTitle>
        <CardDescription>
          Click a column to edit its properties. The layout reflects SLDS grid classes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow relative">
        {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        <div className={cn(
            "h-full w-full rounded-md border border-dashed bg-muted/50 p-4 space-y-4 overflow-auto",
            isLoading ? 'opacity-50' : 'opacity-100'
        )}>
          {rows.map((row) => (
            <div key={row.id} className="rounded-lg border bg-background p-2 group/row relative">
              <div
                className={cn(
                  'flex min-h-[120px] rounded',
                  row.multipleRows && 'flex-wrap',
                  hAlignClassMap[row.horizontalAlignment],
                  vAlignClassMap[row.verticalAlignment]
                )}
                style={{ gap: '0.5rem' }}
              >
                {row.columns.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => onSelectColumn(col.id)}
                    className={cn(
                      'flex items-center justify-center rounded-md border text-sm transition-all duration-200 ease-in-out',
                      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                      selectedColumnId === col.id
                        ? 'bg-primary/20 border-primary shadow-lg'
                        : 'bg-background hover:bg-primary/10 border-dashed',
                      vAlignClassMap[row.verticalAlignment] === 'items-stretch' ? '' : 'h-24'
                    )}
                    style={{ flexBasis: `${(col.size / 12) * 100}%` }}
                    aria-pressed={selectedColumnId === col.id}
                  >
                    <div className="text-center">
                        <span className="font-semibold">{col.size}/12</span>
                        <span className="text-xs block text-muted-foreground">({col.sizeMedium}/12, {col.sizeSmall}/12)</span>
                    </div>
                  </button>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-accent text-accent-foreground opacity-0 group-hover/row:opacity-100 transition-opacity"
                onClick={() => onAddColumn(row.id)}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add column</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
