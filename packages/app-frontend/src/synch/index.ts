import { Store } from "redux";

export var synchronizers: ((getStore: () => Store) => any)[] = [];