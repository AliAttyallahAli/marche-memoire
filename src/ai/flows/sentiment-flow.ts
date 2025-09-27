
'use server';
/**
 * @fileOverview An AI flow to determine the sentiment of a social media post.
 *
 * - getSentiment - A function that returns a single emoji for the post's sentiment.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SentimentResponseSchema = z.string().describe('A single emoji that represents the sentiment of the post.');

export async function getSentiment(postContent: string): Promise<string> {
    return sentimentFlow(postContent);
}

const sentimentPrompt = ai.definePrompt({
  name: 'sentimentPrompt',
  input: {schema: z.string()},
  output: {schema: SentimentResponseSchema},
  prompt: `Analyze the sentiment of the following social media post. Your response should be a single emoji that best captures the overall feeling of the text (e.g., 😊, 🎉, 🤔, 😢, 😠).

Post Content:
"{{{input}}}"

Sentiment Emoji:`,
});

const sentimentFlow = ai.defineFlow(
  {
    name: 'sentimentFlow',
    inputSchema: z.string(),
    outputSchema: SentimentResponseSchema,
  },
  async (postContent) => {
    const {output} = await sentimentPrompt(postContent);
    return output!;
  }
);

    