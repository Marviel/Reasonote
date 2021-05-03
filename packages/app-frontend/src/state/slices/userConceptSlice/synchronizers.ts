import { Action, CombinedState, EntityId, EntityState, Store } from "@reduxjs/toolkit";
import { RouterState } from "connected-react-router";
import { Concept } from "../../../models/Concept";
import { RootState } from "../../store";
import { fbdb } from '../../../services';
import { DownSynchSubFirebase } from "../../../synch/DownSynchSubFirebase";
import { synchronizers } from "../../../synch";
import { UserConceptStateType } from "./state";
import { ReasonoteExercise } from "../../../models/Exercise/ReasonoteExercise";
import { userConceptUpsert } from ".";
import { UserConcept } from "../../../models/UserConcept";

export class UserConceptDownSynch extends DownSynchSubFirebase<
    RootState,
    Action<any>,
    UserConceptStateType 
> {
    unsubscribers: {[key: string]: () => any} = {};

    updateSubscriptionIds(curStateSlice: UserConceptStateType): string[] {
        return curStateSlice.ids as string[]
    }

    selectSlice(rootState: RootState): UserConceptStateType {
        return rootState.userConcepts
    }

    parseMessage(msg: any | undefined, curStateSlice: UserConceptStateType, curRootState: RootState, getStore: () => Store<RootState, Action<any>>) {
        const res = msg.data();
        
        if (res){
            // Parse the message coming in.
            const userConcept = UserConcept.parse(res)

            return userConceptUpsert(userConcept)
        }
    }
}

const exerciseSynch = new UserConceptDownSynch(fbdb, "/userConcepts")

synchronizers.push(
    (getStore: () => Store) => exerciseSynch.initialize(getStore)
)