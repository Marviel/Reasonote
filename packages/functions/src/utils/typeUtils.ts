import { Dictionary } from "@reduxjs/toolkit";
import _ from "lodash";


// Determines if an item has some value, and tells typescript such.
export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export function isPromise(value: any): value is Promise<any> {
    return value && value.then && typeof value.then === 'function';
}

export function dictValues<TValue>(dic: Dictionary<TValue>){
    return _.values(dic).filter(notEmpty);
}

export function notEmptyMap<I, O>(m: I[], fn: (input: I) => O | undefined | null ): O[] {
    return m.map(fn).filter(notEmpty);
}