import { UiAction } from '../actions/UiAction';
import { CircuitObject } from '../data/CircuitObject';
import { Point } from '../data/Point';
import { PortInfo } from '../data/PortInfo';
import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';

type UiState = {
    viewportOffset: Point;
    selectedObject?: CircuitObject;
    hoveringPortInfo?: PortInfo;
    newBlock?: BlockCircuitObject;
    newWire?: WireCircuitObject;
};

export function uiState(state: UiState, action: UiAction): UiState {
    switch (action.type) {
        case 'DRAG_VIEWPORT':
            return {
                ...state,
                viewportOffset: {
                    x: action.x,
                    y: action.y,
                },
            };
        case 'SELECT_OBJECT':
            return {
                ...state,
                selectedObject: action.object,
            };
        case 'HOVER_PORT':
            return {
                ...state,
                hoveringPortInfo: {
                    blockId: action.blockId,
                    port: action.portLocationInfo,
                },
            };
        case 'DRAW_BLOCK':
            return {
                ...state,
                newBlock: action.blockData,
            };
        case 'DRAW_WIRE':
            return {
                ...state,
                newWire: action.wireData,
            };
        default:
            return state;
    }
}