import DelayList from '../utils/DelayList';

const nop = () => { };

export default class {
    constructor({ onVisibleChanges }) {
        this.length = 0;
        this.isWire = [];
        this.startPortInfo = [];
        this.blockTick = [];
        this.gate = [];
        this.outputGate = [];
        this.cooldown = [];
        this.input = [];
        this.timeUntilGateOn = [];
        this.timeUntilGateOff = [];
        this.switchTargetSide = [];
        this.delayList = [];
        this.counterValue = [];
        this.counterSteps = [];
        this.beats = [];
        this.noteFraction = [];
        this.playFired = [];
        this.removed = [];
        this.changed = [];
        this.onVisibleChanges = onVisibleChanges;
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
            this.timeUntilGateOn.push(0);
            this.timeUntilGateOff.push(0);
            this.switchTargetSide.push(0);
            this.delayList.push(new DelayList());
            this.counterValue.push(0);
            this.counterSteps.push(0);
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
            this.blockTick[block.id] = block.tick;
            this.removed[block.id] = false;
            switch (block.name) {
                case 'Counter':
                    this.counterValue[block.id] = block.current;
                    this.counterSteps[block.id] = block.steps;
                    break;
                case 'Delay':
                    this.beats[block.id] = block.beats;
                    this.noteFraction[block.id] = block.noteFraction;
                    break;
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
                // console.log(`${i}#{blockId=${spi.blockId},side=${spi.port.side.index}}`);
                const outputGateIndex = spi.blockId * 4 + spi.port.side.index;
                if (this.outputGate[outputGateIndex]) {
                    this.gate[i] = true;
                    this.changed[i] = true;
                    // console.log(123);
                }
            }
        }
        for (let i = 0; i < this.outputGate.length; i += 1) {
            this.outputGate[i] = false;
        }
        for (let i = 0; i < this.length; i += 1) {
            if (!this.removed[i] && this.gate[i]) {
                if (this.timeUntilGateOff[i] <= 0) {
                    this.timeUntilGateOff[i] = this.config.gateLength;
                } else {
                    const timeUntilGateOff = this.timeUntilGateOff[i] -= delta;
                    if (timeUntilGateOff <= 0) {
                        this.changed[i] = this.changed[i] || this.gate[i];
                        this.gate[i] = false;
                        this.cooldown[i] = false;
                    }
                }
            }
        }
        if (this.changed.reduce((a, b) => a || b)) {
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