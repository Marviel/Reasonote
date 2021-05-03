import { Action, Store } from "redux";
import { DownSynchSub } from "./DownSynchSub";
import firebase from 'firebase'

export abstract class DownSynchSubFirebase<
    RootStateT,  RootActionT extends Action<any>, 
    StateSliceT,
> extends DownSynchSub<
    RootStateT,
    RootActionT,
    StateSliceT,
    firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
    string
> {
    constructor(
        readonly fbdb: firebase.firestore.Firestore,
        readonly collectionKey: string,
    ){
        super()
    }

    unsubscribers: {[key: string]: () => any} = {};

    subscribe(ids: string[]) {
        const theseUnsubscribers = ids.map((id) => {
            const thisUnsubscriber = this.fbdb.collection(this.collectionKey).doc(id).onSnapshot(
                (snapshot) => {
                    console.log(`Collection: ${this.collectionKey}, Document: ${id}, Data: ${JSON.stringify(snapshot.data())}`)
                    this.onMessage(snapshot)                        
                },
                undefined,
                undefined,
            )

            return [id, thisUnsubscriber]
        })

        this.unsubscribers = {...this.unsubscribers, ...Object.fromEntries(theseUnsubscribers)}
    }

    unsubscribe(ids: string[]) {
        ids.forEach((id) => {
            if (id in this.unsubscribers){
                const thisUnsubscriber = this.unsubscribers[id];
                thisUnsubscriber();
            }
        })
    }

    initializeSubscriptions(getStore: () => Store<RootStateT, RootActionT>) {
        // We do not need to do this here.
    }
}