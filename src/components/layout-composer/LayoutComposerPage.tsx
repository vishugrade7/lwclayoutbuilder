'use client';

import React, { useState, useMemo, useCallback, useTransition } from 'react';
import type { Row, Column } from '@/lib/types';
import { DEFAULT_LAYOUT, createNewColumn } from '@/lib/defaults';
import { Header } from './Header';
import { RowSettings } from './RowSettings';
import { VisualLayout } from './VisualLayout';
import { ColumnSettings } from './ColumnSettings';
import { generateId } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function LayoutComposerPage() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_LAYOUT);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(
    DEFAULT_LAYOUT[0]?.columns[0]?.id ?? null
  );

  const [isPending, startTransition] = useTransition();

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
        const newColumn = createNewColumn();
        setRows((prevRows) =>
            prevRows.map((row) =>
            row.id === rowId
                ? { ...row, columns: [...row.columns, newColumn] }
                : row
            )
        );
        setSelectedColumnId(newColumn.id);
    });
  }, []);

  const handleDeleteColumn = useCallback((columnId: string) => {
    startTransition(() => {
        let newSelectedId: string | null = null;
        setRows((prevRows) =>
          prevRows.map((row) => {
            const newColumns = row.columns.filter((c) => c.id !== columnId);
            if (newColumns.length < row.columns.length) {
              if (selectedColumnId === columnId) {
                newSelectedId = row.columns[row.columns.findIndex(c => c.id === columnId) - 1]?.id || newColumns[0]?.id || null;
              }
            }
            return { ...row, columns: newColumns };
          }).filter(row => row.columns.length > 0)
        );
        if (newSelectedId) {
            setSelectedColumnId(newSelectedId);
        } else {
            // if no column is left, select first column of first row
            const firstRow = rows[0];
            if (firstRow && firstRow.columns.length > 0) {
                setSelectedColumnId(firstRow.columns[0].id);
            } else {
                setSelectedColumnId(null);
            }
        }
    });
  }, [selectedColumnId, rows]);
  
  const handleAddRow = useCallback(() => {
    startTransition(() => {
      const newRow: Row = {
        id: generateId(),
        columns: [createNewColumn()],
        horizontalAlignment: 'start',
        verticalAlignment: 'start',
        pullBoundaries: 'none',
        multipleRows: true,
      };
      setRows(prevRows => [...prevRows, newRow]);
      setSelectedColumnId(newRow.columns[0].id);
    });
  }, []);

  const selectedColumn = useMemo(() => {
    if (!selectedColumnId) return null;
    for (const row of rows) {
      const found = row.columns.find((c) => c.id === selectedColumnId);
      if (found) return found;
    }
    return null;
  }, [rows, selectedColumnId]);
  
  const activeRow = useMemo(() => {
    return rows.find(r => r.columns.some(c => c.id === selectedColumnId)) ?? rows[0];
  }, [rows, selectedColumnId]);

  return (
    <div className="flex h-screen flex-col bg-background font-body text-foreground">
      <Header />
      <main className="flex-grow overflow-hidden p-4">
        <div className="grid h-full grid-cols-12 gap-4">
          {/* Left Panel */}
          <div className="col-span-12 md:col-span-3 h-full overflow-y-auto pr-2 space-y-4">
            {activeRow && (
              <RowSettings 
                row={activeRow} 
                onUpdate={handleUpdateRow}
                onAddRow={handleAddRow}
              />
            )}
          </div>

          {/* Center Panel */}
          <div className="col-span-12 md:col-span-6 h-full overflow-y-auto pr-2">
            <VisualLayout
              rows={rows}
              onSelectColumn={setSelectedColumnId}
              selectedColumnId={selectedColumnId}
              onAddColumn={handleAddColumn}
              isLoading={isPending}
            />
          </div>

          {/* Right Panel */}
          <div className="col-span-12 md:col-span-3 h-full overflow-y-auto pr-2 space-y-4">
            {selectedColumn ? (
              <ColumnSettings
                column={selectedColumn}
                onUpdate={handleUpdateColumn}
                onDelete={handleDeleteColumn}
              />
            ) : (
              <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Column Settings</CardTitle>
                    <CardDescription>No column selected</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48">
                    <p className="text-center text-muted-foreground">
                        Select a column in the visual layout to see its properties.
                    </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
