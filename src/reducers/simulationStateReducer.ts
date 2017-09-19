import { SimulationAction, START_SIMULATION, PAUSE_SIMULATION, STOP_SIMULATION } from '../actions/SimulationAction';

export type SimulationState = 'STARTED' | 'PAUSED' | 'STOPPED';

export function simulationStateReducer(state: SimulationState, action: SimulationAction): SimulationState {
    switch (action.type) {
        case START_SIMULATION:
            return 'STARTED';
        case PAUSE_SIMULATION:
            return 'PAUSED';
        case STOP_SIMULATION:
            return 'STOPPED';
        default:
            return state;
    }
}