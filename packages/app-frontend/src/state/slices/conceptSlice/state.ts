import { createEntityAdapter } from "@reduxjs/toolkit"
import { initial } from "lodash"
import { Concept } from "../../../models/Concept"
import { PendingDownSynch } from "../../../synch/PendingDownSynch"

/**
 * A helper for creating this state slice
 */
export const conceptsAdapter = createEntityAdapter<Concept | PendingDownSynch>({
    selectId: (c) => c.id
})

/**
 * The initial state of this slice
 */
export const initialState = conceptsAdapter.getInitialState({
    status: 'idle',
})

const arr = [
    {
        id: "@reasonote|counting|zero",
        name: "Zero",
        preRequisites: []
    },
    {
        id: "@reasonote|counting|one",
        name: "One",
        preRequisites: []
    },
    {
        id: "@reasonote|counting|two",
        name: "Two",
        preRequisites: []
    },
    {
        id: "@reasonote|counting|three",
        name: "Three",
        preRequisites: []
    },
    {
        id: "@reasonote|algebra|basic-algebra",
        name: "Basic Algebra",
        preRequisites: ["@reasonote|arithmetic|addition", "@reasonote|arithmetic|subtraction"]
    },
    {
        id: "@reasonote|arithmetic|addition-is-opposite-of-subtraction",
        name: "Addition is the Opposite of Subtraction",
        preRequisites: ["@reasonote|arithmetic|addition", "@reasonote|arithmetic|subtraction"]
    },
    {
        id: "@reasonote|arithmetic|multiplication-is-opposite-of-division",
        name: "Multiplication is the Opposite of Division",
        preRequisites: ["@reasonote|arithmetic|multiplication", "@reasonote|arithmetic|division"]
    },
    {
        id: "@reasonote|arithmetic|negative-numbers",
        name: "Negative Numbers",
        preRequisites: ["@reasonote|arithmetic|subtraction"]
    },
    {
        id: "@reasonote|arithmetic|negative-exponentiation",
        name: "Negative Exponentiation",
        preRequisites: ["@reasonote|arithmetic|exponentiation", "@reasonote|arithmetic|exponentiation"]
    },
    {
        id: "@reasonote|arithmetic|exponentiation",
        name: "Exponentiation",
        preRequisites: ["@reasonote|arithmetic|multiplication", "@reasonote|arithmetic|division"]
    },
    {
        id: "@reasonote|arithmetic|addition",
        name: "Addition",
        preRequisites: []
    },
    {
        id: "@reasonote|arithmetic|subtraction",
        name: "Subtraction",
        preRequisites: []
    },
    {
        id: "@reasonote|arithmetic|exponentiation",
        name: "Exponentiation",
        preRequisites: ["@reasonote|arithmetic|multiplication", "@reasonote|arithmetic|division"]
    },
    {
        id: "@reasonote|arithmetic|multiplication",
        name: "Multiplication",
        preRequisites: ["@reasonote|arithmetic|addition"]
    },
    {
        id: "@reasonote|arithmetic|equality",
        name: "Equality",
        preRequisites: []
    },
    {
        id: "@reasonote|arithmetic|division",
        name: "Division",
        preRequisites: ["@reasonote|arithmetic|addition"]
    },
    {
        id: "@reasonote|arithmetic|order-of-operations|addition-multiplication",
        name: "Order of Operations: Addition & Multiplication",
        preRequisites: ["@reasonote|arithmetic|addition", "@reasonote|arithmetic|multiplication"]
    },
    {
        id: "@reasonote|arithmetic|order-of-operations|addition-division",
        name: "Order of Operations: Addition & Division",
        preRequisites: ["@reasonote|arithmetic|addition", "@reasonote|arithmetic|division"]
    },
    {
        id: "@reasonote|arithmetic|order-of-operations|subtraction-multiplication",
        name: "Order of Operations: Subtraction & Multiplication",
        preRequisites: ["@reasonote|arithmetic|subtraction", "@reasonote|arithmetic|multiplication"]
    },
    {
        id: "@reasonote|arithmetic|order-of-operations|subtraction-division",
        name: "Order of Operations: Subtraction & Division",
        preRequisites: ["@reasonote|arithmetic|subtraction", "@reasonote|arithmetic|division"]
    },
]

initialState.entities = Object.fromEntries(arr.map((c)=> [c.id, c]))
initialState.ids = Object.keys(initialState.entities)

export const conceptsInitialState = initialState;
export type ConceptStateType = typeof initialState;