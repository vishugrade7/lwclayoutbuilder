'use client';

import type { Column, DeviceSize } from '@/lib/types';
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
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Laptop, Smartphone, Tablet, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface ColumnSettingsProps {
  column: Column;
  onUpdate: (column: Column) => void;
  onDelete: (columnId: string) => void;
}

const sizeOptions = Array.from({ length: 12 }, (_, i) => i + 1);

const paddingOptions = [
    { value: 'slds-p-around_small', label: 'Small Around'},
    { value: 'slds-p-around_medium', label: 'Medium Around'},
    { value: 'slds-p-around_large', label: 'Large Around'},
    { value: 'slds-p-horizontal_small', label: 'Small Horizontal'},
    { value: 'slds-p-vertical_small', label: 'Small Vertical'},
    { value: 'slds-m-around_small', label: 'Small Margin'},
]

export function ColumnSettings({
  column,
  onUpdate,
  onDelete,
}: ColumnSettingsProps) {
  const handleSizeChange = (device: DeviceSize, value: number) => {
    onUpdate({ ...column, [device]: value });
  };

  const handlePaddingChange = (value: string) => {
    onUpdate({ ...column, padding: value });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline">Column Settings</CardTitle>
            <CardDescription>Adjust selected column.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(column.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete column</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Padding</Label>
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

        <div className="space-y-2">
          <Label>Responsive Sizing</Label>
          <Tabs defaultValue="large" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="small">
                <Smartphone className="h-4 w-4 mr-2" /> Small
              </TabsTrigger>
              <TabsTrigger value="medium">
                <Tablet className="h-4 w-4 mr-2" /> Medium
              </TabsTrigger>
              <TabsTrigger value="large">
                <Laptop className="h-4 w-4 mr-2" /> Large
              </TabsTrigger>
            </TabsList>
            <TabsContent value="small" className="pt-4">
              <SizeSlider
                label="Mobile Size"
                value={column.sizeSmall}
                onChange={(v) => handleSizeChange('sizeSmall', v)}
              />
            </TabsContent>
            <TabsContent value="medium" className="pt-4">
              <SizeSlider
                label="Tablet Size"
                value={column.sizeMedium}
                onChange={(v) => handleSizeChange('sizeMedium', v)}
              />
            </TabsContent>
            <TabsContent value="large" className="pt-4">
              <SizeSlider
                label="Desktop Size"
                value={column.size}
                onChange={(v) => handleSizeChange('size', v)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

function SizeSlider({ label, value, onChange }: { label: string, value: number, onChange: (value: number) => void}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-sm">{label}</Label>
        <span className="text-sm font-medium w-12 text-center rounded-md bg-primary/10 text-primary py-0.5">
          {value} / 12
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={1}
        max={12}
        step={1}
      />
    </div>
  );
}
