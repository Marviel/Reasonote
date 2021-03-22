import * as z from 'zod';

export const ReasonoteExercise = z.object({
    exerciseType: z.string(),
    id: z.string().uuid(),
    name: z.string(),
    skills: z.array(z.tuple([z.string(), z.number()]))
});
export type ReasonoteExercise = z.infer<typeof ReasonoteExercise>;

export const ReasonoteFlashCardExercise = ReasonoteExercise.extend({
    exerciseType: z.literal("@reasonote/flash-card-exercise"),
    prompt: z.string(),
    response: z.string(),
});
export type ReasonoteFlashCardExercise = z.infer<typeof ReasonoteFlashCardExercise>;
export function isReasonoteFlashCardExercise(o: any): o is ReasonoteFlashCardExercise{
    return o && o.exerciseType && o.exerciseType === "@reasonote/flash-card-exercise"
}