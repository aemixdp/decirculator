import { Circuit } from '../circuitry/Circuit';
import { SimulationAction } from '../actions/SimulationAction';

function createCircuit() {
    return new Circuit();
}

export function circuit(state: Circuit = createCircuit(), action: SimulationAction): Circuit {
    switch (action.type) {
        case 'START_SIMULATION':
            return state;
        default:
            return state;
    }
}