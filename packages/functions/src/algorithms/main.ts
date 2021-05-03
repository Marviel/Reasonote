import { Dictionary } from "@reduxjs/toolkit";
import _ from "lodash";
import { Concept } from "../models/Concept";
import { ReasonoteExercise } from "../models/Exercise/ReasonoteExercise";
import { UserConcept } from "../models/UserConcept";
import { UserExerciseInstance } from "../models/UserExerciseInstance";
import { dictValues, notEmpty, notEmptyMap } from "../utils/typeUtils";


export function getConceptAncestorIds(conceptId: string, allConcepts: Dictionary<Concept>): string[]{
    const concept = allConcepts[conceptId];
    
    if (concept){
        var ancestors = [...concept.preRequisites];
        const prerequisitesToConsider = Array.from(concept.preRequisites)

        while (prerequisitesToConsider.length > 0){
            const thisPrereq = prerequisitesToConsider.pop()
            ancestors = [...ancestors, ...getConceptAncestorIds(thisPrereq as string, allConcepts)]
        }

        return ancestors;
    }

    throw new Error(`could not find concept ${conceptId}`)
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
    const maxReviewTime = _.max(notEmptyMap(activeConcepts, c => c.srsData.nextReviewTime.getTime()))

    if (!maxReviewTime){
        throw new Error("Could not find maximum.")
    }

    return 1 - (userConcept.srsData.nextReviewTime.getTime() / (maxReviewTime + 1));
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


export function conceptIsReachableFrom(concept: Concept, testSet: Dictionary<Concept>, allConcepts: Dictionary<Concept>): boolean {
    const ancestorIds = getConceptAncestorIds(concept.id, allConcepts)

    // If any of our ancestors are in the test set, we are in some way touching the testSet.
    return _.some(ancestorIds, (a) => a in testSet)
}

export function conceptPrerequisitesMet(concept: Concept, testSet: Dictionary<Concept>, allConcepts: Dictionary<Concept>): boolean {
    const ancestorIds = getConceptAncestorIds(concept.id, allConcepts)

    // console.log("ancestors, testSet", concept, ancestorIds, testSet)

    // If any of our ancestors are in the test set, we are in some way touching the testSet.
    return _.every(ancestorIds, (a) => a in testSet)
}

export function conceptIsTeachableForUser(conceptId: string, allConcepts: Dictionary<CombinedUserConcept>){
    // Filter all concepts down to concepts which have been sufficiently "learned"    
    const learnedConcepts = _.values(allConcepts)
        .filter(notEmpty)
        .filter((c) => c.comprehensionScore ? c.comprehensionScore > 2.5 : false)
        .map((c) => [c.id, c])

    const concept = allConcepts[conceptId];

    if (concept){
        // Determine if this concept is still reachable within this pared down graph.
        const ret = conceptPrerequisitesMet(concept, _.fromPairs(learnedConcepts), allConcepts)

        console.log(`Concept ${conceptId} was determined: ${ret}`)
        return ret; 
    } 
    else {
        throw new Error(`Concept ${conceptId} did not exist in the provided set of concepts.`)
    }
}



export function getNextExercise(
    concepts: Dictionary<CombinedUserConcept>,
    exercises: Dictionary<ReasonoteExercise>,
    userExerciseInstances: Dictionary<UserExerciseInstance>
): ReasonoteExercise | undefined {
    /** Get fully ranked versions of concepts */
    const fullRankedConcepts = getFullRankedConcepts(concepts)

    console.log("getNextExercise: concepts", concepts)

    /** Iterate over exercises and get the "aggregate rank" for each exercise
     * based on the scores of the concepts that exercise teaches.
     */
    //@ts-ignore
    const exerciseAggregateRanks: ([string, {averageConceptRank: number, isReachable: boolean}])[] = 
        _.entries(exercises).map(([k, e]) => {
            if (e){
                // Determine if this concept is teachable given what the user currently knows.
                const isReachable = _.every(e.skills.map((s) => conceptIsTeachableForUser(s.subject, concepts)))
                
                // Get the aggregation of all concept ranks.
                const aggregateConceptRank = _.reduce(e.skills, (acc, cur) => {
                    const theConcept = fullRankedConcepts[cur.subject]
                    
                    if (theConcept){
                        return theConcept.fullRank
                    } else {
                        console.error(`Could not find concept for id: ${cur.subject}`)
                        return 0;
                    }
                }, 0)

                const averageConceptRank = aggregateConceptRank/e.skills.length;

                return [k, {averageConceptRank, isReachable}];
            }

            // We shouldn't get here unless we messed up elsewhere.
            console.error(`Was not able to find exercise ${k}. There is likely an error upstream of this.`)
            return undefined;
        })
        .filter(notEmpty)

    // TODO implement a "check blocked" function which will determine which concepts aren't
    // yet reachable with the student's current knowledge.
    const teachableToUser = exerciseAggregateRanks.filter(([k, e]) => e.isReachable)

    /** Sort exercises by aggregate rank, with highest ranking items coming first. */
    const sortedExerciseAggregateRanks = _.sortBy(teachableToUser, ([k, e]) => -e.averageConceptRank);

    
    console.log("Exercises, sorted", sortedExerciseAggregateRanks.map(([k, r]) => exercises[k]))


    const chosenExerciseId = sortedExerciseAggregateRanks[0][0];

    if (chosenExerciseId){
        const chosenExercise = exercises[chosenExerciseId];
        return chosenExercise;
    } else {
        return undefined;
    }
}


export function getFullRankedConcepts(
    concepts: Dictionary<CombinedUserConcept>,
): Dictionary<FullRankedConcept> {
    const now = new Date();

    // Get all concepts which are timely.
    const timelyConcepts = dictValues(concepts).filter(c => c.srsData.nextReviewTime < now)
    
    // Get the ancestors of each timely concept.
    const ancestorsOfTimelyConcepts = _.flatten(timelyConcepts.map((c) => getConceptAncestorIds(c.id, concepts)))
    
    // Calculate the score of timely concepts
    const lowScoringTimelyConcepts = timelyConcepts.filter((c) => c.comprehensionScore ? c.comprehensionScore <= 2 : true).map(c => c.id)

    // Calculate total Active concepts by combining timely concepts with low scoring, timely ancestors.
    // This represents the population of possible concepts.
    const activeConceptIds = [
        ...timelyConcepts.map(c => c.id),
        ..._.intersection(ancestorsOfTimelyConcepts, lowScoringTimelyConcepts)
    ]
    const activeConcepts = notEmptyMap(activeConceptIds, c => concepts[c])

    // Calculate time rank
    const timeRankedConcepts = Object.values(concepts).filter(notEmpty).map((c) => ({...c, timeRank: timeRank(c, activeConcepts)})).filter((c) => c.timeRank !== undefined)


    const fullRankedConcepts = timeRankedConcepts.map((c) => {
        //@ts-ignore
        return {...c, fullRank: rank(c, activeConcepts, concepts)}
    }) 
    
    console.log(_.sortBy(fullRankedConcepts, (c) => c.fullRank).map((c) => c.name))

    // Next, we rank concepts by how "fundamental" they are.
    return _.fromPairs(fullRankedConcepts.map((c) => [c.id, c]))
}


export interface GenerateNextReviewTimeOptions {
    algorithm: "SuperMemo2SRSData",
    /** The review interval in milliseconds to use. */
    baseReviewIntervalMS: number,
}


/**
 * Generates the next review time for a concept after its review,
 * using the SuperMemo2 Algorithm.
 * @param grade The grade on the exercise, from 0 to 5
 * @param concept The concept in question
 */
export function generateNextReviewTime(grade: number, concept: CombinedUserConcept, options: GenerateNextReviewTimeOptions): {
    newEasinessFactor: number,
    newSuccessfulConsecutiveReviews: number,
    newDate: Date,
} {
    var newInterval: number = 0; // This will be overwritten.    
    var newEasinessFactor: number = concept.srsData.easinessFactor;
    var newSuccessfulConsecutiveReviews: number | undefined = undefined; 

    // "Correct response"
    if (grade >= 3){
        newInterval = concept.successfulConsecutiveReviews == 0 ? 
            1
            :
            (concept.successfulConsecutiveReviews == 1 ?
                6
                :
                concept.successfulConsecutiveReviews * concept.srsData.easinessFactor
            )
        
        newEasinessFactor = concept.srsData.easinessFactor + (.1 - ((5 - grade) * (.08 + (5 - grade) * .02)))
        newEasinessFactor = newEasinessFactor < 1.3 ? 1.3 : newEasinessFactor
        newSuccessfulConsecutiveReviews = concept.successfulConsecutiveReviews + 1;
    }
    // "Incorrect response"
    else {
        newInterval = 0;
        newSuccessfulConsecutiveReviews = 0;
    }

    return {
        newEasinessFactor,
        newSuccessfulConsecutiveReviews,
        newDate: new Date(concept.srsData.nextReviewTime.getTime() + (options.baseReviewIntervalMS*newInterval)),
    }
}

