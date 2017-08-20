import { UiAction } from '../actions/UiAction';
import { CircuitObject } from '../data/CircuitObject';
import { Point } from '../data/Point';
import { PortInfo } from '../data/PortInfo';
import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { defaultPortDirections } from '../data/PortDirection';
import { CircuitObjectsState } from './circuitObjects';
import { shapeCenter } from '../utils/geometryUtils';

export interface UiState {
    viewportOffset: Point;
    selectedObject?: CircuitObject;
    hoveringPortInfo?: PortInfo;
    newBlock?: BlockCircuitObject;
    newWire?: WireCircuitObject;
}

export function ui(uiState: UiState, circuitObjectsState: CircuitObjectsState, action: UiAction): UiState {
    switch (action.type) {
        case 'DRAG_VIEWPORT':
            return {
                ...uiState,
                viewportOffset: action.newOffset,
            };
        case 'DRAG_BLOCK':
            if (action.blockId === NaN && uiState.newBlock) {
                return {
                    ...uiState,
                    newBlock: {
                        ...uiState.newBlock,
                        ...action.newPosition,
                    }
                };
            } else {
                return uiState;
            }
        case 'SELECT_OBJECT':
            return {
                ...uiState,
                selectedObject: action.object,
            };
        case 'HOVER_PORT':
            return {
                ...uiState,
                hoveringPortInfo: {
                    blockId: action.blockId,
                    port: action.portLocationInfo,
                },
            };
        case 'DRAW_BLOCK':
            return {
                ...uiState,
                newBlock: {
                    id: NaN,
                    kind: 'block',
                    name: action.blockDescriptor.name,
                    active: true,
                    x: -100,
                    y: -100,
                    ports: defaultPortDirections,
                    ...action.blockDescriptor.initialState,
                },
            };
        case 'DRAW_WIRE':
            if (uiState.hoveringPortInfo) {
                const hpi = uiState.hoveringPortInfo;
                const startPosition = shapeCenter(hpi.port, circuitObjectsState.blockById[hpi.blockId]);
                return {
                    ...uiState,
                    newWire: {
                        id: NaN,
                        kind: 'wire',
                        active: true,
                        startPosition,
                        startPortInfo: hpi,
                        endPosition: startPosition,
                        endPortInfo: undefined,
                        gate: false,
                    },
                };
            } else {
                return uiState;
            }
        default:
            return uiState;
    }
}