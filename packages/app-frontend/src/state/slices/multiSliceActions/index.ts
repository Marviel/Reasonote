import { push } from "connected-react-router";
import _ from "lodash";
import { ReasonoteFlashCardExercise } from "../../../models/Exercise/ReasonoteFlashCardExercise";
import { RootState } from "../../store";
import { exerciseAdded } from "../exerciseSlice";
import {v4 as uuidv4} from 'uuid'
import firebase from "firebase";
import { ReasonoteExercise } from "../../../models/Exercise/ReasonoteExercise";
import { fbdb } from "../../../services";


export function beginNextExercise(userId: string) {
    return async function(dispatch: any, getState: () => RootState) {
        const state = getState();

        if (state) {
            const res = await firebase.functions().httpsCallable("getNextExercise")()
            const nextExercise = ReasonoteExercise.nonstrict().parse(res.data)

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
            const newId = uuidv4();
            const newObj = {
                id: newId,
                exerciseType: "@reasonote|flash-card-exercise",
                skills: concepts,
                name: prompt,
                prompt,
                response
            }
            // Update the remote database.
            await fbdb.collection("exercises").doc(newId).set(newObj)

            // Put the model locally.
            return Promise.all([
                dispatch(
                    exerciseAdded(newObj as ReasonoteFlashCardExercise)
                )
            ])
        }

        return Promise.resolve();
    };
}