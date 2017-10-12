import { Point } from '../data/Point';
import { PortInfo } from '../data/PortInfo';

export const DRAG_VIEWPORT = 'DRAG_VIEWPORT';
export const DRAG_BLOCKS = 'DRAG_BLOCKS';
export const SELECT_OBJECTS = 'SELECT_OBJECTS';
export const HOVER_PORT = 'HOVER_PORT';
export const DRAW_BLOCK = 'DRAW_BLOCK';
export const DRAW_WIRE = 'DRAW_WIRE';
export const CANCEL_DRAWING_WIRE = 'CANCEL_DRAWING_WIRE';
export const PLACE_PIVOT = 'PLACE_PIVOT';

export type UiAction
    = DragViewport
    | DragBlocks
    | SelectObjects
    | HoverPort
    | DrawWire
    | CancelDrawingWire
    | PlacePivot;

export type DragViewport = {
    type: typeof DRAG_VIEWPORT;
    newOffset: Point;
};

export type DragBlocks = {
    type: typeof DRAG_BLOCKS;
    ids: Set<number>;
    offset: Point;
};

export type SelectObjects = {
    type: typeof SELECT_OBJECTS;
    ids: Set<number>;
};

export type HoverPort = {
    type: typeof HOVER_PORT;
    portInfo?: PortInfo;
};

export type DrawWire = {
    type: typeof DRAW_WIRE;
    endPosition?: Point;
};

export type CancelDrawingWire = {
    type: typeof CANCEL_DRAWING_WIRE;
};

export type PlacePivot = {
    type: typeof PLACE_PIVOT;
    pivotPosition: Point;
};

export function dragViewport(newOffset: Point): DragViewport {
    return {
        type: DRAG_VIEWPORT,
        newOffset,
    };
}

export function dragBlocks(ids: Set<number>, offset: Point): DragBlocks {
    return {
        type: DRAG_BLOCKS,
        ids,
        offset,
    };
}

export function selectObjects(ids: Set<number>): SelectObjects {
    return {
        type: SELECT_OBJECTS,
        ids,
    };
}

export function deselectObjects(): SelectObjects {
    return selectObjects(new Set());
}

export function hoverPort(portInfo?: PortInfo): HoverPort {
    return {
        type: HOVER_PORT,
        portInfo,
    };
}

export function unhoverPort(): HoverPort {
    return hoverPort(undefined);
}

export function drawWire(endPosition?: Point): DrawWire {
    return {
        type: DRAW_WIRE,
        endPosition,
    };
}

export function cancelDrawingWire(): CancelDrawingWire {
    return {
        type: CANCEL_DRAWING_WIRE,
    };
}

export function placePivot(pivotPosition: Point): PlacePivot {
    return {
        type: PLACE_PIVOT,
        pivotPosition,
    };
}
