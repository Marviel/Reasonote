import {
    createSlice,
} from '@reduxjs/toolkit'
import _ from 'lodash';
import { exercisesAdapter, exercisesInitialState } from './state';



/**
 * This slice of the overall redux store.
 */
export const exercisesSlice = createSlice({
    name: 'messages',
    initialState: exercisesInitialState,
    reducers: {
        exerciseDeleted: exercisesAdapter.removeOne,
        exerciseAdded: exercisesAdapter.addOne,
        exerciseUpsert: exercisesAdapter.upsertOne,
        exerciseUpsertMany: exercisesAdapter.upsertMany,
        exerciseUpdate: exercisesAdapter.updateOne,
        exerciseSetAll: exercisesAdapter.setAll
    },
})

export const {
    exerciseAdded,
    exerciseDeleted,
    exerciseUpdate,
    exerciseUpsert,
    exerciseUpsertMany,
    exerciseSetAll
} = exercisesSlice.actions

export * from './selectors';
export * from './synchronizers';


export default exercisesSlice.reducer; 