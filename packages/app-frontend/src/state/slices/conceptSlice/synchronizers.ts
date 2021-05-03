import { Action, CombinedState, EntityId, EntityState, Store } from "@reduxjs/toolkit";
import { RouterState } from "connected-react-router";
import { Concept } from "../../../models/Concept";
import { RootState } from "../../store";
import { ConceptStateType } from "./state";
import { fbdb } from '../../../services';
import { conceptUpdate, conceptUpsert } from ".";
import { DownSynchSubFirebase } from "../../../synch/DownSynchSubFirebase";
import { synchronizers } from "../../../synch";

export class ConceptDownSynch extends DownSynchSubFirebase<
    RootState,
    Action<any>,
    ConceptStateType
> {
    unsubscribers: {[key: string]: () => any} = {};

    updateSubscriptionIds(curStateSlice: ConceptStateType): string[] {
        return curStateSlice.ids as string[]
    }

    selectSlice(rootState: RootState): ConceptStateType {
        return rootState.concepts
    }

    parseMessage(msg: any | undefined, curStateSlice: ConceptStateType, curRootState: RootState, getStore: () => Store<RootState, Action<any>>) {
        const res = msg.data();
        
        if (res){
            // Parse the message coming in.
            const concept = Concept.parse(res)

            return conceptUpsert(concept)
        }

        // TODO remove the entity from our store if it no longer exists,
        // OR put a "Does Not Exist" there to show that it doesn't exist.
    }
}

const conceptSynch = new ConceptDownSynch(fbdb, "/concepts")

synchronizers.push(
    (getStore: () => Store) => conceptSynch.initialize(getStore)
)