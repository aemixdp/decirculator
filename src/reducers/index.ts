import { global, GlobalState } from './global';
import { simulationState } from './simulationState';
import { circuitObjects } from './circuitObjects';
import { ui } from './ui';
import { config } from './config';

export function rootReducer(state: GlobalState, action: any): GlobalState {
    return global({
        ...state,
        simulationState: simulationState(state.simulationState, action),
        circuitObjects: circuitObjects(state.circuitObjects, action),
        ui: ui(state.ui, state.circuitObjects, action),
        config: config(state.config, action),
    }, action);
}