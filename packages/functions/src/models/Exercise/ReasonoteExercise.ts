import * as z from 'zod';

export const ReasonoteExercise = z.object({
    exerciseType: z.string(),
    id: z.string(),
    name: z.string(),
    skills: z.array(z.object({subject: z.string(), strength: z.number()}))
});
export type ReasonoteExercise = z.infer<typeof ReasonoteExercise>;

