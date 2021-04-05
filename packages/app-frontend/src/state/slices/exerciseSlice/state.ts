import { createEntityAdapter } from "@reduxjs/toolkit"
import _ from "lodash"
import { ReasonoteExercise } from "../../../models/Exercise/ReasonoteExercise"
import { ReasonoteFlashCardExercise } from "../../../models/Exercise/ReasonoteFlashCardExercise"

/**
 * A helper for creating this state slice
 */
export const exercisesAdapter = createEntityAdapter<ReasonoteExercise>()

/**
 * The initial state of this slice
 */
const initialState = exercisesAdapter.getInitialState({
    status: 'idle',
})

const arr = [
    {
        id: "5",
        exerciseType: "@reasonote/flash-card-exercise",
        skills:[{subject: "@reasonote/arithmetic/addition-is-opposite-of-subtraction", strength: 1}],
        name: "Solve for X: 10 = 1 + X",
        prompt: "Solve for X: 10 = 1 + X",
        response: "9"
    },
    {
        id: "4",
        exerciseType: "@reasonote/flash-card-exercise",
        skills:[{subject: "@reasonote/arithmetic/division", strength: 1}],
        name: "Division Exercise",
        prompt: "What is 10 / 5?",
        response: "2"
    },
    {
        id: "3",
        exerciseType: "@reasonote/flash-card-exercise",
        skills:[{subject: "@reasonote/arithmetic/multiplication", strength: 1}],
        name: "Multiplication",
        prompt: "What is 3*4?",
        response: "12"
    },
    {
        id: "2",
        exerciseType: "@reasonote/flash-card-exercise",
        skills:[{subject: "@reasonote/arithmetic/addition", strength: 1}],
        name: "What is 4 + 5?",
        prompt: "What is 4 + 5?",
        response: "9"
    },
    {
        id: "1",
        exerciseType: "@reasonote/flash-card-exercise",
        skills:[{subject: "@reasonote/arithmetic/addition", strength: 1}],
        name: "What is 3 + 4?",
        prompt: "What is 3 + 4?",
        response: "7"
    },
    {
        id: "9",
        exerciseType: "@reasonote/flash-card-exercise",
        skills:[{subject: "@reasonote/arithmetic/subtraction", strength: 1}],
        name: "What is 3 - 1",
        prompt: "What is 3 - 1?",
        response: "2"
    },
    {
        id: "6",
        exerciseType: "@reasonote/flash-card-exercise",
        skills:[
            {subject: "@reasonote/arithmetic/addition", strength: 1},
            {subject: "@reasonote/arithmetic/multiplication", strength: 1},
            {subject: "@reasonote/arithmetic/order-of-operations/addition-multiplication", strength: 1}
        ],
        name: "What is 3 + 4 * 2?",
        prompt: "What is 3 + 4 * 2?",
        response: "11"
    },
    {
        id: "7",
        exerciseType: "@reasonote/flash-card-exercise",
        skills:[
            {subject: "@reasonote/arithmetic/addition", strength: 1},
            {subject: "@reasonote/arithmetic/multiplication", strength: 1},
            {subject: "@reasonote/arithmetic/order-of-operations/addition-multiplication", strength: 1}
        ],
        name: "What is 3 + 4 / 2?",
        prompt: "What is 3 + 4 / 2?",
        response: "4"
    },
    {
        id: "8",
        exerciseType: "@reasonote/flash-card-exercise",
        skills:[
            {subject: "@reasonote/arithmetic/subtraction", strength: 1},
            {subject: "@reasonote/arithmetic/multiplication", strength: 1},
            {subject: "@reasonote/arithmetic/order-of-operations/subtraction-multiplication", strength: 1}
        ],
        name: "What is 7 - 2 * 2?",
        prompt: "What is 7 - 2 * 2?",
        response: "3"
    },
] as ReasonoteFlashCardExercise[]

initialState.entities = Object.fromEntries(arr.map((c)=> [c.id, c]))
initialState.ids = _.keys(initialState.entities);

export const exercisesInitialState = initialState;