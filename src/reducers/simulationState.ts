import { SimulationAction } from '../actions/SimulationAction';

type SimulationState = 'STARTED' | 'PAUSED' | 'STOPPED';

export function simulationState(state: SimulationState = 'STOPPED', action: SimulationAction): SimulationState {
    switch (action.type) {
        case 'START_SIMULATION':
            return 'STARTED';
        case 'PAUSE_SIMULATION':
            return 'PAUSED';
        case 'STOP_SIMULATION':
            return 'STOPPED';
        default:
            return state;
    }
}