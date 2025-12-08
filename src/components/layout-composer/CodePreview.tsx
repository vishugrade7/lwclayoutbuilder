'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import type { Row } from '@/lib/types';
import { generateLwcHtml, generateLwcCss } from '@/lib/code-generator';
import { useToast } from '@/hooks/use-toast';

interface CodePreviewProps {
  rows: Row[];
}

export function CodePreview({ rows }: CodePreviewProps) {
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);
  const { toast } = useToast();

  const htmlCode = generateLwcHtml(rows);
  const cssCode = generateLwcCss();

  const copyToClipboard = (code: string, type: 'html' | 'css') => {
    navigator.clipboard.writeText(code).then(
      () => {
        if (type === 'html') {
          setCopiedHtml(true);
          setTimeout(() => setCopiedHtml(false), 2000);
        } else {
          setCopiedCss(true);
          setTimeout(() => setCopiedCss(false), 2000);
        }
        toast({
          title: 'Copied to clipboard!',
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast({
          title: 'Error',
          description: 'Failed to copy code.',
          variant: 'destructive',
        });
      }
    );
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="font-headline">Generated Code</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="html">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
          </TabsList>
          <TabsContent value="html" className="relative mt-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7"
              onClick={() => copyToClipboard(htmlCode, 'html')}
            >
              {copiedHtml ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <pre className="w-full overflow-x-auto rounded-md bg-muted p-4 text-sm">
              <code>{htmlCode}</code>
            </pre>
          </TabsContent>
          <TabsContent value="css" className="relative mt-4">
             <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7"
              onClick={() => copyToClipboard(cssCode, 'css')}
            >
              {copiedCss ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <pre className="w-full overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{cssCode}</code>
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
