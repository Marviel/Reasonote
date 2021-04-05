import {
    createSlice,
} from '@reduxjs/toolkit'
import _ from 'lodash';
import { userConceptsAdapter, userConceptsInitialState } from './state';

/**
 * This slice of the overall redux store.
 */
export const userConceptsSlice = createSlice({
    name: 'messages',
    initialState: userConceptsInitialState,
    reducers: {
        userConceptDeleted: userConceptsAdapter.removeOne,
        userConceptAdded: userConceptsAdapter.addOne,
        userConceptUpsert: userConceptsAdapter.upsertOne,
        userConceptUpsertMany: userConceptsAdapter.upsertMany,
        userConceptUpdate: userConceptsAdapter.updateOne,
        userConceptSetAll: userConceptsAdapter.setAll
    },
})

export const {
    userConceptAdded,
    userConceptDeleted,
    userConceptUpdate,
    userConceptUpsert,
    userConceptUpsertMany,
    userConceptSetAll
} = userConceptsSlice.actions

export * from './selectors';
export * from './synchronizers';


export default userConceptsSlice.reducer; 