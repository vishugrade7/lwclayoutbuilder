'use client';

import type { Row } from '@/lib/types';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { HelpCircle } from 'lucide-react';

interface RowSettingsProps {
  row: Row;
  onUpdate: (rowId: string, updatedProps: Partial<Row>) => void;
}

export function RowSettings({ row, onUpdate }: RowSettingsProps) {
  const handleUpdate = (props: Partial<Row>) => {
    onUpdate(row.id, props);
  };
  return (
    <div className="flex items-center gap-8">
      <h2 className="text-lg font-bold text-foreground whitespace-nowrap">Row Config</h2>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <Switch
            id="multiple-rows"
            checked={row.multipleRows}
            onCheckedChange={(checked) => handleUpdate({ multipleRows: checked })}
          />
          <Label htmlFor="multiple-rows" className="flex flex-col">
            <span>Multiple Rows</span>
            <span className="text-muted-foreground text-xs">{row.multipleRows ? 'Allowed' : 'Not-Allowed'}</span>
          </Label>
        </div>

        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <Label className="flex items-center gap-1 text-sm">Horizontal Alignment <HelpCircle className="h-3 w-3" /></Label>
            <Select
              value={row.horizontalAlignment}
              onValueChange={(value) => handleUpdate({ horizontalAlignment: value as Row['horizontalAlignment'] })}
            >
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="space-around">Space Around</SelectItem>
                <SelectItem value="space-between">Space Between</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="flex items-center gap-1 text-sm">Vertical Alignment <HelpCircle className="h-3 w-3" /></Label>
             <Select
              value={row.verticalAlignment}
              onValueChange={(value) => handleUpdate({ verticalAlignment: value as Row['verticalAlignment'] })}
            >
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="flex items-center gap-1 text-sm">Pull To Boundary <HelpCircle className="h-3 w-3" /></Label>
             <Select
              value={row.pullBoundaries}
              onValueChange={(value) => handleUpdate({ pullBoundaries: value as Row['pullBoundaries'] })}
            >
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Default</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
