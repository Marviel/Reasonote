import { createEntityAdapter } from "@reduxjs/toolkit"
import { Concept } from "../../../models/Concept"
import { UserConcept } from "../../../models/UserConcept";

/**
 * A helper for creating this state slice
 */
export const userConceptsAdapter = createEntityAdapter<UserConcept>()

/**
 * The initial state of this slice
 */
const initialState = userConceptsAdapter.getInitialState({
    status: 'idle',
})


export const userConceptsInitialState = initialState;
export type UserConceptStateType = typeof initialState;