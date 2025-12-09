'use client';

import type { Column, DeviceSize, Row } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Switch } from '../ui/switch';

interface ColumnSettingsProps {
  column: Column;
  onUpdate: (column: Column) => void;
  onDelete: (columnId: string) => void;
  row: Row;
  onUpdateRow: (rowId: string, updatedProps: Partial<Row>) => void;
}

const paddingOptions = [
    { value: 'slds-p-around_small', label: 'Small Around'},
    { value: 'slds-p-around_medium', label: 'Medium Around'},
    { value: 'slds-p-around_large', label: 'Large Around'},
    { value: 'slds-p-horizontal_small', label: 'Small Horizontal'},
    { value: 'slds-p-vertical_small', label: 'Small Vertical'},
    { value: 'slds-m-around_small', label: 'Small Margin'},
]

const sizeOptions = Array.from({ length: 12 }, (_, i) => i + 1);

export function ColumnSettings({
  column,
  onUpdate,
  onDelete,
  row,
  onUpdateRow,
}: ColumnSettingsProps) {
  const handleSizeChange = (device: DeviceSize, value: string) => {
    onUpdate({ ...column, [device]: parseInt(value, 10) });
  };

  const handlePaddingChange = (value: string) => {
    onUpdate({ ...column, padding: value });
  };
  
  const handleDeviceSpecificChange = (checked: boolean) => {
    onUpdate({ ...column, deviceSpecific: checked });
  };

  const columnIndex = row.columns.findIndex(c => c.id === column.id);


  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">Column type</h3>
        </div>
        <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">Padding</h3>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <Select value={column.type} onValueChange={(v) => onUpdate({...column, type: v})}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Default">Fixed</SelectItem>
            </SelectContent>
        </Select>
        <Select value={column.padding} onValueChange={handlePaddingChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select padding" />
          </SelectTrigger>
          <SelectContent>
              {paddingOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <Accordion type="single" collapsible defaultValue="column-0" className="w-full">
        <AccordionItem value={`column-${columnIndex}`}>
          <AccordionTrigger className="font-bold text-lg w-full justify-between">
            <div className="flex items-center">
              Column {columnIndex + 1}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor={`size-${column.id}`}>Size</Label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                <Select value={String(column.size)} onValueChange={(v) => handleSizeChange('size', v)}>
                    <SelectTrigger id={`size-${column.id}`}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {sizeOptions.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label>Device Specific</Label>
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
                        <Label htmlFor={`size-small-${column.id}`}>Small Device Size (Mobile)</Label>
                        <Select value={String(column.sizeSmall)} onValueChange={(v) => handleSizeChange('sizeSmall', v)}>
                            <SelectTrigger id={`size-small-${column.id}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {sizeOptions.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`size-medium-${column.id}`}>Medium Device Size (Tablet)</Label>
                        <Select value={String(column.sizeMedium)} onValueChange={(v) => handleSizeChange('sizeMedium', v)}>
                            <SelectTrigger id={`size-medium-${column.id}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {sizeOptions.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}
             <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive mt-4" onClick={() => onDelete(column.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Column
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
