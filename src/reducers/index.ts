import { Reducer } from 'redux';
import undoable, { includeAction, StateWithHistory } from 'redux-undo';
import { global, GlobalState } from './global';
import { simulationState } from './simulationState';
import { circuitObjects } from './circuitObjects';
import { ui } from './ui';
import { config } from './config';
import { undoHistoryLength } from '../config';

function globalReducer(state: GlobalState, action: any): GlobalState {
    return global({
        ...state,
        simulationState: simulationState(state.simulationState, action),
        circuitObjects: circuitObjects(state.circuitObjects, action),
        ui: ui(state.ui, state.circuitObjects, action),
        config: config(state.config, action),
    }, action);
}

export const rootReducer: Reducer<StateWithHistory<GlobalState>> = undoable(globalReducer, {
    limit: undoHistoryLength,
    syncFilter: true,
    filter: includeAction([
        'CREATE_BLOCK',
        'CREATE_WIRE',
        'DRAW_WIRE',
        'EDIT_OBJECT',
        'DELETE_OBJECT',
        'TOGGLE_PORT',
        'SET_CIRCUIT_NAME',
        'SET_MIDI_OUTPUT',
        'SET_BPM',
        'DRAG_BLOCK',
    ]),
    groupBy: (action) => {
        switch (action.type) {
            case 'DRAG_BLOCK':
                return 1;
            case 'CREATE_WIRE':
            case 'DRAW_WIRE':
                return 2;
            default:
                return null;
        }
    },
});