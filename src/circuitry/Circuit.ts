import { DelayList } from '../utils/DelayList';
import { PortInfo } from '../data/PortInfo';
import { sideByName } from '../data/Side';
import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { TickProcessor } from './data/TickProcessor';
import { CircuitConfig } from './data/CircuitConfig';
import { parseNotes, parseIntervals, parseVelocities } from '../utils/musicUtils';
import blockDescriptors from './blocks';

type OnMidiOut =
    (ccMode: boolean, note: number, channel: number, velocity: number, expireAt: number) => void;

export class Circuit {
    /**
     * Total number of objects (blocks and wires) in circuit.
     */
    length: number;
    /**
     * active[i] {blocks, wires} = true if i-th object is active, false otherwise.
     */
    active: Array<boolean>;
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
     * visualGate[i] {wires} = visual gate state of i-th object.
     */
    visualGate: Array<boolean>;
    /**
     * outputGate[i*4+s] {blocks} = gate state at Side s of i-th object.
     */
    outputGate: Array<boolean>;
    /**
     * compensation[i] {blocks, wires} = compensation of i-th object in milliseconds.
     */
    compensation: Array<number>;
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
    timeUntilVisualGateOff: Array<number>;
    /**
     * switchTargetSide[i] {Switch} = currently selected i-th block side.
     */
    switchTargetSide: Array<number>;
    /**
     * delayList[i] {Delay} = DelayList object of i-th block.
     */
    delayList: Array<DelayList>;
    /**
     * oneShot[i] {Counter} = true if i-th block should output signals only once.
     */
    oneShot: Array<boolean>;
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
     * ccMode[i] {MidiOut} = true if i-th block should send control change messages instead of note on/off.
     */
    ccMode: Array<boolean>;
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
     * durations[i] {MidiOut} = durations of midi notes to send for i-th block.
     */
    durations: Array<Array<number>>;
    /**
     * currentDurationIndex[i] {MidiOut} = index of current duration of i-th block.
     */
    currentDurationIndex: Array<number>;
    /**
     * playFired[i] {Play} = true if i-th block was already in 'gate on' state during current simulation run.
     */
    fired: Array<boolean>;
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
        this.active = [];
        this.isWire = [];
        this.isOutputPort = [];
        this.startPortInfo = [];
        this.blockTick = [];
        this.gate = [];
        this.visualGate = [];
        this.outputGate = [];
        this.compensation = [];
        this.input = [];
        this.timeUntilTurnOn = [];
        this.timeUntilVisualGateOff = [];
        this.switchTargetSide = [];
        this.delayList = [];
        this.oneShot = [];
        this.counterValue = [];
        this.counterSteps = [];
        this.ticking = [];
        this.intervals = [];
        this.currentIntervalIndex = [];
        this.ccMode = [];
        this.channel = [];
        this.notes = [];
        this.currentNoteIndex = [];
        this.velocities = [];
        this.currentVelocityIndex = [];
        this.durations = [];
        this.currentDurationIndex = [];
        this.fired = [];
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
            this.active.push(true);
            this.isWire.push(false);
            this.isOutputPort.push(false);
            this.startPortInfo.push(null);
            this.blockTick.push(null);
            this.gate.push(false);
            this.visualGate.push(false);
            this.outputGate.push(false, false, false, false);
            this.compensation.push(0);
            this.input.push(-1, -1, -1, -1);
            this.timeUntilTurnOn.push(0);
            this.timeUntilVisualGateOff.push(0);
            this.switchTargetSide.push(0);
            this.delayList.push(new DelayList());
            this.oneShot.push(false);
            this.counterValue.push(0);
            this.counterSteps.push(0);
            this.ticking.push(true);
            this.intervals.push([]);
            this.currentIntervalIndex.push(0);
            this.ccMode.push(false);
            this.channel.push(0);
            this.notes.push([]);
            this.currentNoteIndex.push(0);
            this.velocities.push([]);
            this.currentVelocityIndex.push(0);
            this.durations.push([]);
            this.currentDurationIndex.push(0);
            this.fired.push(false);
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
            this.active[id] = block.active;
            this.blockTick[id] = blockDescriptor.tick;
            this.removed[id] = false;
            for (let sideName in block.ports) {
                this.isOutputPort[id * 4 + sideByName[sideName].index] = (block.ports[sideName] === 'out');
            }
            switch (block.name) {
                case 'Counter':
                    this.oneShot[id] = block.oneShot;
                    this.counterValue[id] = block.current;
                    this.counterSteps[id] = block.steps;
                    break;
                case 'Clock':
                    this.ticking[id] = block.ticking;
                    this.intervals[id] = parseIntervals(block.intervals, 1) || [];
                    if (block.skipFirstGate && this.timeUntilTurnOn[id] === 0) {
                        const intervals = this.intervals[id];
                        this.timeUntilTurnOn[id] = intervals[0] / config.bpm;
                        this.currentIntervalIndex[id] = intervals.length > 1 ? 1 : 0;
                    }
                    break;
                case 'Delay':
                    this.intervals[id] = parseIntervals(block.intervals, 1) || [];
                    break;
                case 'MidiOut':
                    this.ccMode[id] = block.ccMode;
                    this.channel[id] = block.channel;
                    this.notes[id] = parseNotes(block.notes) || [];
                    this.currentNoteIndex[id] = block.currentNoteIndex;
                    this.velocities[id] = parseVelocities(block.velocities) || [];
                    this.currentVelocityIndex[id] = block.currentVelocityIndex;
                    this.durations[id] = parseIntervals(block.durations, 1) || [];
                    this.currentDurationIndex[id] = block.currentDurationIndex;
                case 'Switch':
                    this.switchTargetSide[id] = block.targetSide;
                    break;
                case 'Play':
                    if (this.timeUntilTurnOn[id] === 0) {
                        this.timeUntilTurnOn[id] = block.skipBars *
                            (parseIntervals(block.signature, config.bpm) || [0])[0];
                    }
                    break;
                default:
                    break;
            }
        }
        for (let i = 0; i < wires.length; i += 1) {
            const wire = wires[i];
            if (wire.endPortInfo) {
                const id = wire.id;
                this.active[id] = wire.active;
                this.isWire[id] = true;
                this.startPortInfo[id] = wire.startPortInfo;
                this.removed[id] = false;
                this.input[wire.endPortInfo.blockId * 4 + wire.endPortInfo.port.side.index] = id;
            }
        }
    }
    tick = () => {
        const now = Date.now();
        const delta = now - this.timestamp;
        this.timestamp = now;
        for (let i = 0; i < this.length; i += 1) {
            const blockTick = this.blockTick[i];
            if (!this.removed[i] && this.active[i] && blockTick) {
                blockTick(this, i, delta, this.config);
            }
        }
        for (let i = 0; i < this.length; i += 1) {
            if (this.isWire[i]) {
                const visualGate = this.visualGate[i];
                if (visualGate) {
                    const timeUntilVisualGateOff = this.timeUntilVisualGateOff[i] -= delta;
                    if (timeUntilVisualGateOff <= 0) {
                        this.visualGate[i] = false;
                        this.changed[i] = true;
                    }
                }
                this.gate[i] = false;
                const spi = this.startPortInfo[i] as PortInfo;
                const outputGateIndex = spi.blockId * 4 + spi.port.side.index;
                if (this.outputGate[outputGateIndex]) {
                    this.gate[i] = true;
                    this.compensation[i] = this.compensation[spi.blockId];
                    if (!visualGate) {
                        this.changed[i] = true;
                    }
                    this.visualGate[i] = true;
                    this.timeUntilVisualGateOff[i] = this.config.gateLength;
                }
            }
        }
        for (let i = 0; i < this.outputGate.length; i += 1) {
            this.outputGate[i] = false;
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
