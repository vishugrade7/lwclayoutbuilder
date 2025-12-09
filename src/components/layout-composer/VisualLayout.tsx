'use client';

import type { Row } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Laptop, Loader2, Smartphone, Tablet } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type PreviewDevice = "desktop" | "tablet" | "mobile";

interface VisualLayoutProps {
  rows: Row[];
  selectedColumnId: string | null;
  onSelectColumn: (id: string) => void;
  isLoading: boolean;
  previewDevice: PreviewDevice;
  onSetPreviewDevice: (device: PreviewDevice) => void;
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
    small: 'sm:-mx-2 md:-mx-4',
    medium: 'sm:-mx-4 md:-mx-8',
    large: 'sm:-mx-6 md:-mx-12',
}

const sldsPaddingToTailwind: Record<string, string> = {
    'none': '',
    'around_small': 'p-2',
    'around_medium': 'p-4',
    'around_large': 'p-6',
    'horizontal_small': 'px-2',
    'horizontal_medium': 'px-4',
    'horizontal_large': 'px-6',
    'vertical_small': 'py-2',
    'vertical_medium': 'py-4',
    'vertical_large': 'py-6',
}

const deviceWidthClassMap: Record<PreviewDevice, string> = {
  desktop: "w-full",
  tablet: "w-[768px]",
  mobile: "w-[375px]",
};

export function VisualLayout({
  rows,
  selectedColumnId,
  onSelectColumn,
  isLoading,
  previewDevice,
  onSetPreviewDevice,
}: VisualLayoutProps) {
  
  const getColumnWidth = (col: Row['columns'][0], row: Row) => {
    if(row.columnType === 'fluid'){
      return 'auto';
    }

    switch (previewDevice) {
      case 'mobile':
        return `${(col.sizeSmall / 12) * 100}%`;
      case 'tablet':
        return `${(col.sizeMedium / 12) * 100}%`;
      case 'desktop':
      default:
        return `${(col.size / 12) * 100}%`;
    }
  };

  return (
    <div className="h-full w-full p-4 rounded-lg border-2 border-border/20 relative flex flex-col mt-12">
       <div className="flex justify-between items-center absolute -top-10 left-0 right-0 px-1">
        <div className="flex items-center gap-4">
            <div className="bg-muted text-muted-foreground font-bold py-1 px-3 rounded-t-md text-sm">
                {previewDevice.charAt(0).toUpperCase() + previewDevice.slice(1)}
            </div>
            <Tabs value={previewDevice} onValueChange={(value) => onSetPreviewDevice(value as PreviewDevice)} className="w-auto">
              <TabsList>
                <TabsTrigger value="desktop" className="px-2"><Laptop className="h-4 w-4"/></TabsTrigger>
                <TabsTrigger value="tablet" className="px-2"><Tablet className="h-4 w-4"/></TabsTrigger>
                <TabsTrigger value="mobile" className="px-2"><Smartphone className="h-4 w-4"/></TabsTrigger>
              </TabsList>
            </Tabs>
            <h2 className="text-lg font-bold">Visual Layout</h2>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div className="flex-grow w-full flex justify-center items-start pt-4 overflow-auto">
        <div
          className={cn(
            "h-full rounded-md bg-card/50 p-4 space-y-2 border-2 border-border/50 relative transition-all duration-300 ease-in-out",
            deviceWidthClassMap[previewDevice],
            isLoading ? 'opacity-50' : 'opacity-100'
          )}
        >
          <div className="absolute inset-0 grid grid-cols-12 gap-x-2 px-4 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border-l border-r border-dashed border-border/20"></div>
              ))}
          </div>

          <div className='relative space-y-2'>
              {rows.map((row) => (
              <div
                  key={row.id}
                  className={cn(
                      'flex w-full min-h-[5rem] bg-card',
                      row.multipleRows ? 'flex-wrap' : 'flex-nowrap',
                      hAlignClassMap[row.horizontalAlignment],
                      vAlignClassMap[row.verticalAlignment],
                      pullBoundariesClassMap[row.pullBoundaries],
                      sldsPaddingToTailwind[row.padding] || ''
                  )}
                  style={{ gap: '0.75rem' }}
                  >
                  {row.columns.map((col, index) => {
                      const isSelected = selectedColumnId === col.id;
                      const width = getColumnWidth(col, row);
                      
                      const style: React.CSSProperties = {
                        flexGrow: row.columnType === 'fluid' ? 1 : 0,
                        flexShrink: row.columnType === 'fluid' ? 1 : 0,
                        flexBasis: width,
                      };
                      
                      return (
                      <div
                          key={col.id}
                          className={cn(
                          'flex items-center justify-center rounded-md text-sm transition-all duration-200 ease-in-out',
                          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                          isSelected ? 'ring-2 ring-offset-2' : 'border-foreground/20',
                          vAlignClassMap[row.verticalAlignment] === 'items-stretch' ? '' : 'h-20'
                          )}
                          style={style}
                          onClick={() => onSelectColumn(col.id)}
                      >
                          <div className={cn(
                              "text-center text-foreground w-full h-full flex items-center justify-center rounded-md",
                              isSelected ? "" : "bg-muted/50"
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
    </div>
  );
}
