import * as z from 'zod';

export const UserConcept = z.object({
    userId: z.string().uuid(),
    conceptId: z.string().uuid(),
    comprehensionScore: z.number(),
    userDeterminedImportance: z.number(),
    /** The next time a User is supposed to review the concept. */
    nextReviewTime: z.date(),
});
export type UserConcept = z.infer<typeof UserConcept>;