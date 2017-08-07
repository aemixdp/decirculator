const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;

export default class {
    constructor({ onDevicesChange = () => { } }) {
        this.midiOutputs = {};
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
        const outputs = {};
        let outputsChanged = false;
        for (const output of this.midiAccess.outputs.values()) {
            outputs[output.name] = output;
            if (!this.midiOutputs[output.name]) {
                outputsChanged = true;
            }
        }
        for (const output of Object.values(this.midiOutputs)) {
            if (!outputs[output.name]) {
                outputsChanged = true;
            }
        }
        this.midiOutputs = outputs;
        if (outputsChanged) {
            this.onDevicesChange();
        }
    }
    note(outputName, toggleState, channel, note, velocity) {
        const statusPrefix = toggleState ? NOTE_ON : NOTE_OFF;
        this.midiOutputs[outputName].send([statusPrefix + channel - 1, note, velocity]);
    }
}