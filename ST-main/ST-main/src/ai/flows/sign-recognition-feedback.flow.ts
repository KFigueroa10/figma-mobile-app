'use server';
/**
 * @fileOverview Provides feedback on the accuracy of sign language signs made by the user.
 *
 * - signRecognitionFeedback - A function that takes a video of a user signing and returns feedback on their accuracy.
 * - SignRecognitionFeedbackInput - The input type for the signRecognitionFeedback function.
 * - SignRecognitionFeedbackOutput - The return type for the signRecognitionFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SignRecognitionFeedbackInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "An image frame (photo) of the user signing, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  expectedSign: z.string().describe('The sign the user is attempting to make.'),
});
export type SignRecognitionFeedbackInput = z.infer<typeof SignRecognitionFeedbackInputSchema>;

const SignRecognitionFeedbackOutputSchema = z.object({
  accuracy: z
    .number()
    .describe('The accuracy of the sign, as a percentage between 0 and 100.'),
  feedback: z.string().describe('Feedback on how to improve the sign.'),
  predictedLabel: z.string().describe('The detected sign label.'),
});
export type SignRecognitionFeedbackOutput = z.infer<typeof SignRecognitionFeedbackOutputSchema>;

export async function signRecognitionFeedback(input: SignRecognitionFeedbackInput): Promise<SignRecognitionFeedbackOutput> {
  return signRecognitionFeedbackFlow(input);
}

const signRecognitionFeedbackPrompt = ai.definePrompt({
  name: 'signRecognitionFeedbackPrompt',
  input: {schema: SignRecognitionFeedbackInputSchema},
  output: {schema: SignRecognitionFeedbackOutputSchema},
  prompt: `You are an expert sign language instructor. You will be provided with an image frame (photo) of a user attempting to make a sign, and the sign they are attempting to make. You will:
1) Identify the most likely sign label you detect from the image.
2) Provide an accuracy percentage between 0 and 100.
3) Provide feedback in Spanish on how to improve.

The image is provided as a data URI.

Sign they are attempting to make: {{{expectedSign}}}
Image: {{media url=videoDataUri}}

Please provide your feedback in the following exact JSON-like fields so they can be parsed to the schema:
predictedLabel: <detected sign label>
accuracy: <percentage number 0-100>
feedback: <specific instructions on how to improve in Spanish>`,
});

const signRecognitionFeedbackFlow = ai.defineFlow(
  {
    name: 'signRecognitionFeedbackFlow',
    inputSchema: SignRecognitionFeedbackInputSchema,
    outputSchema: SignRecognitionFeedbackOutputSchema,
  },
  async input => {
    const maxRetries = 3;
    let lastError: unknown;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const {output} = await signRecognitionFeedbackPrompt(input);
        return output!;
      } catch (err) {
        lastError = err;
        // Simple backoff: 500ms, 1000ms, 2000ms
        const delayMs = 500 * Math.pow(2, attempt);
        await new Promise(res => setTimeout(res, delayMs));
      }
    }
    throw lastError;
  }
);
