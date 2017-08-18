import { SimulationAction } from '../actions/SimulationAction';
import { CircuitObjectsAction } from '../actions/CircuitObjectsAction';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { arrayToIdMap } from '../utils/objectUtils';
import blockDescriptors from '../circuitry/blocks';

type State = {
    idCounter: number;
    wires: WireCircuitObject[];
    blocks: BlockCircuitObject[];
    blockById: { [id: number]: BlockCircuitObject };
    blocksBeforeSimulation: { [id: number]: BlockCircuitObject };
};

type Action = SimulationAction | CircuitObjectsAction;

export function circuitObjects(state: State, action: Action): State {
    switch (action.type) {
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
                wires: state.wires.map(w => ({ ...w, gate: false })),
                blocks: blocksAfterSimulation,
                blockById: arrayToIdMap(blocksAfterSimulation),
            };
        case 'CREATE_BLOCK':
            const newBlock = { id: state.idCounter, ...action.blockData };
            return {
                ...state,
                idCounter: state.idCounter + 1,
                blocks: [...state.blocks, newBlock],
                blockById: { ...state.blockById, [state.idCounter]: newBlock },
            };
        case 'CREATE_WIRE':
            return {
                ...state,
                idCounter: state.idCounter + 1,
                wires: [
                    ...state.wires,
                    { id: state.idCounter, ...action.wireData },
                ],
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
        default:
            return state;
    }
}