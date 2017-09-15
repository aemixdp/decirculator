import { Reducer } from 'redux';
import undoable, { includeAction, StateWithHistory } from 'redux-undo';
import { global, GlobalState } from './global';
import { simulationState } from './simulationState';
import { circuitObjects } from './circuitObjects';
import { ui } from './ui';
import { config } from './config';
import { undoHistoryLength } from '../config';
import { UiAction } from '../actions/UiAction';

function globalReducer(state: GlobalState, action: any): GlobalState {
    const newCircuitObjects = circuitObjects(state.circuitObjects, action);
    return global({
        ...state,
        simulationState: simulationState(state.simulationState, action),
        circuitObjects: newCircuitObjects,
        ui: ui(state.ui, newCircuitObjects, action),
        config: config(state.config, action),
    }, action);
}

export const rootReducer: Reducer<StateWithHistory<GlobalState>> = undoable(globalReducer, {
    limit: undoHistoryLength,
    syncFilter: true,
    filter: includeAction([
        'CREATE_BLOCK',
        'CREATE_WIRE',
        'EDIT_OBJECT',
        'DELETE_OBJECT',
        'TOGGLE_PORT',
        'SET_CIRCUIT_NAME',
        'SET_MIDI_OUTPUT',
        'SET_BPM',
        'DRAG_BLOCKS',
    ]),
    groupBy: (action: UiAction) => {
        switch (action.type) {
            case 'DRAG_BLOCKS':
                return action.blockIds.toString();
            default:
                return null;
        }
    },
});