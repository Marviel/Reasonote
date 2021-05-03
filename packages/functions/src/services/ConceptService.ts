import { Concept } from "../models/Concept"
import { ReasonoteExercise } from "../models/Exercise/ReasonoteExercise"
import { dataFromQuery, logMapper, normalizeFirestoreData } from "../utils/firebaseUtils"
import { notEmpty } from "../utils/typeUtils"

export default {
    getConceptsById: async (db: FirebaseFirestore.Firestore, conceptId: string) => {
        return (await dataFromQuery(db.collection("concepts").where("id", "==", conceptId)))
            .filter(notEmpty)
            .map(logMapper("getConceptsById Before normalize"))
            .map((d) => normalizeFirestoreData(d))
            .map(logMapper("getConceptsById"))
            .map((d) => Concept.nonstrict().parse(d))
    }
}