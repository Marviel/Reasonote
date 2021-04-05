import { push } from "connected-react-router";
import _ from "lodash";
import { ReasonoteFlashCardExercise } from "../../../models/Exercise/ReasonoteFlashCardExercise";
import { RootState } from "../../store";
import { exerciseAdded, selectAllExercises, selectExerciseById } from "../exerciseSlice";
import {v4 as uuidv4} from 'uuid'
import { generateNextReviewTime, getNextExercise } from "../../../algorithms/main";
import { selectConceptById } from "../conceptSlice";
import { selectUserCombinedConcepts, selectUserConceptById, selectUserConceptNaturally, userConceptAdded, userConceptUpdate } from "../userConceptSlice";
import { UserConcept } from "../../../models/UserConcept";


export function submitExerciseGrade(exerciseId: string, userId: string, grade: number) {
    return async function(dispatch: any, getState: () => RootState) {
        const state = getState();
        
        console.log(exerciseId, userId, grade)
        console.log(state.userConcepts)

        if (state) {
            // TODO Submit grade to server,
            // let algorithmic calculation happen there.
            
            // Get the exercise
            const exercise = selectExerciseById(state, exerciseId);

            // Calculation locally (for now)
            // - For every concept in the exercise, we must update its comprehension score and next review time.
            exercise?.skills.forEach(async (skill) => {
                const concept = selectConceptById(state, skill.subject);
                if (concept){
                    // TODO Get or Create UserConcept.
                    const uc = selectUserConceptNaturally(state, userId, skill.subject);
                    const userConcept: UserConcept = uc ? uc : {
                        id: uuidv4(),
                        userId,
                        conceptId: skill.subject,
                        successfulConsecutiveReviews: 0,
                        srsData: {
                            srsDataType: "SuperMemo2SRSData",
                            easinessFactor: 2.5,
                            nextReviewTime: new Date()
                        }
                    }
                    if (!uc){
                        await dispatch(userConceptAdded(userConcept))
                    }

                    const combinedUserConcept = {
                        ...userConcept,
                        ...concept,
                    }

                    if (userConcept){
                        const {newEasinessFactor, newDate, newSuccessfulConsecutiveReviews} = generateNextReviewTime(
                            grade, 
                            combinedUserConcept, 
                            { algorithm: "SuperMemo2SRSData", baseReviewIntervalMS: 1000 * 60 * 60}
                        )
                        console.log(`concept: ${concept.name}\neasiness ${combinedUserConcept.comprehensionScore} -> ${newEasinessFactor}\nSuccessful Consecutive Reviews ${combinedUserConcept.successfulConsecutiveReviews} -> ${newSuccessfulConsecutiveReviews} after grade: ${grade}`)
                        
                        // Take the output of generateNextReviewTime and use it to 
                        // adjust the UserConcept's next review time and ComprehensionScore
                        await dispatch(userConceptUpdate({id: userConcept.id, changes: {
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
                        }}))


                    }
                }
            })

            return Promise.all([
                // TODO create (or update?) UserExerciseInstance
                    // TODO Creating / updating this entity with a grade should update
                    // all our concepts using the srs algorithm. 

            ])
        }

        return Promise.resolve();
    };
}

export function beginNextExercise(userId: string) {
    return async function(dispatch: any, getState: () => RootState) {
        const state = getState();

        if (state) {
            const userCombinedConcepts = Object.fromEntries(selectUserCombinedConcepts(state).map((uc) => [uc.id, uc]))

            // TODO Get next exercise.
            const nextExercise = getNextExercise(userCombinedConcepts, state.exercises.entities, {})

            if (nextExercise){
                return Promise.all([
                    dispatch(push(`/exercises/${nextExercise.id}`))
                ])
            }
        }

        return Promise.resolve();
    };
}

export function createFlashCardExercise(prompt: string, response: string, concepts: {subject: string, strength: number}[]=[]) {
    return async function(dispatch: any, getState: () => RootState) {
        const state = getState();

        if (state) {
            // TODO Post Exercise to server
            // and create exercise.
            const newId = uuidv4();

            return Promise.all([
                dispatch(
                    exerciseAdded({
                        id: newId,
                        exerciseType: "@reasonote/flash-card-exercise",
                        skills: concepts,
                        name: prompt,
                        prompt,
                        response
                    } as ReasonoteFlashCardExercise)
                )
            ])
        }

        return Promise.resolve();
    };
}