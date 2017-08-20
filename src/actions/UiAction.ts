import { CircuitObject } from '../data/CircuitObject';
import { PortLocationInfo } from '../data/PortLocationInfo';
import { BlockDescriptor } from '../data/BlockDescriptor';
import { Point } from '../data/Point';

export type UiAction = DragViewport | DragBlock | SelectObject | HoverPort | DrawBlock | DrawWire;

export type DragViewport = {
    type: 'DRAG_VIEWPORT';
    newOffset: Point;
};

export type DragBlock = {
    type: 'DRAG_BLOCK';
    blockId: number;
    newPosition: Point;
};

export type SelectObject = {
    type: 'SELECT_OBJECT';
    object?: CircuitObject;
};

export type HoverPort = {
    type: 'HOVER_PORT';
    blockId: number;
    portLocationInfo: PortLocationInfo;
};

export type DrawBlock = {
    type: 'DRAW_BLOCK';
    blockDescriptor: BlockDescriptor<{}>;
};

export type DrawWire = {
    type: 'DRAW_WIRE';
};

export function dragViewport(newOffset: Point): DragViewport {
    return {
        type: 'DRAG_VIEWPORT',
        newOffset,
    };
}

export function dragBlock(blockId: number, newPosition: Point): DragBlock {
    return {
        type: 'DRAG_BLOCK',
        blockId,
        newPosition,
    };
}

export function selectObject(object?: CircuitObject): SelectObject {
    return {
        type: 'SELECT_OBJECT',
        object,
    };
}

export function deselectObject(): SelectObject {
    return selectObject(undefined);
}

export function hoverPort(blockId: number, portLocationInfo: PortLocationInfo): HoverPort {
    return {
        type: 'HOVER_PORT',
        blockId,
        portLocationInfo,
    };
}

export function drawBlock(blockDescriptor: BlockDescriptor): DrawBlock {
    return {
        type: 'DRAW_BLOCK',
        blockDescriptor,
    };
}

export function drawWire(): DrawWire {
    return {
        type: 'DRAW_WIRE',
    };
}