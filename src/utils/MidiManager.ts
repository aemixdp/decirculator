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
    onOutputsChange: () => void;
    constructor() {
        this.midiOutputs = {};
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
            midiOutput.send([CONTROL_CHANGE + channel - 1, note, toggleState ? velocity : 0]);
        } else {
            const statusPrefix = toggleState ? NOTE_ON : NOTE_OFF;
            midiOutput.send([statusPrefix + channel - 1, note, velocity]);
        }
    }
}
