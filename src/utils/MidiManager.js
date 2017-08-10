// @flow

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;

type MidiOutput = {
    name: string;
    send(...args: any): void;
};

type MidiManagerOptions = {
    onDevicesChange: () => void;
};

export default class MidiManager {
    midiOutputs: Map<string, MidiOutput>;
    midiAccess: Object;
    onDevicesChange: () => void;
    constructor({ onDevicesChange = () => { } }: MidiManagerOptions) {
        this.midiOutputs = new Map();
        this.onDevicesChange = onDevicesChange;
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then((midiAccess) => {
                this.midiAccess = midiAccess;
                this.refreshDevices();
                setInterval(this.refreshDevices, 2000);
            });
        }
    }
    refreshDevices = () => {
        if (!this.midiAccess) return;
        const outputs: Map<string, MidiOutput> = new Map();
        let outputsChanged = false;
        for (const output of this.midiAccess.outputs.values()) {
            outputs.set(output.name, output);
            if (!this.midiOutputs.has(output.name)) {
                outputsChanged = true;
            }
        }
        for (const output of this.midiOutputs.values()) {
            if (!outputs.has(output.name)) {
                outputsChanged = true;
            }
        }
        this.midiOutputs = outputs;
        if (outputsChanged) {
            this.onDevicesChange();
        }
    }
    note(outputName: string, toggleState: boolean, channel: number, note: number, velocity: number): void {
        const statusPrefix = toggleState ? NOTE_ON : NOTE_OFF;
        const midiOutput = this.midiOutputs.get(outputName);
        if (midiOutput) {
            midiOutput.send([statusPrefix + channel - 1, note, velocity]);
        }
    }
}