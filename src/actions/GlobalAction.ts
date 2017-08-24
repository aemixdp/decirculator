export type GlobalAction = Save | Load;

export type Save = { type: 'SAVE'; circuitName: string; };
export type Load = { type: 'LOAD'; circuitName: string; };

export function save(circuitName: string): Save {
    return {
        type: 'SAVE',
        circuitName,
    };
}

export function load(circuitName: string): Load {
    return {
        type: 'LOAD',
        circuitName,
    };
}