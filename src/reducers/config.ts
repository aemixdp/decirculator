import { ConfigAction } from '../actions/ConfigAction';

export interface ConfigState {
    circuitName: string;
    midiOutputName?: string;
    bpm: number;
    gateLength: number;
}

export function config(state: ConfigState, action: ConfigAction): ConfigState {
    switch (action.type) {
        case 'SET_CIRCUIT_NAME':
            return {
                ...state,
                circuitName: action.name,
            };
        case 'SET_MIDI_OUTPUT':
            return {
                ...state,
                midiOutputName: action.midiOutputName,
            };
        case 'SET_BPM':
            return {
                ...state,
                bpm: action.bpm,
            };
        default:
            return state;
    }
}