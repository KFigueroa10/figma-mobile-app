'use server';

/**
 * @fileOverview A flow that tailors sign language lessons based on the user's progress and identified areas for improvement.
 *
 * - personalizedLearningPaths - A function that returns tailored sign language lessons.
 * - PersonalizedLearningPathsInput - The input type for the personalizedLearningPaths function.
 * - PersonalizedLearningPathsOutput - The return type for the personalizedLearningPaths function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedLearningPathsInputSchema = z.object({
  userProgress: z
    .array(z.object({
      lessonId: z.string(),
      score: z.number().min(0).max(100).describe('The score of the user in the lesson.'),
    }))
    .describe('The user progress in the lessons.'),
  userSkills: z
    .array(z.string())
    .optional()
    .describe('The skills of the user.'),
});
export type PersonalizedLearningPathsInput = z.infer<typeof PersonalizedLearningPathsInputSchema>;

const PersonalizedLearningPathsOutputSchema = z.object({
  lessons: z.array(z.object({
    lessonId: z.string(),
    title: z.string().describe('The title of the lesson.'),
    description: z.string().describe('The description of the lesson.'),
    priority: z.number().describe('The priority of the lesson, the higher the more important it is.'),
  })).describe('The lessons tailored for the user.'),
});
export type PersonalizedLearningPathsOutput = z.infer<typeof PersonalizedLearningPathsOutputSchema>;

export async function personalizedLearningPaths(input: PersonalizedLearningPathsInput): Promise<PersonalizedLearningPathsOutput> {
  return personalizedLearningPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedLearningPathsPrompt',
  input: {schema: PersonalizedLearningPathsInputSchema},
  output: {schema: PersonalizedLearningPathsOutputSchema},
  prompt: `You are an expert sign language tutor.

You will analyze the user's progress and skills, and return a list of lessons that are tailored for the user.

Prioritize lessons where the user has a low score.
Also, consider the user's skills, and return lessons that will help the user improve their skills.

User Progress:
{{#each userProgress}}
- Lesson ID: {{this.lessonId}}, Score: {{this.score}}
{{/each}}

User Skills:
{{#if userSkills}}
{{#each userSkills}}
- {{this}}
{{/each}}
{{else}}
- None
{{/if}}

Output the lessons in JSON format. Make sure the priority field is set appropriately based on the user's progress and skills. The higher the priority, the more important it is for the user to take the lesson.
`,
});

const personalizedLearningPathsFlow = ai.defineFlow(
  {
    name: 'personalizedLearningPathsFlow',
    inputSchema: PersonalizedLearningPathsInputSchema,
    outputSchema: PersonalizedLearningPathsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
