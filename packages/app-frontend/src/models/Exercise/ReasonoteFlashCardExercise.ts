import { ReasonoteExercise } from "./ReasonoteExercise";
import * as z from 'zod';

export const ReasonoteFlashCardExercise = ReasonoteExercise.extend({
    exerciseType: z.literal("@reasonote|flash-card-exercise"),
    prompt: z.string(),
    response: z.string(),
});
export type ReasonoteFlashCardExercise = z.infer<typeof ReasonoteFlashCardExercise>;
export function isReasonoteFlashCardExercise(o: any): o is ReasonoteFlashCardExercise{
    return o && o.exerciseType && o.exerciseType === "@reasonote|flash-card-exercise"
}