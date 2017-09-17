import { SimulationAction } from '../actions/SimulationAction';
import { CircuitObjectsAction } from '../actions/CircuitObjectsAction';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import blockDescriptors from '../circuitry/blocks';
import { DragBlocks } from '../actions/UiAction';
import { portDirections, flipPortDirection } from '../data/PortDirection';
import { PortInfo } from '../data/PortInfo';
import { arrayToIdMap } from '../data/IdMap';

export type CircuitObjectsState = {
    idCounter: number;
    wires: WireCircuitObject[];
    blocks: BlockCircuitObject[];
    blockById: { [id: number]: BlockCircuitObject };
    blocksBeforeSimulation: { [id: number]: BlockCircuitObject };
};

type Action = CircuitObjectsAction | SimulationAction | DragBlocks;

export function circuitObjects(state: CircuitObjectsState, action: Action): CircuitObjectsState {
    switch (action.type) {
        case 'CREATE_BLOCK':
            const newBlock = { ...action.blockData, id: state.idCounter };
            return {
                ...state,
                idCounter: state.idCounter + 1,
                blocks: [...state.blocks, newBlock],
                blockById: { ...state.blockById, [state.idCounter]: newBlock },
            };
        case 'CREATE_WIRE':
            const newWire = { ...action.wireData, id: state.idCounter };
            const spi = newWire.startPortInfo;
            const epi = newWire.endPortInfo;
            const blocksAfterCreatingWire = state.blocks.map(block => {
                if (block.id === spi.blockId) {
                    return { ...block, ports: { ...block.ports, [spi.port.side.name]: portDirections.out } };
                } else if (epi && block.id === epi.blockId) {
                    return { ...block, ports: { ...block.ports, [epi.port.side.name]: portDirections.in } };
                } else {
                    return block;
                }
            });
            delete newWire.startPosition;
            delete newWire.endPosition;
            return {
                ...state,
                idCounter: state.idCounter + 1,
                wires: [...state.wires, newWire],
                blocks: blocksAfterCreatingWire,
                blockById: arrayToIdMap(blocksAfterCreatingWire),
            };
        case 'EDIT_OBJECT':
            const mapper = (obj: any) =>
                obj.id === action.id
                    ? { ...obj, [action.propertyName]: action.propertyValue }
                    : obj;
            const blocksAfterEdit = state.blocks.map(mapper);
            return {
                ...state,
                wires: state.wires.map(mapper),
                blocks: blocksAfterEdit,
                blockById: arrayToIdMap(blocksAfterEdit),
            };
        case 'DELETE_OBJECTS':
            const blocksAfterDelete = state.blocks.filter(b => !action.ids.has(b.id));
            return {
                ...state,
                wires: state.wires.filter(w =>
                    !action.ids.has(w.id) &&
                    !action.ids.has(w.startPortInfo.blockId) &&
                    w.endPortInfo &&
                    !action.ids.has(w.endPortInfo.blockId)
                ),
                blocks: blocksAfterDelete,
                blockById: arrayToIdMap(blocksAfterDelete),
            };
        case 'TOGGLE_PORT':
            const adjacentWire = state.wires.find(w =>
                (
                    w.startPortInfo.blockId === action.blockId &&
                    w.startPortInfo.port.side.name === action.side.name
                ) || (
                    w.endPortInfo !== undefined &&
                    w.endPortInfo.blockId === action.blockId &&
                    w.endPortInfo.port.side.name === action.side.name
                )
            );
            const togglePort = (block: BlockCircuitObject, sideName: string) => ({
                ...block,
                ports: { ...block.ports, [sideName]: flipPortDirection(block.ports[sideName]) },
            });
            const blocksAfterTogglePort = state.blocks.map(block => {
                if (block.id === action.blockId) {
                    return togglePort(block, action.side.name);
                } else if (adjacentWire && block.id === adjacentWire.startPortInfo.blockId) {
                    return togglePort(block, adjacentWire.startPortInfo.port.side.name);
                } else if (adjacentWire && adjacentWire.endPortInfo && block.id === adjacentWire.endPortInfo.blockId) {
                    return togglePort(block, adjacentWire.endPortInfo.port.side.name);
                } else {
                    return block;
                }
            });
            return {
                ...state,
                wires: !adjacentWire ? state.wires : state.wires.map(wire =>
                    wire.id !== adjacentWire.id ? wire : {
                        ...wire,
                        startPortInfo: adjacentWire.endPortInfo as PortInfo,
                        endPortInfo: adjacentWire.startPortInfo,
                    }
                ),
                blocks: blocksAfterTogglePort,
                blockById: arrayToIdMap(blocksAfterTogglePort),
            };
        case 'START_SIMULATION':
            return {
                ...state,
                blocksBeforeSimulation: state.blockById,
            };
        case 'STOP_SIMULATION':
            const blocksAfterSimulation = state.blocks.map(block => {
                let blockBeforeSimulation = state.blocksBeforeSimulation[block.id];
                let blockAfterSimulation = { ...block };
                if (blockBeforeSimulation) {
                    const blockDescriptor = blockDescriptors[blockBeforeSimulation.name];
                    for (const key of blockDescriptor.dynamicStateKeys) {
                        blockAfterSimulation[key] = blockBeforeSimulation[key];
                    }
                }
                return blockAfterSimulation;
            });
            return {
                ...state,
                wires: state.wires.map(wire => ({ ...wire, gate: false })),
                blocks: blocksAfterSimulation,
                blockById: arrayToIdMap(blocksAfterSimulation),
            };
        case 'DRAG_BLOCKS':
            if (action.ids.size === 1 && action.ids.has(NaN)) {
                return state;
            } else {
                const blocksAfterDrag = state.blocks.map(block =>
                    !action.ids.has(block.id) ? block : {
                        ...block,
                        x: block.x + action.offset.x,
                        y: block.y + action.offset.y,
                    }
                );
                return {
                    ...state,
                    blocks: blocksAfterDrag,
                    blockById: arrayToIdMap(blocksAfterDrag),
                };
            }
        case 'INVALIDATE_CIRCUITRY':
            const blocksAfterInvalidate = state.blocks.map(b =>
                (action.circuit.changed[b.id] && b.name === 'Counter')
                    ? { ...b, current: action.circuit.counterValue[b.id] }
                    : b
            );
            return {
                ...state,
                wires: state.wires.map(w =>
                    action.circuit.changed[w.id]
                        ? { ...w, gate: action.circuit.gate[w.id] }
                        : w
                ),
                blocks: blocksAfterInvalidate,
                blockById: arrayToIdMap(blocksAfterInvalidate),
            };
        default:
            return state;
    }
}