import { ConfigAction } from '../actions/ConfigAction';

export interface ConfigState {
    bpm: number;
}

export function config(state: ConfigState, action: ConfigAction): ConfigState {
    switch (action.type) {
        case 'SET_BPM':
            return {
                ...state,
                bpm: action.bpm,
            };
        default:
            return state;
    }
}