import { Action, CombinedState, EntityId, EntityState, Store } from "@reduxjs/toolkit";
import { RouterState } from "connected-react-router";
import { Concept } from "../../../models/Concept";
import { RootState } from "../../store";
import { fbdb } from '../../../services';
import { DownSynchSubFirebase } from "../../../synch/DownSynchSubFirebase";
import { synchronizers } from "../../../synch";
import { ExerciseStateType } from "./state";
import { ReasonoteExercise } from "../../../models/Exercise/ReasonoteExercise";
import { exerciseUpsert } from ".";

export class ExerciseDownSynch extends DownSynchSubFirebase<
    RootState,
    Action<any>,
    ExerciseStateType 
> {
    unsubscribers: {[key: string]: () => any} = {};

    updateSubscriptionIds(curStateSlice: ExerciseStateType): string[] {
        return curStateSlice.ids as string[]
    }

    selectSlice(rootState: RootState): ExerciseStateType {
        return rootState.exercises
    }

    parseMessage(msg: any | undefined, curStateSlice: ExerciseStateType, curRootState: RootState, getStore: () => Store<RootState, Action<any>>) {
        const res = msg.data();
        
        if (res){
            // Parse the message coming in.
            const exercise = ReasonoteExercise.parse(res)

            return exerciseUpsert(exercise)
        }
    }
}

const exerciseSynch = new ExerciseDownSynch(fbdb, "/exercises")

synchronizers.push(
    (getStore: () => Store) => exerciseSynch.initialize(getStore)
)