
import {Action, PayloadAction, Store} from '@reduxjs/toolkit'
import _ from 'lodash';
import { DownSynch } from './DownSynch';

export abstract class DownSynchSub<
    RootStateT, 
    RootActionT extends Action<any>, 
    StateSliceT,
    MsgT,
    SubIdT extends string | number,
> extends DownSynch<RootStateT, RootActionT, StateSliceT, MsgT> {
    _isInitialized: boolean = false;
    subscribedToIds: SubIdT[] = [];

    /**
     * Initializes this class instance.
     * @param getStore 
     */
    initialize(getStore: () => Store<RootStateT, RootActionT>){
        this.getStore = getStore;
        this.initializeSubscriptions(getStore);
        
        // TODO technically, explicitly getting the store and setting the subscription in this way
        // breaks some things, because if the store changes
        // We won't get subscriptions anymore. However, this is unlikely to happen often.
        const store = getStore()
        store.subscribe(() => {
            const state = store.getState();
            const stateSlice = this.selectSlice(state);


            // Based on our local state, we determine if we want to update our subscriptions.
            const previousSubscribedToIds = this.subscribedToIds;
            this.subscribedToIds = this.updateSubscriptionIds(stateSlice, state, getStore);

            const unsubscribingFrom = _.difference(previousSubscribedToIds, this.subscribedToIds);            
            const subscribingTo = _.difference(this.subscribedToIds, previousSubscribedToIds);

            this.unsubscribe(unsubscribingFrom);
            this.subscribe(subscribingTo);
        })

        this._isInitialized = true;
    }

    /**
     * 
     * @returns Whether or not this class instance has been initialized.
     */
    isInitialized(){
        return this._isInitialized;
    }

    /**
     * Primarily does two things.
     * 
     * 1. Initializes any subscriptions & subscription handlers.
     * 2. Registers this class instance's parseMessage as a listener 
     * for subscription messages.
     */
    abstract initializeSubscriptions(getStore: () => Store<RootStateT, RootActionT>): any;

    /**
     * A function which will be invoked whenever the state slice
     * provided by this class' `selectSlice` function changes.
     * 
     * @param curStateSlice A snapshot of the current local state slice, at the time the state slice changed.
     * @param curRootState A snapshot of the current root state, at the time the state slice changed.
     * @param getStore A getter for the store, allowing the developer to dispatch actions directly, 
     *                 or to get more up-to-date state snapshots.
     */
    abstract updateSubscriptionIds(
        curStateSlice: StateSliceT,
        curRootState: RootStateT,
        getStore: () => Store<RootStateT, RootActionT>
    ): SubIdT[];

    /**
     * Subscribes to the remote version of the provided ids.
     *  
     * @param ids The Ids to subscribe to changes for.
     */
    abstract subscribe(ids: SubIdT[]): any;

    /**
     * Unsubscribes from the remote versions of the provided ids.
     *  
     * @param ids The Ids to unsubscribe from. 
     */
    abstract unsubscribe(ids: SubIdT[]): any;
}