import { objectValues } from './objectUtils';

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
    note(outputName: string, toggleState: boolean, channel: number, note: number, velocity: number): void {
        const statusPrefix = toggleState ? NOTE_ON : NOTE_OFF;
        const midiOutput = this.midiOutputs[outputName];
        if (midiOutput) {
            midiOutput.send([statusPrefix + channel - 1, note, velocity]);
        }
    }
}
