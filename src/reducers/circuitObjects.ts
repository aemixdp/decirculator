import { SimulationAction } from '../actions/SimulationAction';
import { CircuitObjectsAction } from '../actions/CircuitObjectsAction';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { arrayToIdMap } from '../utils/objectUtils';
import blockDescriptors from '../circuitry/blocks';
import { DragBlock } from '../actions/UiAction';
import { portDirections } from '../data/PortDirection';

export type CircuitObjectsState = {
    idCounter: number;
    wires: WireCircuitObject[];
    blocks: BlockCircuitObject[];
    blockById: { [id: number]: BlockCircuitObject };
    blocksBeforeSimulation: { [id: number]: BlockCircuitObject };
};

type Action = CircuitObjectsAction | SimulationAction | DragBlock;

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
        case 'DELETE_OBJECT':
            const blocksAfterDelete = state.blocks.filter(b => b.id !== action.id);
            return {
                ...state,
                wires: state.wires.filter(w =>
                    w.id !== action.id &&
                    w.startPortInfo.blockId !== action.id &&
                    w.endPortInfo &&
                    w.endPortInfo.blockId !== action.id
                ),
                blocks: blocksAfterDelete,
                blockById: arrayToIdMap(blocksAfterDelete),
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
        case 'DRAG_BLOCK':
            if (action.blockId !== NaN) {
                const transformedBlock = {
                    ...state.blockById[action.blockId],
                    ...action.newPosition,
                };
                return {
                    ...state,
                    blocks: state.blocks.map(block =>
                        block.id === action.blockId
                            ? transformedBlock
                            : block
                    ),
                    blockById: {
                        ...state.blockById,
                        [action.blockId]: transformedBlock,
                    },
                };
            } else {
                return state;
            }
        default:
            return state;
    }
}