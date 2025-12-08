'use server';

/**
 * @fileOverview Provides intelligent layout suggestions based on the desired design and content.
 *
 * - generateLayoutSuggestions - A function that generates layout suggestions.
 * - GenerateLayoutSuggestionsInput - The input type for the generateLayoutSuggestions function.
 * - GenerateLayoutSuggestionsOutput - The return type for the generateLayoutSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLayoutSuggestionsInputSchema = z.object({
  designDescription: z
    .string()
    .describe('The description of the desired design and content.'),
});
export type GenerateLayoutSuggestionsInput = z.infer<typeof GenerateLayoutSuggestionsInputSchema>;

const GenerateLayoutSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of layout suggestions based on the design description.'),
});
export type GenerateLayoutSuggestionsOutput = z.infer<typeof GenerateLayoutSuggestionsOutputSchema>;

export async function generateLayoutSuggestions(input: GenerateLayoutSuggestionsInput): Promise<GenerateLayoutSuggestionsOutput> {
  return generateLayoutSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLayoutSuggestionsPrompt',
  input: {schema: GenerateLayoutSuggestionsInputSchema},
  output: {schema: GenerateLayoutSuggestionsOutputSchema},
  prompt: `You are an expert layout designer. Based on the desired design and content, provide intelligent layout suggestions.

Desired Design and Content: {{{designDescription}}}

Provide at least 3 layout suggestions.`,
});

const generateLayoutSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateLayoutSuggestionsFlow',
    inputSchema: GenerateLayoutSuggestionsInputSchema,
    outputSchema: GenerateLayoutSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
