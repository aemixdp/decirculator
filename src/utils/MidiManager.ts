import { objectValues } from './objectUtils';
import FastPriorityQueue from 'fastpriorityqueue';

const CONTROL_CHANGE = 0xB0;
const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;

export interface MidiSignal {
    outputName: string;
    ccMode: boolean;
    channel: number;
    note: number;
    velocity: number;
    expireAt: number;
}

export interface MidiOutput {
    name: string;
    send(...args: any[]): void;
}

export class MidiManager {
    midiAccess: any;
    midiOutputs: { [_: string]: MidiOutput };
    hangingMidi: FastPriorityQueue<MidiSignal>;
    onOutputsChange: () => void;
    constructor() {
        this.midiOutputs = {};
        this.hangingMidi = new FastPriorityQueue();
        this.refreshDevices();
        setInterval(this.tick);
    }
    tick = () => {
        const timestamp = Date.now();
        while (true) {
            const signal = this.hangingMidi.peek();
            if (signal && timestamp >= signal.expireAt) {
                this.hangingMidi.poll();
                const midiOutput = this.midiOutputs[signal.outputName];
                if (!midiOutput) continue;
                midiOutput.send(signal.ccMode
                    ? [CONTROL_CHANGE + signal.channel - 1, signal.note, 0]
                    : [NOTE_OFF + signal.channel - 1, signal.note, signal.velocity]
                );
            } else {
                return;
            }
        }
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
    send(signal: MidiSignal) {
        const midiOutput = this.midiOutputs[signal.outputName];
        if (!midiOutput) return;
        const prefix = signal.ccMode ? CONTROL_CHANGE : NOTE_ON;
        midiOutput.send([prefix + signal.channel - 1, signal.note, signal.velocity]);
        this.hangingMidi.add(signal);
    }
}
