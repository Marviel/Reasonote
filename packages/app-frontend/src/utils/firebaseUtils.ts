import firebase from "firebase";
import _ from "lodash";

export async function dataFromQuery(snapshot: firebase.firestore.Query<firebase.firestore.DocumentData>){
  return (await snapshot.get()).docs.map(doc => doc.data())
}


export function normalizeFirestoreData(v: any): any {
  if(v instanceof firebase.firestore.Timestamp){
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