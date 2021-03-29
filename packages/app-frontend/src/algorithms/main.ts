import { Dictionary } from "@reduxjs/toolkit";
import _ from "lodash";
import { Concept } from "../models/Concept";
import { ReasonoteExercise } from "../models/Exercise/ReasonoteExercise";
import { UserConcept } from "../models/UserConcept";
import { UserExerciseInstance } from "../models/UserExerciseInstance";
import { dictValues, notEmpty, notEmptyMap } from "../utils/typeUtils";


export function getConceptAncestorIds(concept: Concept, allConcepts: Dictionary<Concept>): string[]{
    return []
}


interface CombinedUserConcept extends UserConcept, Concept {
}

interface TimeRankedConcept extends CombinedUserConcept {
    timeRank: number 
}

interface FullRankedConcept extends TimeRankedConcept {
    fullRank: number
}

export function timeRank(userConcept: CombinedUserConcept, activeConcepts: CombinedUserConcept[]): number {
    const stuff = notEmptyMap(activeConcepts, c => c.nextReviewTime.getTime() + 1)
    return 1 - (userConcept.nextReviewTime.getTime() / _.max(stuff)
}

export function minDistanceToConcept(cSource: Concept, cDest: Concept, allConcepts: Dictionary<Concept>): number | undefined {
    // Iterate over all dependencies in a DFS to get the distance to the target concept, if any.
    const distances = notEmptyMap(cSource.preRequisites, (c) => {
        const thisConc = allConcepts[c];
        return thisConc && minDistanceToConcept(thisConc, cDest, allConcepts)
    })

    // Return the minimum of the found distances, or undefined if nothing was found.
    return _.min(distances);
}

export function rank(timeRankedConcept: TimeRankedConcept, activeConcepts: CombinedUserConcept[], allConcepts: Dictionary<Concept>): number {
    return timeRankedConcept.timeRank + _.sum(activeConcepts.map(ac =>  minDistanceToConcept(timeRankedConcept, ac, allConcepts) || 0))
} 

export function determineNextExercise(
    concepts: Dictionary<CombinedUserConcept>,
    exercises: Dictionary<ReasonoteExercise>,
    userExerciseInstances: Dictionary<UserExerciseInstance>
){
    const now = new Date();

    // Get all concepts which are timely.
    const timelyConcepts = dictValues(concepts).filter(c => c.nextReviewTime < now)
    
    // Get the ancestors of each timely concept.
    const ancestorsOfTimelyConcepts = _.flatten(timelyConcepts.map((c) => getConceptAncestorIds(c, concepts)))
    
    // Calculate the score of timely concepts
    const lowScoringTimelyConcepts = timelyConcepts.filter((c) => c.comprehensionScore < .5).map(c => c.id)

    // Calculate total Active concepts by combining timely concepts with low scoring, timely ancestors.
    // This represents the population of possible concepts.
    const activeConceptIds = [
        ...timelyConcepts.map(c => c.id),
        ..._.intersection(ancestorsOfTimelyConcepts, lowScoringTimelyConcepts)
    ]
    const activeConcepts = notEmptyMap(activeConceptIds, c => concepts[c])

    // Calculate time rank
    const timeRankedConcepts = activeConcepts.map((c) => ({...c, timeRank: timeRank(c)}))

    // Next, we rank concepts by how "fundamental" they are.
    const fullRankedConcepts = timeRankedConcepts.map((c) => ({...c, fullRank: rank(c, activeConcepts, concepts)}))


    // const rank(

    // const ranks = subjects.map(s => s.

    // const rank = timeRank(j)
}