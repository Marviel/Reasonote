import { Action, combineReducers, configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit'

import _ from 'lodash';
import thunk from 'redux-thunk';
import {
  connectRouter,
  routerMiddleware,
} from 'connected-react-router';
import { createBrowserHistory, History } from 'history'
import exercisesReducer from './slices/exerciseSlice'

// This is a reducer which will cache the last action executed
// on the state. It technically breaks Redux's focus on predictability
// but we are only going to use it in specific, well-understood contexts.
function unsafeLastAction(state = null, action: Action<any>) {
    return action;
}

/** 
 * A browser history object, for tracking where we have been.
*/
export const history: History<{selectedAnnotationId: string}> = createBrowserHistory();

// Combine all our reducers into a single mega-reducer.
const rootReducer = combineReducers({
  router: connectRouter(history),
  unsafeLastAction,
  exercises: exercisesReducer,
})

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({serializableCheck: false, immutableCheck: false}),
    // For allowing us to dispatch asynchronous actions.
    thunk,
    // For synchronizing the redux store with the current url
    // including URL Query Params, Hash Handling, and Routing.
    // More information at: https://github.com/supasate/connected-react-router
    routerMiddleware(history),
  ]
})

/** 
 * Our application's store -- the place from which nearly every
 * piece of shared data should be stored and derived.
*/
export default store

/** 
 * The type of our application's store.
*/
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch