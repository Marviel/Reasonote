import { ReasonoteExercise } from "../models/Exercise/ReasonoteExercise"
import { dataFromQuery, logMapper, normalizeFirestoreData } from "../utils/firebaseUtils"
import { notEmpty } from "../utils/typeUtils"

export default {
    getExercisesById: async (db: FirebaseFirestore.Firestore, exerciseId: string) => {
        return (await dataFromQuery(db.collection("exercises").where("id", "==", exerciseId)))
            .filter(notEmpty)
            .map((d) => normalizeFirestoreData(d))
            // .map(logMapper("getExercisesById"))
            .map((d) => ReasonoteExercise.nonstrict().parse(d))
    }
}