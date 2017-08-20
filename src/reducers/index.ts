import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import { simulationState, SimulationState } from './simulationState';
import { circuitObjects, CircuitObjectsState } from './circuitObjects';
import { ui, UiState } from './ui';

type AppState = {
    simulationState: SimulationState;
    circuitObjects: CircuitObjectsState;
    ui: UiState;
};

export const rootReducer = reduceReducers<AppState>(
    combineReducers({
        simulationState,
        circuitObjects,
    }),
    (state, action) => ({
        ...state,
        ui: ui(state.ui, state.circuitObjects, action),
    }),
);