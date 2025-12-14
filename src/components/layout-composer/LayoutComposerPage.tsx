'use client';

import React, { useState, useMemo, useCallback, useTransition, useId } from 'react';
import type { Row, Column } from '@/lib/types';
import { createNewColumn } from '@/lib/defaults';
import { RowSettings } from './RowSettings';
import { VisualLayout } from './VisualLayout';
import { ColumnSettings } from './ColumnSettings';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { CodeGenerationDialog } from './CodeGenerationDialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const createNewRow = (id: string): Row => ({
  id: `row-${id}`,
  columns: [createNewColumn(`col-${id}-0`)],
  horizontalAlignment: 'start',
  verticalAlignment: 'start',
  pullBoundaries: 'none',
  multipleRows: true,
  columnType: 'fixed',
  padding: 'none',
});

const initialRowId = 'initial-row';
const DEFAULT_LAYOUT: Row[] = [
  {
    id: `row-${initialRowId}`,
    columns: [
      {
        id: `col-${initialRowId}-0`,
        size: 12,
        sizeSmall: 12,
        sizeMedium: 12,
        deviceSpecific: false,
      },
    ],
    horizontalAlignment: 'start',
    verticalAlignment: 'start',
    pullBoundaries: 'none',
    multipleRows: false,
    columnType: 'fixed',
    padding: 'slds-p-around_small',
  },
];

const paddingOptions = [
  { value: 'none', label: 'Default' },
  { value: 'horizontal_small', label: 'horizontal-small'},
  { value: 'horizontal_medium', label: 'horizontal-medium'},
  { value: 'horizontal_large', label: 'horizontal-large'},
  { value: 'around_small', label: 'around-small'},
  { value: 'around_medium', label: 'around-medium'},
  { value: 'around_large', label: 'around-large'},
  { value: 'vertical_small', label: 'vertical-small'},
  { value: 'vertical_medium', label: 'vertical-medium'},
  { value: 'vertical_large', label: 'vertical-large'},
]

const columnTypeOptions = [
    { value: 'fixed', label: 'Fixed' },
    { value: 'fluid', label: 'Fluid' },
];


export function LayoutComposerPage() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_LAYOUT);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(
    DEFAULT_LAYOUT[0]?.columns[0]?.id ?? null
  );
  const [isCodeDialogOpen, setCodeDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  const baseId = useId();

  const handleUpdateRow = useCallback((rowId: string, updatedProps: Partial<Row>) => {
    startTransition(() => {
        setRows((prevRows) =>
            prevRows.map((row) =>
            row.id === rowId ? { ...row, ...updatedProps } : row
            )
        );
    });
  }, []);

  const handleUpdateColumn = useCallback((updatedColumn: Column) => {
    startTransition(() => {
        setRows((prevRows) =>
            prevRows.map((row) => ({
            ...row,
            columns: row.columns.map((col) =>
                col.id === updatedColumn.id ? updatedColumn : col
            ),
            }))
        )
    });
  }, []);

  const handleAddColumn = useCallback((rowId: string) => {
    startTransition(() => {
        setRows((prevRows) => {
            return prevRows.map((row) => {
                if (row.id === rowId) {
                    const newColumn = createNewColumn(`col-${row.id}-${row.columns.length}`);
                    setSelectedColumnId(newColumn.id);
                    return { ...row, columns: [...row.columns, newColumn] };
                }
                return row;
            });
        });
    });
  }, []);

  const handleDeleteColumn = useCallback((columnId: string) => {
    startTransition(() => {
        let newSelectedId: string | null = null;
        let remainingRows = rows;
        setRows((prevRows) => {
          const newRows = prevRows.map((row) => {
            const newColumns = row.columns.filter((c) => c.id !== columnId);
            if (newColumns.length < row.columns.length && selectedColumnId === columnId) {
                const deletedIndex = row.columns.findIndex(c => c.id === columnId);
                newSelectedId = row.columns[deletedIndex - 1]?.id ?? newColumns[0]?.id ?? null;
            }
            return { ...row, columns: newColumns };
          }).filter(row => row.columns.length > 0);
          
          remainingRows = newRows;
          return newRows;
        });

        if (newSelectedId) {
            setSelectedColumnId(newSelectedId);
        } else if (selectedColumnId === columnId) {
             const firstRow = remainingRows[0];
            if (firstRow && firstRow.columns.length > 0) {
                setSelectedColumnId(firstRow.columns[0].id);
            } else {
                 setSelectedColumnId(null);
                 if (remainingRows.length === 0) {
                    const newRow = createNewRow(`${baseId}-${rows.length}`);
                    setRows([newRow]);
                    setSelectedColumnId(newRow.columns[0].id);
                 }
            }
        }
    });
  }, [selectedColumnId, rows, baseId]);
  
  const handleAddRow = useCallback(() => {
    startTransition(() => {
      const newRow = createNewRow(`${baseId}-${rows.length}`);
      setRows(prevRows => [...prevRows, newRow]);
      setSelectedColumnId(newRow.columns[0].id);
    });
  }, [baseId, rows]);
  
  const activeRow = useMemo(() => {
    return rows.find(r => r.columns.some(c => c.id === selectedColumnId)) ?? rows[0] ?? null;
  }, [rows, selectedColumnId]);

  const handleColumnTypeChange = (value: string) => {
    if (activeRow) {
      handleUpdateRow(activeRow.id, { columnType: value as Row['columnType'] });
    }
  };

  const handlePaddingChange = (value: string) => {
    if (activeRow) {
      handleUpdateRow(activeRow.id, { padding: value });
    }
  };

  return (
    <div className="flex h-full flex-col bg-background font-body text-foreground bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
       <div className="px-4 sm:px-6 py-3 bg-card/80 border-b backdrop-blur-sm sticky top-0 z-10 flex items-center justify-end gap-4">
        <div className="flex items-center gap-4">
          {activeRow && (
            <RowSettings 
              row={activeRow} 
              onUpdate={handleUpdateRow}
            />
          )}
           <Button size="sm" onClick={handleAddRow} className="rounded-full">
            <Plus className="mr-2 h-3 w-3" /> Add Row
            </Button>
        </div>
      </div>
      
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        <div className="col-span-12 lg:col-span-3 bg-card/50 p-4 border-r overflow-y-auto">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Column Config</h2>
              <Button variant="secondary" size="sm" onClick={() => activeRow && handleAddColumn(activeRow.id)} className="rounded-full">
                  <Plus className="mr-2 h-3 w-3" /> Add Column
              </Button>
            </div>
            {activeRow && (
              <div className="space-y-4 mb-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between gap-4">
                  <div className="w-1/2">
                      <Label className="flex items-center gap-1 mb-2 text-xs">Column type <HelpCircle className="h-3 w-3 text-muted-foreground" /></Label>
                      <Select value={activeRow.columnType} onValueChange={handleColumnTypeChange}>
                          <SelectTrigger className={cn("bg-card")}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                              {columnTypeOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="w-1/2">
                      <Label className="flex items-center gap-1 mb-2 text-xs">Padding <HelpCircle className="h-3 w-3 text-muted-foreground" /></Label>
                      <Select value={activeRow.padding} onValueChange={handlePaddingChange}>
                        <SelectTrigger className={cn("bg-card")}>
                          <SelectValue placeholder="Select padding" />
                        </SelectTrigger>
                        <SelectContent>
                            {paddingOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {activeRow ? (
                activeRow.columns.map((col, index) => (
                  <ColumnSettings
                    key={col.id}
                    column={col}
                    columnIndex={index}
                    onUpdate={handleUpdateColumn}
                    onDelete={handleDeleteColumn}
                    row={activeRow}
                    isSelected={selectedColumnId === col.id}
                    onSelect={() => setSelectedColumnId(col.id)}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-center text-muted-foreground p-4">
                      Select a row in the visual layout to see its columns.
                  </p>
                </div>
              )}
            </div>
        </div>

        <div className="col-span-12 lg:col-span-9 p-6 flex flex-col bg-background/50">
          <div className="flex-grow">
            <VisualLayout
              rows={rows}
              onSelectColumn={setSelectedColumnId}
              selectedColumnId={selectedColumnId}
              isLoading={isPending}
              previewDevice={previewDevice}
              onSetPreviewDevice={setPreviewDevice}
              onGenerateCode={() => setCodeDialogOpen(true)}
            />
          </div>
        </div>
      </div>
      <CodeGenerationDialog 
        isOpen={isCodeDialogOpen}
        onClose={() => setCodeDialogOpen(false)}
        rows={rows}
      />
    </div>
  );
}
