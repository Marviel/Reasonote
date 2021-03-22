import { createEntityAdapter } from "@reduxjs/toolkit"
import { ReasonoteExercise, ReasonoteFlashCardExercise } from "../../../models/Exercise"

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

initialState.entities["1"] = {
    id: "1",
    exerciseType: "@reasonote/flash-card-exercise",
    skills:[],
    name: "My First Exercise",
    prompt: "What is the capital of Zimbabwe?",
    response: "Harare"
} as ReasonoteFlashCardExercise

export const exercisesInitialState = initialState;