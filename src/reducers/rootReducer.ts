import { Reducer } from 'redux';
import undoable, { includeAction, StateWithHistory } from 'redux-undo';
import { globalReducer, GlobalState } from './globalReducer';
import { simulationStateReducer } from './simulationStateReducer';
import { circuitObjectsReducer } from './circuitObjectsReducer';
import { uiReducer } from './uiReducer';
import { configReducer } from './configReducer';
import { undoHistoryLength } from '../config';
import { UiAction } from '../actions/UiAction';

export const rootReducer: Reducer<StateWithHistory<GlobalState>> = undoable(
    (state: GlobalState, action: any) => {
        const newCircuitObjects = circuitObjectsReducer(state.circuitObjects, action);
        return globalReducer({
            ...state,
            simulationState: simulationStateReducer(state.simulationState, action),
            circuitObjects: newCircuitObjects,
            ui: uiReducer(state.ui, newCircuitObjects, action),
            config: configReducer(state.config, action),
        }, action);
    }, {
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
                    return Array.from(action.ids).toString();
                default:
                    return null;
            }
        },
    }
);