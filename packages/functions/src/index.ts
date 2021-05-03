import * as functions from "firebase-functions";
import admin, { firestore } from 'firebase-admin';
import {generateNextReviewTime, getNextExercise as getNextExerciseFunc} from './algorithms/main'
import { UserConcept } from "./models/UserConcept";
import { Concept } from "./models/Concept";
import { ReasonoteExercise } from "./models/Exercise/ReasonoteExercise";
import _ from "lodash";
import { notEmpty } from "./utils/typeUtils";
import { uuid } from "./utils/uuidUtils";
import cors from 'cors';
import * as z from 'zod';
import Exercise from "./services/Exercise";
import ConceptService from "./services/ConceptService";
import UserConceptService from "./services/UserConceptService";
import { normalizeFirestoreData } from "./utils/firebaseUtils";
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

async function makeUserConceptForConcept(concepts: Concept[], userId: string){
  return Promise.all(_.values(concepts).filter(notEmpty).map(async (concept) => {
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

    return await db.collection("userConcepts").doc(userConcept.id).set(userConcept)
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


export const SubmitExerciseGradeRequest = z.object({
  data: z.object({
    userId: z.string(),
    exerciseId: z.string(),
    grade: z.number(),
  })
});
export type SubmitExerciseGradeRequest = z.infer<typeof SubmitExerciseGradeRequest>;

export const submitExerciseGrade = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    try {
      functions.logger.info("Hello logs!, got data ", {structuredData: true, body: request.body});
      const {
        data: {
          userId,
          exerciseId,
          grade,
        }
      } = SubmitExerciseGradeRequest.parse(request.body);

      // Get the exercise
      const exercise = (await Exercise.getExercisesById(db, exerciseId))[0];

      // Calculation locally (for now)
      // - For every concept in the exercise, we must update its comprehension score and next review time.
      exercise?.skills.forEach(async (skill) => {
          const concept = (await ConceptService.getConceptsById(db, skill.subject))[0];

          if (concept){
            const uc = await UserConceptService.getUserConceptNaturally(db, userId, concept.id)

            if (!uc){
              await makeUserConceptForConcept([concept], userId)
            }

            const userConcept = await UserConceptService.getUserConceptNaturally(db, userId, concept.id)

            // TODO there should always be one here...
            // Error out if not.
            if (userConcept){
              const combinedUserConcept = {
                ...userConcept,
                ...concept,
                userId,
                conceptId: concept.id,
              }

              const {newEasinessFactor, newDate, newSuccessfulConsecutiveReviews} = generateNextReviewTime(
                  grade, 
                  combinedUserConcept, 
                  { algorithm: "SuperMemo2SRSData", baseReviewIntervalMS: 1000 * 60 * 60}
              )
              console.log(`concept: ${concept.name}\neasiness ${combinedUserConcept.comprehensionScore} -> ${newEasinessFactor}\nSuccessful Consecutive Reviews ${combinedUserConcept.successfulConsecutiveReviews} -> ${newSuccessfulConsecutiveReviews} after grade: ${grade}`)
              
              // Take the output of generateNextReviewTime and use it to 
              // adjust the UserConcept's next review time and ComprehensionScore
              UserConceptService.updateUserConcept(db, userConcept.id, {
                  // TODO we are going against Retain here, because 
                  // our exercises are not expected to be as "cardinal truth"
                  // as a true user recommendation of comprehension.
                  comprehensionScore: newEasinessFactor,
                  successfulConsecutiveReviews: newSuccessfulConsecutiveReviews,
                  srsData: {
                      ...userConcept.srsData,
                      nextReviewTime: newDate,
                      easinessFactor: newEasinessFactor 
                  },
              })

              response.set('Access-Control-Allow-Origin', '*')
              response.json({data: {success: true}})
            }
            else {
              functions.logger.error("Something went wrong, didn't have userConcept even after we should have made it.", {structuredData: true}); 
            }
        }
      })
    }
    catch(err){
      console.error(err)
      response.json({body: {errors: [{code: 1, name: "Could not run."}]}, errors: {}})
    }
  })
})