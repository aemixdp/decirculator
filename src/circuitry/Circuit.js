/* eslint no-fallthrough: off */

import utils from '../utils';
import DelayList from '../utils/DelayList';

const nop = () => { };

export default class {
    constructor({ onVisibleChanges, onMidiOut }) {
        // length {blocks, wires} = total number of objects (blocks and wires) in circuit
        this.length = 0;
        // isWire[i] {blocks, wires} = true if i-th object is a wire, false otherwise
        this.isWire = [];
        // startPortInfo[i] {wires} = PortInfo of i-th object if it's a wire, null otherwise (yes, isWire is redundant, but more readable)
        this.startPortInfo = [];
        // blockTick[i] {blocks} = tick function for i-th block
        this.blockTick = [];
        // gate[i] {wires} = gate state of i-th object
        this.gate = [];
        // outputGate[i*4+s] {blocks} = gate state at Side s of i-th object
        this.outputGate = [];
        // cooldown[i] {wires, MidiOut} = cooldown of i-th object in milliseconds
        this.cooldown = [];
        // input[i*4+s] {blocks} = id of a wire, which is connected to Side s of i-th block
        this.input = [];
        // timeUntilTurnOn[i] {Clock} = time in milliseconds until i-th object should turn on
        this.timeUntilTurnOn = [];
        // timeUntilTurnOff[i] {wires} = time in milliseconds until i-th object should turn off
        this.timeUntilTurnOff = [];
        // switchTargetSide[i] {Switch} = currently selected i-th block side
        this.switchTargetSide = [];
        // delayList[i] {Delay} = DelayList object of i-th block
        this.delayList = [];
        // counterValue[i] {Counter} = current counter value of i-th block
        this.counterValue = [];
        // counterValue[i] {Counter} = counter steps of i-th block
        this.counterSteps = [];
        // beats[i] {Delay, Clock} = number of beats to delay for i-th block
        this.beats = [];
        // noteFraction[i] {Delay, Clock} = note fraction used with beats to calcute delay for i-th block
        this.noteFraction = [];
        // channel[i] {MidiOut} = i-th block channel to send midi messages
        this.channel = [];
        // note[i] {MidiOut} = midi note to send for i-th block
        this.note = [];
        // velocity[i] {MidiOut} = velocity of midi note to send for i-th block
        this.velocity = [];
        // playFired[i] {Play} = true if i-th block was already in 'gate on' state during current simulation run
        this.playFired = [];
        // removed[i] {blocks, wires} = true if i-th block was removed
        this.removed = [];
        // changed[i] {blocks, wires} = true if i-th block had state changes during last circuit tick
        this.changed = [];
        this.onVisibleChanges = onVisibleChanges;
        this.onMidiOut = onMidiOut;
    }
    update(blocks, wires, config) {
        this.config = Object.assign({}, config);
        let maxId = 0;
        for (let i = 0; i < blocks.length; i += 1) {
            maxId = Math.max(maxId, blocks[i].id);
        }
        for (let i = 0; i < wires.length; i += 1) {
            maxId = Math.max(maxId, wires[i].id);
        }
        for (let i = this.length; i <= maxId; i += 1) {
            this.length += 1;
            this.isWire.push(false);
            this.startPortInfo.push(null);
            this.blockTick.push(nop);
            this.gate.push(false);
            this.outputGate.push(false, false, false, false);
            this.cooldown.push(false);
            this.input.push(-1, -1, -1, -1);
            this.timeUntilTurnOn.push(0);
            this.timeUntilTurnOff.push(0);
            this.switchTargetSide.push(0);
            this.delayList.push(new DelayList());
            this.counterValue.push(0);
            this.counterSteps.push(0);
            this.beats.push(0);
            this.noteFraction.push(0);
            this.channel.push(0);
            this.note.push(0);
            this.velocity.push(0);
            this.playFired.push(false);
            this.removed.push(false);
            this.changed.push(false);
        }
        for (let i = 0; i <= maxId; i += 1) {
            this.removed[i] = true;
            const offset = i * 4;
            for (let j = 0; j < 4; j += 1) {
                this.input[offset + j] = -1;
            }
        }
        for (let i = 0; i < blocks.length; i += 1) {
            const block = blocks[i];
            const id = block.id;
            this.blockTick[id] = block.tick;
            this.removed[id] = false;
            switch (block.name) {
                case 'Counter':
                    this.counterValue[id] = block.current;
                    this.counterSteps[id] = block.steps;
                    break;
                case 'Clock':
                    if (block.skipFirstGate) {
                        this.timeUntilTurnOn[id] = utils.music.noteToMs(block.beats, block.noteFraction, config.bpm);
                    }
                case 'Delay':
                    this.beats[id] = block.beats;
                    this.noteFraction[id] = block.noteFraction;
                    break;
                case 'MidiOut':
                    this.channel[id] = block.channel;
                    this.note[id] = block.note;
                    this.velocity[id] = block.velocity;
                default:
                    break;
            }
        }
        for (let i = 0; i < wires.length; i += 1) {
            const wire = wires[i];
            this.isWire[wire.id] = true;
            this.startPortInfo[wire.id] = wire.startPortInfo;
            this.removed[wire.id] = false;
            this.input[wire.endPortInfo.blockId * 4 + wire.endPortInfo.port.side.index] = wire.id;
        }
    }
    tick = () => {
        const now = Date.now();
        const delta = now - this.timestamp;
        this.timestamp = now;
        for (let i = 0; i < this.length; i += 1) {
            if (!this.removed[i]) {
                this.blockTick[i](this, i, delta, this.config);
            }
        }
        for (let i = 0; i < this.length; i += 1) {
            if (this.isWire[i]) {
                const spi = this.startPortInfo[i];
                const outputGateIndex = spi.blockId * 4 + spi.port.side.index;
                if (this.outputGate[outputGateIndex]) {
                    this.gate[i] = true;
                    this.changed[i] = true;
                }
            }
        }
        for (let i = 0; i < this.outputGate.length; i += 1) {
            this.outputGate[i] = false;
        }
        for (let i = 0; i < this.length; i += 1) {
            if (!this.removed[i] && this.gate[i]) {
                if (this.timeUntilTurnOff[i] <= 0) {
                    this.timeUntilTurnOff[i] = this.config.gateLength;
                } else {
                    const timeUntilTurnOff = this.timeUntilTurnOff[i] -= delta;
                    if (timeUntilTurnOff <= 0) {
                        this.changed[i] = this.changed[i] || this.gate[i];
                        this.gate[i] = false;
                        this.cooldown[i] = false;
                    }
                }
            }
        }
        if (this.changed.reduce((a, b) => a || b, false)) {
            this.onVisibleChanges();
        }
        for (let i = 0; i < this.length; i += 1) {
            this.changed[i] = false;
        }
    }
    start() {
        this.timestamp = Date.now();
        this.timer = setInterval(this.tick, 5);
    }
    stop() {
        clearInterval(this.timer);
    }
}