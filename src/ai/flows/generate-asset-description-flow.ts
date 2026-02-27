'use server';
/**
 * @fileOverview A Genkit flow for generating detailed and consistent asset descriptions.
 *
 * - generateAssetDescription - A function that generates an asset description.
 * - GenerateAssetDescriptionInput - The input type for the generateAssetDescription function.
 * - GenerateAssetDescriptionOutput - The return type for the generateAssetDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAssetDescriptionInputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe('A list of keywords or key characteristics describing the asset.'),
  category: z.string().optional().describe('The category of the asset (e.g., "Electronics", "Tools").'),
  existingDescription: z
    .string()
    .optional()
    .describe('An optional existing description to refine or expand upon.'),
});
export type GenerateAssetDescriptionInput = z.infer<
  typeof GenerateAssetDescriptionInputSchema
>;

const GenerateAssetDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated detailed asset description.'),
});
export type GenerateAssetDescriptionOutput = z.infer<
  typeof GenerateAssetDescriptionOutputSchema
>;

export async function generateAssetDescription(
  input: GenerateAssetDescriptionInput
): Promise<GenerateAssetDescriptionOutput> {
  return generateAssetDescriptionFlow(input);
}

const generateAssetDescriptionPrompt = ai.definePrompt({
  name: 'generateAssetDescriptionPrompt',
  input: {schema: GenerateAssetDescriptionInputSchema},
  output: {schema: GenerateAssetDescriptionOutputSchema},
  prompt: `You are an AI assistant specialized in generating detailed, consistent, and professional asset descriptions for inventory management systems. Your goal is to create clear, informative descriptions based on the provided input.

If an 'existingDescription' is provided, refine it by incorporating any new 'keywords' or 'category' information, ensuring the description remains consistent, comprehensive, and well-structured. Otherwise, generate a brand new detailed description based solely on the provided 'keywords' and 'category'.

Ensure the generated description is concise yet provides enough detail for effective asset tracking and identification within an inventory system.

Input:
Keywords: {{{keywords}}}
Category: {{{category}}}
Existing Description: {{{existingDescription}}}

Generate a detailed asset description.`,
});

const generateAssetDescriptionFlow = ai.defineFlow(
  {
    name: 'generateAssetDescriptionFlow',
    inputSchema: GenerateAssetDescriptionInputSchema,
    outputSchema: GenerateAssetDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await generateAssetDescriptionPrompt(input);
    return output!;
  }
);
