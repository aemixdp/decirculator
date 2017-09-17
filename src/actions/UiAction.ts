import { BlockDescriptor } from '../data/BlockDescriptor';
import { Point } from '../data/Point';
import { PortInfo } from '../data/PortInfo';

export type UiAction = DragViewport | DragBlocks | SelectObjects | HoverPort | DrawBlock | DrawWire | CancelDrawingWire;

export type DragViewport = {
    type: 'DRAG_VIEWPORT';
    newOffset: Point;
};

export type DragBlocks = {
    type: 'DRAG_BLOCKS';
    ids: Set<number>;
    offset: Point;
};

export type SelectObjects = {
    type: 'SELECT_OBJECTS';
    ids: Set<number>;
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

export function dragBlocks(ids: Set<number>, offset: Point): DragBlocks {
    return {
        type: 'DRAG_BLOCKS',
        ids,
        offset,
    };
}

export function selectObjects(ids: Set<number>): SelectObjects {
    return {
        type: 'SELECT_OBJECTS',
        ids,
    };
}

export function deselectObjects(): SelectObjects {
    return selectObjects(new Set());
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