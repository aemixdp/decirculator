export type PortDirection = 'in' | 'out';

export const portDirections = {
    in: 'in' as PortDirection,
    out: 'out' as PortDirection,
};

export const defaultPortDirections = {
    Top: portDirections.out,
    Right: portDirections.out,
    Bottom: portDirections.out,
    Left: portDirections.out,
};