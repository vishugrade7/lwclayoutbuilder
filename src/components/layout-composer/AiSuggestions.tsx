'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateLayoutSuggestions } from '@/ai/flows/generate-layout-suggestions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export function AiSuggestions() {
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!description) {
      toast({
        title: 'Error',
        description: 'Please enter a description for your desired design.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await generateLayoutSuggestions({
        designDescription: description,
      });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('AI suggestion error:', error);
      toast({
        title: 'Error Generating Suggestions',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="ai-suggestions">
        <AccordionTrigger className="text-lg font-headline">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Suggestions
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Describe the content and design you want, and let AI provide some
            layout ideas.
          </p>
          <Textarea
            placeholder="e.g., A product detail page with a large image on the left and product information on the right."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Ideas'
            )}
          </Button>

          {suggestions.length > 0 && (
            <Alert>
              <AlertTitle>Layout Ideas</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
