import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { Side } from '../data/Side';
import { Circuit } from '../circuitry/Circuit';

export type CircuitObjectsAction
    = CreateBlock
    | CreateWire
    | EditObject
    | DeleteObjects
    | TogglePort
    | InvalidateCircuitry;

export type CreateBlock = {
    type: 'CREATE_BLOCK';
    blockData: BlockCircuitObject;
};

export type CreateWire = {
    type: 'CREATE_WIRE';
    wireData: WireCircuitObject;
};

export type EditObject = {
    type: 'EDIT_OBJECT';
    id: number;
    propertyName: string;
    propertyValue: any;
};

export type DeleteObjects = {
    type: 'DELETE_OBJECTS';
    ids: Set<number>;
};

export type TogglePort = {
    type: 'TOGGLE_PORT';
    blockId: number;
    side: Side;
};

export type InvalidateCircuitry = {
    type: 'INVALIDATE_CIRCUITRY';
    circuit: Circuit;
};

export function createBlock(blockData: BlockCircuitObject): CreateBlock {
    return {
        type: 'CREATE_BLOCK',
        blockData,
    };
}

export function createWire(wireData: WireCircuitObject): CreateWire {
    return {
        type: 'CREATE_WIRE',
        wireData,
    };
}

export function editObject(id: number, propertyName: string, propertyValue: any): EditObject {
    return {
        type: 'EDIT_OBJECT',
        id,
        propertyName,
        propertyValue,
    };
}

export function deleteObjects(ids: Set<number>): DeleteObjects {
    return {
        type: 'DELETE_OBJECTS',
        ids,
    };
}

export function togglePort(blockId: number, side: Side): TogglePort {
    return {
        type: 'TOGGLE_PORT',
        blockId,
        side,
    };
}

export function invalidateCircuitry(circuit: Circuit): InvalidateCircuitry {
    return {
        type: 'INVALIDATE_CIRCUITRY',
        circuit,
    };
}