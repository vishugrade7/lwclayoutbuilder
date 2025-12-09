'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Row } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Check, Clipboard } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


interface CodeGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rows: Row[];
}

function generateLwcHtml(rows: Row[]): string {
  return `<template>
${rows.map(row => {
    const rowAttrs = [
      row.multipleRows ? 'multiple-rows="true"' : '',
      row.horizontalAlignment !== 'start' ? `horizontal-align="${row.horizontalAlignment}"` : '',
      row.verticalAlignment !== 'start' ? `vertical-align="${row.verticalAlignment}"` : '',
      row.pullBoundaries !== 'none' ? `pull-to-boundary="${row.pullBoundaries}"` : ''
    ].filter(Boolean).join(' ');

    return `    <lightning-layout ${rowAttrs}>
${row.columns.map((col, index) => {
    const colAttrs = [
        col.columnType === 'fixed' ? `size="${col.size}"` : `flexibility="${col.columnType === 'fluid' ? 'auto' : 'grow'}"`,
        col.deviceSpecific ? `small-device-size="${col.sizeSmall}"` : '',
        col.deviceSpecific ? `medium-device-size="${col.sizeMedium}"` : '',
        col.deviceSpecific ? `large-device-size="${col.size}"` : '',
        row.padding !== 'none' ? `padding="${row.padding.replace('slds-p-', '')}"` : ''
    ].filter(Boolean).join(' ');

    return `        <lightning-layout-item ${colAttrs}>
            <div class="slds-box slds-box_x-small slds-text-align_center slds-m-around_x-small">
                Column ${index + 1}
            </div>
        </lightning-layout-item>`;
}).join('\n')}
    </lightning-layout>`;
}).join('\n')}
</template>`;
}


export function CodeGenerationDialog({
  isOpen,
  onClose,
  rows,
}: CodeGenerationDialogProps) {
  const { toast } = useToast();
  const [hasCopied, setHasCopied] = useState(false);
  const generatedCode = generateLwcHtml(rows);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: 'Code Copied!',
      description: 'The LWC markup has been copied to your clipboard.',
    });
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader className="text-left">
          <DialogTitle>Generated LWC Code</DialogTitle>
          <DialogDescription>
            Copy the generated HTML markup for your Lightning Web Component.
          </DialogDescription>
        </DialogHeader>
        <div className="relative my-4">
            <SyntaxHighlighter language="html" style={vscDarkPlus} customStyle={{ borderRadius: '0.5rem', margin: 0, background: '#1E1E1E' }} >
                {generatedCode}
            </SyntaxHighlighter>
            <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 bg-gray-700/50 hover:bg-gray-600/50"
                onClick={handleCopy}
            >
                {hasCopied ? <Check className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4 text-white" />}
            </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
