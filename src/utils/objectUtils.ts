export type WithId<T> = T & { id: number };

export function arrayToIdMap<T>(objects: WithId<T>[]): { [id: number]: WithId<T> } {
    return objects.reduce((acc, b) => (acc[b.id] = b) && acc, {});
}

export function objectValues<T>(object: { [key: string]: T }): T[] {
    return (Object as any).values(object);
}

export function objectEntries<T>(object: { [key: string]: T }): [string, T][] {
    return (Object as any).entries(object);
}