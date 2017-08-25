export type ConfigAction = SetCircuitName | SetMidiOutput | SetBpm;

export type SetCircuitName = {
    type: 'SET_CIRCUIT_NAME';
    name: string;
};

export type SetMidiOutput = {
    type: 'SET_MIDI_OUTPUT';
    midiOutput: any;
};

export type SetBpm = {
    type: 'SET_BPM';
    bpm: number;
};

export function setCircuitName(name: string): SetCircuitName {
    return {
        type: 'SET_CIRCUIT_NAME',
        name,
    };
}

export function setMidiOutput(midiOutput: any): SetMidiOutput {
    return {
        type: 'SET_MIDI_OUTPUT',
        midiOutput,
    };
}

export function setBpm(bpm: number): SetBpm {
    return {
        type: 'SET_BPM',
        bpm,
    };
}