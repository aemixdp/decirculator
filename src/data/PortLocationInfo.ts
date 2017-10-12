import { Shape } from '../data/Shape';
import { Side, sideByName } from '../data/Side';

export interface PortLocationInfo extends Shape {
    side: Side;
}

const topPortLocationInfo: PortLocationInfo = { x: 22, y: -1, width: 6, height: 2, side: sideByName.Top };
const rightPortLocationInfo: PortLocationInfo = { x: 49, y: 23, width: 2, height: 6, side: sideByName.Right };
const bottomPortLocationInfo: PortLocationInfo = { x: 22, y: 49, width: 6, height: 2, side: sideByName.Bottom };
const leftPortLocationInfo: PortLocationInfo = { x: -1, y: 23, width: 2, height: 6, side: sideByName.Left };

export const portLocationInfos = Object.freeze([
    topPortLocationInfo,
    rightPortLocationInfo,
    bottomPortLocationInfo,
    leftPortLocationInfo,
]);

export const portLocationInfoBySideName = Object.freeze({
    Top: topPortLocationInfo,
    Right: rightPortLocationInfo,
    Bottom: bottomPortLocationInfo,
    Left: leftPortLocationInfo,
});
