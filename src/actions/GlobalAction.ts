export const SAVE = 'SAVE';
export const LOAD = 'LOAD';
export const SEND_MIDI = 'SEND_MIDI';
export const REFRESH_MIDI_DEVICES = 'REFRESH_MIDI_DEVICES';
export const INVALIDATE_THEME = 'INVALIDATE_THEME';
export const INVALIDATE_MIDI_OUTPUTS = 'INVALIDATE_MIDI_OUTPUTS';

export type GlobalAction
    = Save
    | Load
    | SendMidi
    | RefreshMidiDevices
    | InvalidateTheme
    | InvalidateMidiOutputs;

export type Save = {
    type: typeof SAVE;
    circuitName: string;
};

export type Load = {
    type: typeof LOAD;
    circuitName: string;
};

export type SendMidi = {
    type: typeof SEND_MIDI;
    ccMode: boolean;
    note: number;
    channel: number;
    velocity: number;
    expireAt: number;
};

export type RefreshMidiDevices = {
    type: typeof REFRESH_MIDI_DEVICES;
};

export type InvalidateTheme = {
    type: typeof INVALIDATE_THEME;
    theme: any;
};

export type InvalidateMidiOutputs = {
    type: typeof INVALIDATE_MIDI_OUTPUTS;
    midiOutputs: string[];
};

export function save(circuitName: string): Save {
    return {
        type: SAVE,
        circuitName,
    };
}

export function load(circuitName: string): Load {
    return {
        type: LOAD,
        circuitName,
    };
}

export function sendMidi(ccMode: boolean, note: number, channel: number, velocity: number, expireAt: number): SendMidi {
    return {
        type: SEND_MIDI,
        ccMode,
        note,
        channel,
        velocity,
        expireAt,
    };
}

export const refreshMidiDevices = {
    type: REFRESH_MIDI_DEVICES,
};

export function invalidateTheme(theme: any): InvalidateTheme {
    return {
        type: INVALIDATE_THEME,
        theme,
    };
}

export function invalidateMidiOutputs(midiOutputs: string[]): InvalidateMidiOutputs {
    return {
        type: INVALIDATE_MIDI_OUTPUTS,
        midiOutputs,
    };
}
