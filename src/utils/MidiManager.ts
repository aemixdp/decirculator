import { objectValues } from './objectUtils';

const CONTROL_CHANGE = 0xB0;
const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;

type MidiOutput = {
    name: string;
    send(...args: any[]): void;
};

export class MidiManager {
    midiOutputs: { [_: string]: MidiOutput };
    midiAccess: any;
    hangingMidi: {
        [midiOutput: string]: {
            [note: number]: 'note' | 'cc'
        }[]
    };
    onOutputsChange: () => void;
    constructor() {
        this.midiOutputs = {};
        this.hangingMidi = {};
        this.refreshDevices();
    }
    refreshDevices = async () => {
        const midiAccess = await (navigator as any).requestMIDIAccess();
        const outputs = {};
        let outputsChanged = false;
        midiAccess.outputs.forEach((output: any) => {
            outputs[output.name] = output;
            if (!this.midiOutputs[output.name]) {
                outputsChanged = true;
                const hangingOutputMidi = [];
                for (let ch = 0; ch < 16; ch += 1) {
                    hangingOutputMidi[ch] = {};
                }
                this.hangingMidi[output.name] = hangingOutputMidi;
            }
        });
        for (const output of objectValues(this.midiOutputs)) {
            if (!outputs[output.name]) {
                outputsChanged = true;
            }
        }
        this.midiOutputs = outputs;
        if (this.onOutputsChange && outputsChanged) {
            this.onOutputsChange();
        }
    }
    send(outputName: string, ccMode: boolean, toggleState: boolean, channel: number, note: number, velocity: number) {
        const midiOutput = this.midiOutputs[outputName];
        if (!midiOutput) return;
        if (ccMode) {
            if (toggleState) {
                midiOutput.send([CONTROL_CHANGE + channel - 1, note, velocity]);
                this.hangingMidi[outputName][channel - 1][note] = 'cc';
            } else {
                midiOutput.send([CONTROL_CHANGE + channel - 1, note, 0]);
                delete this.hangingMidi[outputName][channel - 1][note];
            }
        } else {
            if (toggleState) {
                midiOutput.send([NOTE_ON + channel - 1, note, velocity]);
                this.hangingMidi[outputName][channel - 1][note] = 'note';
            } else {
                midiOutput.send([NOTE_OFF + channel - 1, note, velocity]);
                delete this.hangingMidi[outputName][channel - 1][note];
            }
        }
    }
    neutralizeHangingMidi() {
        for (const outputName in this.midiOutputs) {
            const hangingOutputMidi = this.hangingMidi[outputName];
            const midiOutput = this.midiOutputs[outputName];
            if (!midiOutput) continue;
            for (let ch = 0; ch < 16; ch += 1) {
                const hangingChannelMidi = hangingOutputMidi[ch];
                for (const note in hangingChannelMidi) {
                    const messageType = hangingChannelMidi[note];
                    switch (messageType) {
                        case 'cc': midiOutput.send([CONTROL_CHANGE + ch, note, 0]); break;
                        case 'note': midiOutput.send([NOTE_OFF + ch, note, 0]); break;
                        default:
                    }
                    delete hangingChannelMidi[note];
                }
            }
        }
    }
}
