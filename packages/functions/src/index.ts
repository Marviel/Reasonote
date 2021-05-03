import * as functions from "firebase-functions";
import admin, { firestore } from 'firebase-admin';
import {getNextExercise as getNextExerciseFunc} from './algorithms/main'
import { UserConcept } from "./models/UserConcept";
import { Concept } from "./models/Concept";
import { ReasonoteExercise } from "./models/Exercise/ReasonoteExercise";
import _ from "lodash";
import { notEmpty } from "./utils/typeUtils";
import { uuid } from "./utils/uuidUtils";
import cors from 'cors';
const corsHandler = cors({origin: true});

admin.initializeApp();
const db = admin.firestore();

// exports.writeToFirestore = functions.firestore
//   .document('some/doc')
//   .onWrite((change, context) => {
//     db.doc('some/otherdoc').set({ ... });
//   });


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase -- We made a change!");
});


async function dataFromQuery(snapshot: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>){
  return (await snapshot.get()).docs.map(doc => doc.data())
}

function makeUserConceptForConcept(concepts: Concept[], userId: string){
  return _.values(concepts).filter(notEmpty).forEach(async (concept) => {
    const userConcept: UserConcept = {
      id: uuid(),
      userId: userId,
      conceptId: concept.id,
      successfulConsecutiveReviews: 0,
      srsData: {
          srsDataType: "SuperMemo2SRSData",
          easinessFactor: 2.5,
          nextReviewTime: new Date()
      }
    }

    await db.collection("userConcepts").doc(userConcept.id).set(userConcept)
  })
}

function normalizeFirestoreData(dat: {[k: string]: any}): any {
  return _.fromPairs(Object.keys(dat).map((k) => {
    
    const v = dat[k];
    if(v instanceof firestore.Timestamp){
      return [k, v.toDate()]
    } else if (typeof v === 'object' && v !== null){
      return [k, normalizeFirestoreData(v)]
    }
    else {
      return [k, v]
    }
  }))
}


export const getNextExercise = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    // Get all userConcepts for this user
    console.log("userConcepts...")
    var userConceptsList = (await dataFromQuery(db.collection("userConcepts").where("userId", "==", "DUMMY_USER")))
      .filter(notEmpty)
      .map((d) => {
        return UserConcept.nonstrict().parse(normalizeFirestoreData(d))
      })
    var userConcepts = _.fromPairs(userConceptsList
        .map((uc) => [uc.id as string, uc])
    )
    const userConceptIdsList = userConceptsList.map((uc) => uc.conceptId)
    console.log("... userConcept length", userConceptsList.length)

    // Get all concepts
    console.log("concepts...")
    const conceptsList = (await dataFromQuery(db.collection("concepts")))
        .filter(notEmpty)
        .map((d) => Concept.nonstrict().parse(d))
    const concepts = _.fromPairs(conceptsList
        .map((c) => [c.id as string, c])
    )
    const conceptIdsList = conceptsList.map((c) => c.id)
    console.log("... concept Length", conceptsList.length)

    // Make concepts for user if they don't already exist
    const missingIds = _.difference(conceptIdsList, userConceptIdsList)
    console.log("making ids....", missingIds)
    await makeUserConceptForConcept(conceptsList.filter(c => _.includes(missingIds, c.id)), "DUMMY_USER")

    // Get them again....
    userConceptsList = (await dataFromQuery(db.collection("userConcepts").where("userId", "==", "DUMMY_USER")))
      .filter(notEmpty)
      .map((d) => UserConcept.nonstrict().parse(normalizeFirestoreData(d)))
    userConcepts = _.fromPairs(userConceptsList
        .map((uc) => [uc.id as string, uc])
    )
    
    // Get all exercises
    console.log("exercises...")
    const exercises = _.fromPairs((await dataFromQuery(db.collection("exercises")))
        .filter(notEmpty)
        .map((d) => ReasonoteExercise.nonstrict().parse(d))
        .map((e) => [e.id as string, e]))
    
    // For all concepts, merge with userConcepts to get userCombined concepts
    console.log("userCombined...")
    const userCombined = _.fromPairs(_.values(concepts).map((c) => {
      const userConcept = _.values(userConcepts).find((uc) => uc.conceptId === c.id)
      if (userConcept){
        const combined = {...userConcept, ...c, userId: "DUMMY_USER", conceptId: c.id, comprehensionScore: userConcept?.comprehensionScore}
        return [c.id, combined]
      } else {
        throw Error("Data integrity error. No User concept existed for user.")
      }
    }))
    console.log("... userCombined length", Object.keys(userCombined).length)

    const result = getNextExerciseFunc(userCombined, exercises, {})
    response.set('Access-Control-Allow-Origin', '*')
    response.json(result ? {"data": result} : {"data": {}, "error": "Could not get Next Exercise Function."})
  })
})