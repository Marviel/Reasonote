import { firestore } from "firebase-admin";
import _ from "lodash";

export async function dataFromQuery(snapshot: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>){
    return (await snapshot.get()).docs.map(doc => doc.data())
}

export function logMapper(prefix: string){
    return (a: any) => {
        console.log(prefix, a);
        return a;
    }
}

export function normalizeFirestoreData(v: any): any {
    if(v instanceof firestore.Timestamp){
        return v.toDate()
    } else if (typeof v === 'string' || v instanceof String){
        return v
    } else if (Array.isArray(v)){
        return v.map((inner) => normalizeFirestoreData(inner))
    }  else if (typeof v === 'object' && v !== null){
        return _.fromPairs(Object.keys(v).map((k) => {
            return [k, normalizeFirestoreData(v[k])]
        }))
    } else {
        return v
    }
}