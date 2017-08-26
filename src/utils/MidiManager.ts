import { objectValues } from './objectUtils';

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;

type MidiOutput = {
    name: string;
    send(...args: any[]): void;
};

type MidiManagerOptions = {
    onOutputsChange: () => void;
};

export class MidiManager {
    midiOutputs: { [_: string]: MidiOutput };
    midiAccess: any;
    onOutputsChange: () => void;
    constructor({ onOutputsChange = () => { } }: MidiManagerOptions) {
        this.midiOutputs = {};
        this.onOutputsChange = onOutputsChange;
        (navigator as any).requestMIDIAccess().then((midiAccess: any) => {
            this.midiAccess = midiAccess;
            this.refreshDevices();
            setInterval(this.refreshDevices, 2000);
        });
    }
    refreshDevices = () => {
        if (!this.midiAccess) return;
        const outputs = {};
        let outputsChanged = false;
        for (const output of this.midiAccess.outputs.values()) {
            outputs[output.name] = output;
            if (!this.midiOutputs[output.name]) {
                outputsChanged = true;
            }
        }
        for (const output of objectValues(this.midiOutputs)) {
            if (!outputs[output.name]) {
                outputsChanged = true;
            }
        }
        this.midiOutputs = outputs;
        if (outputsChanged) {
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
