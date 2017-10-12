import { Reducer } from 'redux';
import undoable, { includeAction, StateWithHistory } from 'redux-undo';
import { globalReducer, GlobalState } from './globalReducer';
import { simulationStateReducer } from './simulationStateReducer';
import { circuitObjectsReducer } from './circuitObjectsReducer';
import { uiReducer } from './uiReducer';
import { configReducer } from './configReducer';
import { undoHistoryLength } from '../config';
import * as uiActions from '../actions/UiAction';
import * as circuitObjectsActions from '../actions/CircuitObjectsAction';
import * as configActions from '../actions/ConfigAction';

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
            circuitObjectsActions.CREATE_BLOCK,
            circuitObjectsActions.CREATE_WIRE,
            circuitObjectsActions.EDIT_OBJECT,
            circuitObjectsActions.DELETE_OBJECTS,
            circuitObjectsActions.PASTE_OBJECTS,
            circuitObjectsActions.TOGGLE_PORT,
            configActions.SET_CIRCUIT_NAME,
            configActions.SET_MIDI_OUTPUT,
            configActions.SET_BPM,
            uiActions.DRAG_BLOCKS,
        ]),
        groupBy: (action: uiActions.UiAction) => {
            switch (action.type) {
                case uiActions.DRAG_BLOCKS:
                    return Array.from(action.ids).toString();
                default:
                    return null;
            }
        },
    }
);
