import {
    createSlice,
} from '@reduxjs/toolkit'
import _ from 'lodash';
import { conceptsAdapter, conceptsInitialState } from './state';



/**
 * This slice of the overall redux store.
 */
export const conceptsSlice = createSlice({
    name: 'messages',
    initialState: conceptsInitialState,
    reducers: {
        conceptDeleted: conceptsAdapter.removeOne,
        conceptAdded: conceptsAdapter.addOne,
        conceptUpsert: conceptsAdapter.upsertOne,
        conceptUpsertMany: conceptsAdapter.upsertMany,
        conceptUpdate: conceptsAdapter.updateOne,
        conceptSetAll: conceptsAdapter.setAll
    },
})

export const {
    conceptAdded,
    conceptDeleted,
    conceptUpdate,
    conceptUpsert,
    conceptUpsertMany,
    conceptSetAll
} = conceptsSlice.actions

export * from './selectors';
export * from './synchronizers';


export default conceptsSlice.reducer; 