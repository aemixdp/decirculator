import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';

export type CircuitObjectsAction = CreateBlock | CreateWire | DeleteObject;

export type CreateBlock = { type: 'CREATE_BLOCK', blockData: BlockCircuitObject };
export type CreateWire = { type: 'CREATE_WIRE', wireData: WireCircuitObject };
export type DeleteObject = { type: 'DELETE_OBJECT', id: number };

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

export function deleteObject(id: number): DeleteObject {
    return {
        type: 'DELETE_OBJECT',
        id,
    };
}