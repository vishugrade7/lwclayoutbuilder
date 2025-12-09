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
import { Separator } from '../ui/separator';

interface RowSettingsProps {
  row: Row;
  onUpdate: (rowId: string, updatedProps: Partial<Row>) => void;
}

export function RowSettings({ row, onUpdate }: RowSettingsProps) {
  const handleUpdate = (props: Partial<Row>) => {
    onUpdate(row.id, props);
  };
  return (
    <div className="flex items-center gap-4 w-full">
      <h2 className="text-lg font-bold text-foreground whitespace-nowrap">Row Config</h2>
      <div className="flex items-center gap-2">
          <Switch
            id="multiple-rows"
            checked={row.multipleRows}
            onCheckedChange={(checked) => handleUpdate({ multipleRows: checked })}
          />
          <Label htmlFor="multiple-rows" className="flex flex-col text-xs">
            <span>Multiple Rows</span>
            <span className="text-muted-foreground font-normal">{row.multipleRows ? 'Allowed' : 'Not-Allowed'}</span>
          </Label>
        </div>
        <Separator orientation='vertical' className="h-8" />
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <Label className="flex items-center gap-1 text-xs">Horizontal Alignment <HelpCircle className="h-3 w-3 text-muted-foreground" /></Label>
            <Select
              value={row.horizontalAlignment}
              onValueChange={(value) => handleUpdate({ horizontalAlignment: value as Row['horizontalAlignment'] })}
            >
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="space">Space</SelectItem>
                <SelectItem value="spread">Spread</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="flex items-center gap-1 text-xs">Vertical Alignment <HelpCircle className="h-3 w-3 text-muted-foreground" /></Label>
             <Select
              value={row.verticalAlignment}
              onValueChange={(value) => handleUpdate({ verticalAlignment: value as Row['verticalAlignment'] })}
            >
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="flex items-center gap-1 text-xs">Pull To Boundary <HelpCircle className="h-3 w-3 text-muted-foreground" /></Label>
             <Select
              value={row.pullBoundaries}
              onValueChange={(value) => handleUpdate({ pullBoundaries: value as Row['pullBoundaries'] })}
            >
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
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
  );
}
