const NOTE_INDEX = {
    'C': 0,
    'D': 2,
    'E': 4,
    'F': 5,
    'G': 7,
    'A': 9,
    'B': 11,
};

const ACCIDENTAL = {
    '#': +1,
    'b': -1,
};

export function textNoteToMidiNote(note: string): number {
    const match = (/(\w)(-?\d)?([#b])?/g).exec(note);
    const noteIndex = match && NOTE_INDEX[match[1]];
    if (match && noteIndex !== null) {
        const octave = parseInt(match[2], 10) || 3;
        const accidental = ACCIDENTAL[match[3]] || 0;
        return 24 + 12 * octave + noteIndex + accidental;
    } else {
        return NaN;
    }
}

export function parseNotes(notes: string): number[] | null {
    const textNotes = notes.split(',');
    const midiNotes = [];
    for (const textNote of textNotes) {
        const midiNote = parseInt(textNote, 10) || textNoteToMidiNote(textNote);
        if (!midiNote)
            return null;
        midiNotes.push(midiNote);
    }
    return midiNotes;
}

export function textIntervalToMillis(interval: string, bpm: number): number {
    const match = (/(\d+)\/(\d+)/g).exec(interval);
    if (match) {
        const numerator = parseInt(match[1], 10);
        const denominator = parseInt(match[2], 10);
        return noteToMs(numerator, denominator, bpm);
    } else {
        return NaN;
    }
}

export function parseDelays(delays: string, bpm: number): number[] | null {
    const textDelays = delays.split(',');
    const numericDelays = [];
    for (const textDelay of textDelays) {
        const numericDelay = textIntervalToMillis(textDelay, bpm) || parseInt(textDelay, 10);
        if (!numericDelay)
            return null;
        numericDelays.push(numericDelay);
    }
    return numericDelays;
}

export function noteToMs(beats: number, noteFraction: number, bpm: number): number {
    return ((60000 / (bpm / 4)) / noteFraction) * beats;
}
