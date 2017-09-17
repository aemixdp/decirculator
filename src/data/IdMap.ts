export interface IdMap<T> {
    [id: number]: T;
    length: number;
}

export type WithId<T> = T & { id: number };

export function arrayToIdMap<T>(objects: WithId<T>[]): IdMap<WithId<T>> {
    const idMap: IdMap<WithId<T>> = Object.create(null);
    for (const object of objects) {
        idMap[object.id] = object;
    }
    idMap.length = objects.length;
    return idMap;
}