import { GlobalAction } from '../actions/GlobalAction';
import { SimulationState } from './simulationState';
import { CircuitObjectsState } from './circuitObjects';
import { UiState } from './ui';
import { ConfigState } from './config';
import { arrayToIdMap } from '../utils/objectUtils';

export interface GlobalState {
    simulationState: SimulationState;
    circuitObjects: CircuitObjectsState;
    ui: UiState;
    config: ConfigState;
    circuits: string[];
    theme?: any;
    midiOutputs: string[];
}

export function global(state: GlobalState, action: GlobalAction): GlobalState {
    switch (action.type) {
        case 'SAVE':
            const dataToSave = {
                idCounter: state.circuitObjects.idCounter,
                wires: state.circuitObjects.wires,
                blocks: state.circuitObjects.blocks,
                viewportOffset: state.ui.viewportOffset,
                bpm: state.config.bpm,
            };
            localStorage.setItem(action.circuitName, JSON.stringify(dataToSave, null, 0));
            return {
                ...state,
                circuits: Object.keys(localStorage),
            };
        case 'LOAD':
            const rawData = localStorage.getItem(action.circuitName);
            const data = rawData && JSON.parse(rawData);
            if (data) {
                return {
                    ...state,
                    circuitObjects: {
                        ...state.circuitObjects,
                        idCounter: data.idCounter,
                        wires: data.wires,
                        blocks: data.blocks,
                        blockById: arrayToIdMap(data.blocks),
                    },
                    ui: {
                        ...state.ui,
                        viewportOffset: data.viewportOffset,
                    },
                    config: {
                        ...state.config,
                        bpm: data.bpm,
                        circuitName: action.circuitName,
                    },
                };
            } else {
                return state;
            }
        case 'INVALIDATE_THEME':
            return {
                ...state,
                theme: action.theme,
            };
        case 'INVALIDATE_MIDI_OUTPUTS':
            return {
                ...state,
                midiOutputs: action.midiOutputs,
            };
        default:
            return state;
    }
}