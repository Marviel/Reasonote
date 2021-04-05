import * as z from 'zod';

export interface SRSData {
    srsDataType: string
}

export const SuperMemo2SRSData = z.object({
    srsDataType: z.literal("SuperMemo2SRSData"),
    /** SM-2 Derived Easiness Factor (AKA E-Factor, or EF) for items, with range 0-5
     * 0: "Total blackout", complete failure to recall the information.
     * 1: Incorrect response, but upon seeing the correct answer it felt familiar.
     * 2: Incorrect response, but upon seeing the correct answer it seemed easy to remember.
     * 3: Correct response, but required significant difficulty to recall.
     * 4: Correct response, after some hesitation.
     * 5: Correct response with perfect recall.
    */
    easinessFactor: z.number(),
    /** The next time a User is supposed to review the concept. */
    nextReviewTime: z.date(),
})

export const UserConcept = z.object({
    id: z.string(),
    userId: z.string(),
    conceptId: z.string(),
    comprehensionScore: z.number().optional(),
    userDeterminedImportance: z.number().optional(),
    successfulConsecutiveReviews: z.number(),
    srsData: SuperMemo2SRSData,
});
export type UserConcept = z.infer<typeof UserConcept>;