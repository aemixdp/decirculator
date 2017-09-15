import { CircuitObject } from '../data/CircuitObject';
import { BlockDescriptor } from '../data/BlockDescriptor';
import { Point } from '../data/Point';
import { PortInfo } from '../data/PortInfo';

export type UiAction = DragViewport | DragBlocks | SelectObject | HoverPort | DrawBlock | DrawWire | CancelDrawingWire;

export type DragViewport = {
    type: 'DRAG_VIEWPORT';
    newOffset: Point;
};

export type DragBlocks = {
    type: 'DRAG_BLOCKS';
    blockIds: number[];
    offset: Point;
};

export type SelectObject = {
    type: 'SELECT_OBJECT';
    object?: CircuitObject;
};

export type HoverPort = {
    type: 'HOVER_PORT';
    portInfo?: PortInfo;
};

export type DrawBlock = {
    type: 'DRAW_BLOCK';
    blockDescriptor: BlockDescriptor<{}>;
};

export type DrawWire = {
    type: 'DRAW_WIRE';
    endPosition?: Point;
};

export type CancelDrawingWire = {
    type: 'CANCEL_DRAWING_WIRE';
};

export function dragViewport(newOffset: Point): DragViewport {
    return {
        type: 'DRAG_VIEWPORT',
        newOffset,
    };
}

export function dragBlocks(blockIds: number[], offset: Point): DragBlocks {
    return {
        type: 'DRAG_BLOCKS',
        blockIds,
        offset,
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

export function hoverPort(portInfo?: PortInfo): HoverPort {
    return {
        type: 'HOVER_PORT',
        portInfo,
    };
}

export function unhoverPort(): HoverPort {
    return hoverPort(undefined);
}

export function drawBlock(blockDescriptor: BlockDescriptor): DrawBlock {
    return {
        type: 'DRAW_BLOCK',
        blockDescriptor,
    };
}

export function drawWire(endPosition?: Point): DrawWire {
    return {
        type: 'DRAW_WIRE',
        endPosition,
    };
}

export function cancelDrawingWire(): CancelDrawingWire {
    return {
        type: 'CANCEL_DRAWING_WIRE',
    };
}