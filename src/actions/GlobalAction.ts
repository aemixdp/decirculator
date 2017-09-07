export type GlobalAction = Save | Load | SendMidi | InvalidateTheme | InvalidateMidiOutputs;

export type Save = {
    type: 'SAVE';
    circuitName: string;
};

export type Load = {
    type: 'LOAD';
    circuitName: string;
};

export type SendMidi = {
    type: 'SEND_MIDI';
    note: number;
    channel: number;
    velocity: number;
    noteOn: boolean;
};

export type InvalidateTheme = {
    type: 'INVALIDATE_THEME';
    theme: any;
};

export type InvalidateMidiOutputs = {
    type: 'INVALIDATE_MIDI_OUTPUTS';
    midiOutputs: string[];
};

export function save(circuitName: string): Save {
    return {
        type: 'SAVE',
        circuitName,
    };
}

export function load(circuitName: string): Load {
    return {
        type: 'LOAD',
        circuitName,
    };
}

export function sendMidi(noteOn: boolean, note: number, channel: number, velocity: number): SendMidi {
    return {
        type: 'SEND_MIDI',
        noteOn,
        note,
        channel,
        velocity,
    };
}

export function invalidateTheme(theme: any): InvalidateTheme {
    return {
        type: 'INVALIDATE_THEME',
        theme,
    };
}

export function invalidateMidiOutputs(midiOutputs: string[]): InvalidateMidiOutputs {
    return {
        type: 'INVALIDATE_MIDI_OUTPUTS',
        midiOutputs,
    };
}