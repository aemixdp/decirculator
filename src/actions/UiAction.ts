import { CircuitObject } from '../data/CircuitObject';
import { PortLocationInfo } from '../data/PortLocationInfo';
import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';

export type UiAction = DragViewport | SelectObject | HoverPort | DrawBlock | DrawWire;

export type DragViewport = {
    type: 'DRAG_VIEWPORT';
    x: number;
    y: number;
};

export type SelectObject = {
    type: 'SELECT_OBJECT';
    object: CircuitObject;
};

export type HoverPort = {
    type: 'HOVER_PORT';
    blockId: number;
    portLocationInfo: PortLocationInfo;
};

export type DrawBlock = {
    type: 'DRAW_BLOCK';
    blockData: BlockCircuitObject;
};

export type DrawWire = {
    type: 'DRAW_WIRE';
    wireData: WireCircuitObject;
};

export function drawViewport(x: number, y: number): DragViewport {
    return {
        type: 'DRAG_VIEWPORT',
        x,
        y,
    };
}

export function selectObject(object: CircuitObject): SelectObject {
    return {
        type: 'SELECT_OBJECT',
        object,
    };
}

export function hoverPort(blockId: number, portLocationInfo: PortLocationInfo): HoverPort {
    return {
        type: 'HOVER_PORT',
        blockId,
        portLocationInfo,
    };
}

export function drawBlock(blockData: BlockCircuitObject): DrawBlock {
    return {
        type: 'DRAW_BLOCK',
        blockData,
    };
}

export function drawWire(wireData: WireCircuitObject): DrawWire {
    return {
        type: 'DRAW_WIRE',
        wireData,
    };
}