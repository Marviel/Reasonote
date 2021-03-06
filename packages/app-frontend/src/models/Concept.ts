import _ from 'lodash';
import * as z from 'zod';
import { ReasonoteExercise } from './Exercise/ReasonoteExercise';
import { UserExerciseInstance } from './UserExerciseInstance';

export const Concept = z.object({
    id: z.string(),
    name: z.string(),
    preRequisites: z.array(z.string()),
});
export type Concept = z.infer<typeof Concept>;
