export const SET_CIRCUIT_NAME = 'SET_CIRCUIT_NAME';
export const SET_MIDI_OUTPUT = 'SET_MIDI_OUTPUT';
export const SET_BPM = 'SET_BPM';

export type ConfigAction
    = SetCircuitName
    | SetMidiOutput
    | SetBpm;

export type SetCircuitName = {
    type: typeof SET_CIRCUIT_NAME;
    name: string;
};

export type SetMidiOutput = {
    type: typeof SET_MIDI_OUTPUT;
    midiOutputName: string;
};

export type SetBpm = {
    type: typeof SET_BPM;
    bpm: number;
};

export function setCircuitName(name: string): SetCircuitName {
    return {
        type: SET_CIRCUIT_NAME,
        name,
    };
}

export function setMidiOutput(midiOutputName: string): SetMidiOutput {
    return {
        type: SET_MIDI_OUTPUT,
        midiOutputName,
    };
}

export function setBpm(bpm: number): SetBpm {
    return {
        type: SET_BPM,
        bpm,
    };
}
