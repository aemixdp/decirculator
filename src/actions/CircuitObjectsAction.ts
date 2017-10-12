import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { Side } from '../data/Side';
import { Circuit } from '../circuitry/Circuit';
import { Point } from '../data/Point';

export const CREATE_BLOCK = 'CREATE_BLOCK';
export const CREATE_WIRE = 'CREATE_WIRE';
export const EDIT_OBJECT = 'EDIT_OBJECT';
export const DELETE_OBJECTS = 'DELETE_OBJECTS';
export const TOGGLE_PORT = 'TOGGLE_PORT';
export const INVALIDATE_CIRCUITRY = 'INVALIDATE_CIRCUITRY';
export const COPY_OBJECTS = 'COPY_OBJECTS';
export const PASTE_OBJECTS = 'PASTE_OBJECTS';

export type CircuitObjectsAction
    = CreateBlock
    | CreateWire
    | EditObject
    | DeleteObjects
    | CopyObjects
    | PasteObjects
    | TogglePort
    | InvalidateCircuitry;

export type CreateBlock = {
    type: typeof CREATE_BLOCK;
    blockData: BlockCircuitObject;
};

export type CreateWire = {
    type: typeof CREATE_WIRE;
    wireData: WireCircuitObject;
};

export type EditObject = {
    type: typeof EDIT_OBJECT;
    id: number;
    propertyName: string;
    propertyValue: any;
};

export type DeleteObjects = {
    type: typeof DELETE_OBJECTS;
    ids: Set<number>;
};

export type CopyObjects = {
    type: typeof COPY_OBJECTS;
    blockIds: Set<number>;
};

export type PasteObjects = {
    type: typeof PASTE_OBJECTS;
    targetPosition: Point;
};

export type TogglePort = {
    type: typeof TOGGLE_PORT;
    blockId: number;
    side: Side;
};

export type InvalidateCircuitry = {
    type: typeof INVALIDATE_CIRCUITRY;
    circuit: Circuit;
};

export function createBlock(blockData: BlockCircuitObject): CreateBlock {
    return {
        type: CREATE_BLOCK,
        blockData,
    };
}

export function createWire(wireData: WireCircuitObject): CreateWire {
    return {
        type: CREATE_WIRE,
        wireData,
    };
}

export function editObject(id: number, propertyName: string, propertyValue: any): EditObject {
    return {
        type: EDIT_OBJECT,
        id,
        propertyName,
        propertyValue,
    };
}

export function deleteObjects(ids: Set<number>): DeleteObjects {
    return {
        type: DELETE_OBJECTS,
        ids,
    };
}

export function copyObjects(blockIds: Set<number>): CopyObjects {
    return {
        type: COPY_OBJECTS,
        blockIds,
    };
}

export function pasteObjects(targetPosition: Point): PasteObjects {
    return {
        type: PASTE_OBJECTS,
        targetPosition,
    };
}

export function togglePort(blockId: number, side: Side): TogglePort {
    return {
        type: TOGGLE_PORT,
        blockId,
        side,
    };
}

export function invalidateCircuitry(circuit: Circuit): InvalidateCircuitry {
    return {
        type: INVALIDATE_CIRCUITRY,
        circuit,
    };
}
