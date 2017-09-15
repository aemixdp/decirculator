import { UiAction } from '../actions/UiAction';
import { CircuitObject } from '../data/CircuitObject';
import { Point } from '../data/Point';
import { PortInfo } from '../data/PortInfo';
import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { defaultPortDirections } from '../data/PortDirection';
import { CircuitObjectsState } from './circuitObjects';
import { shapeCenter } from '../utils/geometryUtils';
import { CreateBlock, CreateWire, EditObject } from '../actions/CircuitObjectsAction';

export interface UiState {
    viewportOffset: Point;
    selectedObject?: CircuitObject;
    hoveringPortInfo?: PortInfo;
    newBlock?: BlockCircuitObject;
    newWire?: WireCircuitObject;
}

type Action = UiAction | CreateBlock | CreateWire | EditObject;

export function ui(uiState: UiState, circuitObjectsState: CircuitObjectsState, action: Action): UiState {
    switch (action.type) {
        case 'DRAG_VIEWPORT':
            return {
                ...uiState,
                viewportOffset: action.newOffset,
            };
        case 'DRAG_BLOCKS':
            if (action.blockIds.length === 1 && isNaN(action.blockIds[0]) && uiState.newBlock) {
                return {
                    ...uiState,
                    newBlock: {
                        ...uiState.newBlock,
                        x: uiState.newBlock.x + action.offset.x,
                        y: uiState.newBlock.y + action.offset.y,
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
                hoveringPortInfo: action.portInfo,
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
            const hpi = uiState.hoveringPortInfo;
            if (uiState.newWire) {
                return {
                    ...uiState,
                    newWire: {
                        ...uiState.newWire,
                        endPosition: hpi
                            ? shapeCenter(hpi.port, circuitObjectsState.blockById[hpi.blockId])
                            : action.endPosition || uiState.newWire.startPosition,
                        endPortInfo: hpi,
                    },
                };
            } else if (hpi) {
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
        case 'CANCEL_DRAWING_WIRE':
            return {
                ...uiState,
                newWire: undefined,
            };
        case 'CREATE_BLOCK':
            return {
                ...uiState,
                newBlock: undefined,
            };
        case 'CREATE_WIRE':
            return {
                ...uiState,
                newWire: undefined,
            };
        case 'EDIT_OBJECT':
            if (uiState.selectedObject && action.id === uiState.selectedObject.id) {
                return {
                    ...uiState,
                    selectedObject: circuitObjectsState.blockById[action.id],
                };
            } else {
                return uiState;
            }
        default:
            return uiState;
    }
}