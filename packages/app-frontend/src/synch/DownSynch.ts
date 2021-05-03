import {Action, PayloadAction, Store} from '@reduxjs/toolkit'

export abstract class DownSynch<RootStateT, RootActionT extends Action<any>, StateSliceT, MsgT> {
    constructor(){
        
    }
    
    getStore?: () => Store<RootStateT, RootActionT>;

    onMessage(msg: MsgT){
        const getStore = this.getStore;

        if (getStore){
            const store = getStore()
            const rootState = store.getState();
            const stateSlice = this.selectSlice(rootState); 
            
            this.parseMessage(
                msg,
                stateSlice,
                rootState,
                getStore
            )
        }
    }

    abstract initialize(getStore: () => Store<RootStateT, RootActionT>): any;

    abstract isInitialized(): boolean;

    /**
     * A function which will return the slice of the state we are
     * desiring to synchronize down from the remote.
     * @param rootState The root level state object, such as that provided by the 
     *                  redux store's `getState` function
     */
    abstract selectSlice(rootState: RootStateT): StateSliceT;
    
    /**
     * A function which will be run whenever a message is picked up from the remote.
     * Determines if an update needs to be applied to the local state based on the 
     * received message and the current local state.
     * 
     * Implementors can choose one of the following methods to apply updates to the state:
     * 1. Returning a PayloadAction, or a list of payload actions, which will be dispatched 
     *    on the store immediately.
     * 2. Directly calling `store.dispatch(...)` using the provided `store` argument.
     * 
     * 
     * @param msg The message which has been picked up.
     * @param curStateSlice A snapshot of the current local state slice, at the time the message was received.
     * @param curRootState A snapshot of the current root state, at the time the message was received.
     * @param store The store, allowing the developer to dispatch actions directly, 
     *              or to get more up-to-date state snapshots.
     */
    abstract parseMessage(
        msg: MsgT,
        curStateSlice: StateSliceT,
        curRootState: RootStateT,
        getStore: () => Store<RootStateT, RootActionT>, 
    ): Array<PayloadAction<any, any>> | PayloadAction<any, any> | undefined | null | void;
}