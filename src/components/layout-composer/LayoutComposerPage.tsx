'use client';

import React, { useState, useMemo, useCallback, useTransition, useId } from 'react';
import type { Row, Column } from '@/lib/types';
import { createNewColumn } from '@/lib/defaults';
import { RowSettings } from './RowSettings';
import { VisualLayout } from './VisualLayout';
import { ColumnSettings } from './ColumnSettings';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Code } from 'lucide-react';
import { CodeGenerationDialog } from './CodeGenerationDialog';

const createNewRow = (id: string): Row => ({
  id: `row-${id}`,
  columns: [createNewColumn(`col-${id}-0`)],
  horizontalAlignment: 'start',
  verticalAlignment: 'start',
  pullBoundaries: 'none',
  multipleRows: true,
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
        padding: 'slds-p-around_small',
        type: 'Default',
        deviceSpecific: false,
        flexibility: 'default',
      },
    ],
    horizontalAlignment: 'start',
    verticalAlignment: 'start',
    pullBoundaries: 'none',
    multipleRows: false,
  },
];

export function LayoutComposerPage() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_LAYOUT);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(
    DEFAULT_LAYOUT[0]?.columns[0]?.id ?? null
  );
  const [isCodeDialogOpen, setCodeDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
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
                 // If no columns left, add a default row
                 if (remainingRows.length === 0) {
                    const newRow = createNewRow(`row-${baseId}-${rows.length}`);
                    setRows([newRow]);
                    setSelectedColumnId(newRow.columns[0].id);
                 }
            }
        }
    });
  }, [selectedColumnId, rows, baseId]);
  
  const handleAddRow = useCallback(() => {
    startTransition(() => {
      const newRow = createNewRow(`row-${baseId}-${rows.length}`);
      setRows(prevRows => [...prevRows, newRow]);
      setSelectedColumnId(newRow.columns[0].id);
    });
  }, [baseId, rows.length]);

  const selectedColumn = useMemo(() => {
    if (!selectedColumnId) return null;
    for (const row of rows) {
      const found = row.columns.find((c) => c.id === selectedColumnId);
      if (found) return found;
    }
    return null;
  }, [rows, selectedColumnId]);
  
  const activeRow = useMemo(() => {
    return rows.find(r => r.columns.some(c => c.id === selectedColumnId)) ?? rows[0] ?? null;
  }, [rows, selectedColumnId]);

  const activeColumnRow = useMemo(() => {
    return rows.find(r => r.columns.some(c => c.id === selectedColumnId));
  }, [rows, selectedColumnId]);


  return (
    <div className="flex h-screen flex-col bg-background font-body text-foreground">
      <header className="px-4 py-3 bg-card border-b flex items-center justify-between">
         <div className="flex-grow">
          {activeRow && (
                <RowSettings 
                  row={activeRow} 
                  onUpdate={handleUpdateRow}
                />
              )}
         </div>
         <div className="flex items-center gap-4">
          <Button onClick={() => setCodeDialogOpen(true)}>
            <Code className="mr-2 h-4 w-4" />
            Generate Code
          </Button>
        </div>
      </header>
      
      <main className="flex-grow grid grid-cols-12 gap-0 overflow-hidden">
        {/* Left Panel */}
        <div className="col-span-3 bg-card p-4 border-r overflow-y-auto">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Column Config</h2>
              <Button variant="secondary" size="sm" onClick={() => activeRow && handleAddColumn(activeRow.id)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Column
              </Button>
            </div>
          {selectedColumn && activeColumnRow ? (
            <ColumnSettings
              column={selectedColumn}
              onUpdate={handleUpdateColumn}
              onDelete={handleDeleteColumn}
              row={activeColumnRow}
              onUpdateRow={handleUpdateRow}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-muted-foreground p-4">
                  Select a column in the visual layout to see its properties.
              </p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="col-span-9 p-6 flex flex-col bg-muted/30">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Visual Layout</h2>
               <Button size="sm" onClick={handleAddRow}>
                  <Plus className="mr-2 h-4 w-4" /> Add Row
              </Button>
          </div>
          <div className="flex-grow">
            <VisualLayout
              rows={rows}
              onSelectColumn={setSelectedColumnId}
              selectedColumnId={selectedColumnId}
              isLoading={isPending}
            />
          </div>
        </div>
      </main>
      <CodeGenerationDialog 
        isOpen={isCodeDialogOpen}
        onClose={() => setCodeDialogOpen(false)}
        rows={rows}
      />
    </div>
  );
}
