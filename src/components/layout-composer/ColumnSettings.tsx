'use client';

import type { Column, DeviceSize, Row } from '@/lib/types';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Switch } from '../ui/switch';
import { cn } from '@/lib/utils';

interface ColumnSettingsProps {
  column: Column;
  columnIndex: number;
  onUpdate: (column: Column) => void;
  onDelete: (columnId: string) => void;
  row: Row;
  isSelected: boolean;
  onSelect: () => void;
}

const sizeOptions = Array.from({ length: 12 }, (_, i) => i + 1);

export function ColumnSettings({
  column,
  columnIndex,
  onUpdate,
  onDelete,
  row,
  isSelected,
  onSelect,
}: ColumnSettingsProps) {
  const handleSizeChange = (device: DeviceSize, value: string) => {
    onUpdate({ ...column, [device]: parseInt(value, 10) });
  };
  
  const handleDeviceSpecificChange = (checked: boolean) => {
    onUpdate({ ...column, deviceSpecific: checked });
  };

  return (
    <div className="w-full">
      <Accordion type="single" collapsible value={isSelected ? `column-${columnIndex}` : ''} onValueChange={(value) => { if (value) onSelect()}}>
        <AccordionItem value={`column-${columnIndex}`} >
          <AccordionTrigger className={cn("font-bold text-base w-full justify-between hover:no-underline rounded-md px-4", isSelected ? 'bg-primary/10' : '')}>
            <div className="flex items-center">
              Column {columnIndex + 1}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-4 space-y-4 bg-muted/20 rounded-b-md border-x border-b">
            {row.flexibility === 'default' && (
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                        <Label htmlFor={`size-${column.id}`} className="text-xs">Default Size</Label>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <Select value={String(column.size)} onValueChange={(v) => handleSizeChange('size', v)}>
                        <SelectTrigger id={`size-${column.id}`}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {sizeOptions.map(s => <SelectItem key={s} value={String(s)}>{s} of 12</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            )}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-xs">Device Specific Sizes</Label>
                </div>
                <Switch
                    id={`device-specific-${column.id}`}
                    checked={column.deviceSpecific}
                    onCheckedChange={handleDeviceSpecificChange}
                />
            </div>

            {column.deviceSpecific && (
                 <div className="space-y-4 pt-2 border-t mt-4">
                    <div className="space-y-2 pt-4">
                        <Label htmlFor={`size-small-${column.id}`} className="text-xs">Small Device Size (Mobile)</Label>
                        <Select value={String(column.sizeSmall)} onValueChange={(v) => handleSizeChange('sizeSmall', v)}>
                            <SelectTrigger id={`size-small-${column.id}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {sizeOptions.map(s => <SelectItem key={s} value={String(s)}>{s} of 12</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`size-medium-${column.id}`} className="text-xs">Medium Device Size (Tablet)</Label>
                        <Select value={String(column.sizeMedium)} onValueChange={(v) => handleSizeChange('sizeMedium', v)}>
                            <SelectTrigger id={`size-medium-${column.id}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {sizeOptions.map(s => <SelectItem key={s} value={String(s)}>{s} of 12</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}
             <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive mt-4" onClick={() => onDelete(column.id)}>
                <Trash2 className="h-3 w-3 mr-2" />
                Delete Column
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
