import { ReasonoteExercise } from "../models/Exercise/ReasonoteExercise"
import { UserConcept } from "../models/UserConcept"
import { dataFromQuery, logMapper, normalizeFirestoreData } from "../utils/firebaseUtils"
import { notEmpty } from "../utils/typeUtils"

export default {
    getUserConceptNaturally: async (db: FirebaseFirestore.Firestore, userId: string, conceptId: string): Promise<UserConcept | undefined> => {
        return ((await dataFromQuery(
                db.collection("userConcepts")
                    .where("userId", "==", userId)
                    .where("conceptId", "==", conceptId)
            ))
            .filter(notEmpty)
            // .map(logMapper("getUserConceptNaturally"))
            .map((d) => normalizeFirestoreData(d))
            .map((d) => UserConcept.nonstrict().parse(d)))[0]
    },
    updateUserConcept: async (db: FirebaseFirestore.Firestore, userConceptId: string, updates: Partial<UserConcept>) => {
        db.collection("userConcepts").doc(userConceptId).update(updates);
    },
}