import { PortLocationInfo } from '../data/PortLocationInfo';

export type CircuitObjectVisuals = {
    theme?: any;
    draggable?: boolean;
    isSelected?: boolean;
    label?: string;
    labelX?: number;
    labelY?: number;
    labelFontSize?: number;
    hoveringPort?: PortLocationInfo;
    children?: JSX.Element[];
}