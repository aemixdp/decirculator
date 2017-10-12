export function objectValues<T>(object: { [key: string]: T }): T[] {
    return (Object as any).values(object);
}

export function objectEntries<T>(object: { [key: string]: T }): [string, T][] {
    return (Object as any).entries(object);
}
