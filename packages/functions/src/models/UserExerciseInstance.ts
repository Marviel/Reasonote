import * as z from 'zod';

export const UserExerciseInstance = z.object({
    userId: z.string().uuid(),
    exerciseId: z.string().uuid(),
    dateTime: z.date(),
    score: z.number(),
});
export type UserExerciseInstance = z.infer<typeof UserExerciseInstance>;