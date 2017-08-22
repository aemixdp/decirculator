import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { Side } from '../data/Side';

export type CircuitObjectsAction = CreateBlock | CreateWire | EditObject | DeleteObject | TogglePort;

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

export type DeleteObject = {
    type: 'DELETE_OBJECT';
    id: number;
};

export type TogglePort = {
    type: 'TOGGLE_PORT';
    blockId: number;
    side: Side;
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

export function deleteObject(id: number): DeleteObject {
    return {
        type: 'DELETE_OBJECT',
        id,
    };
}

export function togglePort(blockId: number, side: Side): TogglePort {
    return {
        type: 'TOGGLE_PORT',
        blockId,
        side,
    };
}