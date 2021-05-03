export type PendingDownSynch = {
    id: string
}

export function isSynchedDown<T>(a: T | PendingDownSynch): a is T {    
    return "id" in a && Object.keys(a).length > 1
}