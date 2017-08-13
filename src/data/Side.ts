export interface Side {
    x: number;
    y: number;
    index: number;
    name: string;
}

const Top: Side = { index: 0, x: 0, y: -1, name: 'Top' };
const Right: Side = { index: 1, x: 1, y: 0, name: 'Right' };
const Bottom: Side = { index: 2, x: 0, y: 1, name: 'Bottom' };
const Left: Side = { index: 3, x: -1, y: 0, name: 'Left' };

export const sideByName = Object.freeze({ Top, Right, Bottom, Left });