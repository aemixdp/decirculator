import { Shape } from '../data/Shape';
import { Point } from '../data/Point';

export function shapeCenter(shape: Shape, offset: Point = { x: 0, y: 0 }): Point {
    return {
        x: offset.x + shape.x + shape.width / 2,
        y: offset.y + shape.y + shape.height / 2,
    };
}

export function normalizeRectangle(start: Point, end: Point): { start: Point, end: Point } {
    return {
        start: {
            x: Math.min(start.x, end.x),
            y: Math.min(start.y, end.y),
        },
        end: {
            x: Math.max(start.x, end.x),
            y: Math.max(start.y, end.y),
        },
    };
}
