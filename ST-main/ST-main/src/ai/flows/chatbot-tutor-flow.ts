'use server';
/**
 * @fileOverview A chatbot tutor AI agent for sign language.
 *
 * - chatbotTutor - A function that handles the chatbot tutoring process.
 * - ChatbotTutorInput - The input type for the chatbotTutor function.
 * - ChatbotTutorOutput - The return type for the chatbotTutor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotTutorInputSchema = z.object({
  query: z.string().describe('The user query about sign language vocabulary or grammar.'),
});
export type ChatbotTutorInput = z.infer<typeof ChatbotTutorInputSchema>;

const ChatbotTutorOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query about sign language.'),
});
export type ChatbotTutorOutput = z.infer<typeof ChatbotTutorOutputSchema>;

export async function chatbotTutor(input: ChatbotTutorInput): Promise<ChatbotTutorOutput> {
  return chatbotTutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotTutorPrompt',
  input: {schema: ChatbotTutorInputSchema},
  output: {schema: ChatbotTutorOutputSchema},
  prompt: `You are a helpful and informative chatbot tutor specializing in sign language.

  A student is asking you questions about sign language vocabulary and grammar.

  Answer the following question to the best of your ability:
  {{query}}`,
});

const chatbotTutorFlow = ai.defineFlow(
  {
    name: 'chatbotTutorFlow',
    inputSchema: ChatbotTutorInputSchema,
    outputSchema: ChatbotTutorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
