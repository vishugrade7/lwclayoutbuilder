'use client';

import type { Row } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  AlignCenterHorizontal,
  AlignEndHorizontal,
  AlignStartHorizontal,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  StretchVertical,
  Rows,
  LayoutPanelTop,
  Plus,
} from 'lucide-react';
import { Button } from '../ui/button';

interface RowSettingsProps {
  row: Row;
  onUpdate: (rowId: string, updatedProps: Partial<Row>) => void;
  onAddRow: () => void;
}

export function RowSettings({ row, onUpdate, onAddRow }: RowSettingsProps) {
  const handleUpdate = (props: Partial<Row>) => {
    onUpdate(row.id, props);
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle className="font-headline flex items-center gap-2">
            <LayoutPanelTop className="h-5 w-5 text-primary" />
            Layout Settings
          </CardTitle>
        </div>
        <Button size="sm" onClick={onAddRow}>
          <Plus className="h-4 w-4 mr-2" /> Add Row
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Configure the properties for the currently active row.
        </p>
        <Accordion type="single" collapsible defaultValue="alignment" className="w-full">
          <AccordionItem value="alignment">
            <AccordionTrigger className="font-semibold">Alignment</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Horizontal Alignment</Label>
                <Select
                  value={row.horizontalAlignment}
                  onValueChange={(value) => handleUpdate({ horizontalAlignment: value as Row['horizontalAlignment'] })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start"><AlignStartHorizontal className="inline-block mr-2 h-4 w-4" />Start</SelectItem>
                    <SelectItem value="center"><AlignCenterHorizontal className="inline-block mr-2 h-4 w-4" />Center</SelectItem>
                    <SelectItem value="end"><AlignEndHorizontal className="inline-block mr-2 h-4 w-4" />End</SelectItem>
                    <SelectItem value="space-around">Space Around</SelectItem>
                    <SelectItem value="space-between">Space Between</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vertical Alignment</Label>
                 <Select
                  value={row.verticalAlignment}
                  onValueChange={(value) => handleUpdate({ verticalAlignment: value as Row['verticalAlignment'] })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start"><AlignStartVertical className="inline-block mr-2 h-4 w-4" />Start</SelectItem>
                    <SelectItem value="center"><AlignCenterVertical className="inline-block mr-2 h-4 w-4" />Center</SelectItem>
                    <SelectItem value="end"><AlignEndVertical className="inline-block mr-2 h-4 w-4" />End</SelectItem>
                    <SelectItem value="stretch"><StretchVertical className="inline-block mr-2 h-4 w-4" />Stretch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="behavior">
            <AccordionTrigger className="font-semibold">Behavior</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <Label>Allow Multiple Rows</Label>
                        <p className="text-xs text-muted-foreground">Wrap columns to the next line if needed.</p>
                    </div>
                    <Switch
                        checked={row.multipleRows}
                        onCheckedChange={(checked) => handleUpdate({ multipleRows: checked })}
                    />
                </div>
                 <div className="space-y-2">
                    <Label>Pull Boundaries</Label>
                     <Select
                      value={row.pullBoundaries}
                      onValueChange={(value) => handleUpdate({ pullBoundaries: value as Row['pullBoundaries'] })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
