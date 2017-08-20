import { AnyAction } from 'redux';
import { simulationState, SimulationState } from './simulationState';
import { circuitObjects, CircuitObjectsState } from './circuitObjects';
import { ui, UiState } from './ui';

type AppState = {
    simulationState: SimulationState;
    circuitObjects: CircuitObjectsState;
    ui: UiState;
};

export function rootReducer(state: AppState, action: AnyAction) {
    return {
        simulationState: simulationState(state.simulationState, action),
        circuitObjects: circuitObjects(state.circuitObjects, action),
        ui: ui(state.ui, state.circuitObjects, action),
    };
}