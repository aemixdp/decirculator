import { DelayList } from '../utils/DelayList';
import { PortInfo } from '../data/PortInfo';
import { sideByName } from '../data/Side';
import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { TickProcessor } from './data/TickProcessor';
import { CircuitConfig } from './data/CircuitConfig';
import { parseNotes, parseIntervals } from '../utils/musicUtils';
import blockDescriptors from './blocks';

type OnMidiOut =
    (noteOn: boolean, note: number, channel: number, velocity: number) => void;

export class Circuit {
    /**
     * Total number of objects (blocks and wires) in circuit.
     */
    length: number;
    /**
     * isWire[i] {blocks, wires} = true if i-th object is a wire, false otherwise.
     */
    isWire: Array<boolean>;
    /**
     * isOutputPort[i*4+s] {blocks} = true if port at Side s of i-th object is output port, false if it's an input port.
     */
    isOutputPort: Array<boolean>;
    /**
     * startPortInfo[i] {wires} = PortInfo of i-th object if it's a wire (isWire is redundant, but more readable).
     */
    startPortInfo: Array<PortInfo | null>;
    /**
     * blockTick[i] {blocks} = tick function for i-th block.
     */
    blockTick: Array<TickProcessor | null>;
    /**
     * gate[i] {wires} = gate state of i-th object.
     */
    gate: Array<boolean>;
    /**
     * outputGate[i*4+s] {blocks} = gate state at Side s of i-th object.
     */
    outputGate: Array<boolean>;
    /**
     * compensation[i] {blocks, wires} = compensation of i-th object in milliseconds.
     */
    compensation: Array<number>;
    /**
     * cooldown[i] {wires, MidiOut} = cooldown state of i-th object.
     */
    cooldown: Array<boolean>;
    /**
     * input[i*4+s] {blocks} = id of a wire, which is connected to Side s of i-th block.
     */
    input: Array<number>;
    /**
     * timeUntilTurnOn[i] {Clock} = time in milliseconds until i-th object should turn on.
     */
    timeUntilTurnOn: Array<number>;
    /**
     * timeUntilTurnOff[i] {wires} = time in milliseconds until i-th object should turn off.
     */
    timeUntilTurnOff: Array<number>;
    /**
     * switchTargetSide[i] {Switch} = currently selected i-th block side.
     */
    switchTargetSide: Array<number>;
    /**
     * delayList[i] {Delay} = DelayList object of i-th block.
     */
    delayList: Array<DelayList>;
    /**
     * counterValue[i] {Counter} = current counter value of i-th block.
     */
    counterValue: Array<number>;
    /**
     * counterSteps[i] {Counter} = counter steps of i-th block.
     */
    counterSteps: Array<number>;
    /**
     * ticking[i] {Clock} = true if i-th block is ticking (on), false otherwise (off).
     */
    ticking: Array<boolean>;
    /**
     * intervals[i] {Delay, Clock} = time intervals to wait for i-th block (stored as if bpm = 1).
     */
    intervals: Array<Array<number>>;
    /**
     * currentIntervalIndex[i] {Delay, Clock} = index of current interval of i-th block.
     */
    currentIntervalIndex: Array<number>;
    /**
     * channel[i] {MidiOut} = i-th block channel to send midi messages.
     */
    channel: Array<number>;
    /**
     * notes[i] {MidiOut} = midi notes to send for i-th block.
     */
    notes: Array<Array<number>>;
    /**
     * currentNoteIndex[i] {MidiOut} = index of current note of i-th block.
     */
    currentNoteIndex: Array<number>;
    /**
     * velocities[i] {MidiOut} = velocities of midi notes to send for i-th block.
     */
    velocities: Array<Array<number>>;
    /**
     * currentVelocityIndex[i] {MidiOut} = index of current velocity of i-th block.
     */
    currentVelocityIndex: Array<number>;
    /**
     * playFired[i] {Play} = true if i-th block was already in 'gate on' state during current simulation run.
     */
    playFired: Array<boolean>;
    /**
     * removed[i] {blocks, wires} = true if i-th block was removed.
     */
    removed: Array<boolean>;
    /**
     * changed[i] {blocks, wires} = true if i-th block had state changes during last circuit tick.
     */
    changed: Array<boolean>;
    /**
     * Function which is called every time circuit has changes that should be reflected in rendering.
     */
    onVisibleChanges: () => void;
    /**
     * Function which is called every time circuit sends a midi signal from MidiOut block.
     */
    onMidiOut: OnMidiOut;
    /**
     * Various pieces of dynamic circuit configuration.
     */
    config: CircuitConfig;
    /**
     * Unix timestamp of the last tick call.
     */
    timestamp: number;
    /**
     * Handle of timer which calls the tick function.
     */
    timer: any;
    constructor() {
        this.length = 0;
        this.isWire = [];
        this.isOutputPort = [];
        this.startPortInfo = [];
        this.blockTick = [];
        this.gate = [];
        this.outputGate = [];
        this.compensation = [];
        this.cooldown = [];
        this.input = [];
        this.timeUntilTurnOn = [];
        this.timeUntilTurnOff = [];
        this.switchTargetSide = [];
        this.delayList = [];
        this.counterValue = [];
        this.counterSteps = [];
        this.ticking = [];
        this.intervals = [];
        this.currentIntervalIndex = [];
        this.channel = [];
        this.notes = [];
        this.currentNoteIndex = [];
        this.velocities = [];
        this.currentVelocityIndex = [];
        this.playFired = [];
        this.removed = [];
        this.changed = [];
    }
    update(blocks: BlockCircuitObject[], wires: WireCircuitObject[], config: CircuitConfig) {
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
            this.isOutputPort.push(false);
            this.startPortInfo.push(null);
            this.blockTick.push(null);
            this.gate.push(false);
            this.outputGate.push(false, false, false, false);
            this.compensation.push(0);
            this.cooldown.push(false);
            this.input.push(-1, -1, -1, -1);
            this.timeUntilTurnOn.push(0);
            this.timeUntilTurnOff.push(0);
            this.switchTargetSide.push(0);
            this.delayList.push(new DelayList());
            this.counterValue.push(0);
            this.counterSteps.push(0);
            this.ticking.push(true);
            this.intervals.push([]);
            this.currentIntervalIndex.push(0);
            this.channel.push(0);
            this.notes.push([]);
            this.currentNoteIndex.push(0);
            this.velocities.push([]);
            this.currentVelocityIndex.push(0);
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
            const block = blocks[i] as any;
            const blockDescriptor = blockDescriptors[block.name];
            const id = block.id;
            this.blockTick[id] = blockDescriptor.tick;
            this.removed[id] = false;
            for (let sideName in block.ports) {
                this.isOutputPort[id * 4 + sideByName[sideName].index] = (block.ports[sideName] === 'out');
            }
            switch (block.name) {
                case 'Counter':
                    this.counterValue[id] = block.current;
                    this.counterSteps[id] = block.steps;
                    break;
                case 'Clock':
                    this.ticking[id] = block.ticking;
                    this.intervals[id] = parseIntervals(block.intervals, 1) || [];
                    if (block.skipFirstGate) {
                        const intervals = this.intervals[id];
                        this.timeUntilTurnOn[id] = intervals[0] / config.bpm;
                        this.currentIntervalIndex[id] = intervals.length > 1 ? 1 : 0;
                    }
                case 'Delay':
                    this.intervals[id] = parseIntervals(block.intervals, 1) || [];
                    break;
                case 'MidiOut':
                    this.channel[id] = block.channel;
                    this.notes[id] = parseNotes(block.notes) || [];
                    this.currentNoteIndex[id] = block.currentNoteIndex;
                    this.velocities[id] = block.velocities;
                    this.currentVelocityIndex[id] = block.currentVelocityIndex;
                default:
                    break;
            }
        }
        for (let i = 0; i < wires.length; i += 1) {
            const wire = wires[i];
            if (wire.endPortInfo) {
                this.isWire[wire.id] = true;
                this.startPortInfo[wire.id] = wire.startPortInfo;
                this.removed[wire.id] = false;
                this.input[wire.endPortInfo.blockId * 4 + wire.endPortInfo.port.side.index] = wire.id;
            }
        }
    }
    tick = () => {
        const now = Date.now();
        const delta = now - this.timestamp;
        this.timestamp = now;
        for (let i = 0; i < this.length; i += 1) {
            const blockTick = this.blockTick[i];
            if (!this.removed[i] && blockTick) {
                blockTick(this, i, delta, this.config);
            }
        }
        for (let i = 0; i < this.length; i += 1) {
            if (this.isWire[i]) {
                const spi = this.startPortInfo[i] as PortInfo;
                const outputGateIndex = spi.blockId * 4 + spi.port.side.index;
                if (this.outputGate[outputGateIndex]) {
                    this.gate[i] = true;
                    this.changed[i] = true;
                    this.compensation[i] = this.compensation[spi.blockId];
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
        this.timer = setInterval(this.tick, 0);
    }
    stop() {
        clearInterval(this.timer);
    }
}
