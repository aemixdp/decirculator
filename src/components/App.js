import React from 'react';
import { Stage, Layer } from 'react-konva';
import update from 'immutability-helper';
import Wire from './Wire';
import Block from './Block';
import BlockButton from './BlockButton';
import Props from './Props';
import Wireframe from './Wireframe';
import Dropdown from './Dropdown';
import Circuit from '../circuitry/Circuit';
import blocks from '../circuitry/blocks';
import utils from '../utils';

export default class extends React.Component {
    constructor() {
        super();
        this.clickHandled = false;
        this.themeManager = new utils.ThemeManager({
            onThemeChanged: this.handleThemeChanged,
        });
        this.midiManager = new utils.MidiManager({
            onDevicesChange: this.handleDevicesChange,
        });
        this.state = {
            theme: this.themeManager.theme,
            idCounter: 0,
            selectedObject: null,
            blocks: [],
            wires: [],
            newBlock: null,
            newWire: null,
            blockById: {},
            viewportOffset: { x: 0, y: 0 },
            hoveringPortInfo: null,
            circuitName: 'New circuit',
            midiOutput: { name: '' },
            midiOutputs: [],
            circuits: Object.keys(localStorage),
            config: {
                bpm: 130,
                gateLength: 500,
            },
        };
        this.resetCircuit();
    }
    resetCircuit() {
        if (this.circuit) {
            this.circuit.stop();
        }
        this.circuit = new Circuit({
            onVisibleChanges: this.handleCircuitVisibleChanges
        });
    }
    invalidateCircuit() {
        this.circuit.update(this.state.blocks, this.state.wires, this.state.config);
    }
    componentWillMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }
    componentDidMount() {
        this.refs.viewport.domNode.addEventListener('click', utils.events.propagationStopper);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.blocks.length !== this.state.blocks.length ||
            prevState.wires.length !== this.state.wires.length
        ) {
            this.invalidateCircuit();
        }
    }
    handleCircuitVisibleChanges = () => {
        this.setState({
            blocks: this.state.blocks.map(b =>
                (this.circuit.changed[b.id] && b.name === 'Counter')
                    ? { ...b, current: this.circuit.counterValue[b.id] }
                    : b
            ),
            wires: this.state.wires.map(w =>
                this.circuit.changed[w.id]
                    ? { ...w, gate: this.circuit.gate[w.id] }
                    : w
            ),
        });
    }
    handleThemeChanged = () => {
        this.setState({
            theme: this.themeManager.theme,
        });
    }
    handleDevicesChange = () => {
        this.setState({
            midiOutputs: Object.keys(this.midiManager.midiOutputs),
        });
    }
    handleKeyDown = (e) => {
        if (e.keyCode === 46 /* delete */) {
            if (!this.state.selectedObject) return;
            const id = this.state.selectedObject.id;
            this.setState({
                blocks: this.state.blocks.filter(b => b.id !== id),
                wires: this.state.wires.filter(w =>
                    w.id !== id &&
                    w.startPortInfo.blockId !== id &&
                    w.endPortInfo.blockId !== id
                ),
                selectedObject: null,
            });
        } else if (e.keyCode === 27 /* esc */) {
            this.setState({ selectedObject: null });
        }
    }
    handleNewBlockDragStart = (e, blockType) => {
        this.setState({
            idCounter: this.state.idCounter + 1,
            newBlock: {
                id: this.state.idCounter,
                kind: 'block',
                name: blockType.name,
                active: true,
                gateLength: 50,
                ...blockType.initialData,
                x: -100,
                y: -100,
                ports: Block.DefaultPorts,
                tick: blockType.tick,
            },
        });
    }
    handleNewBlockDragEnd = (e) => {
        if (this.refs.viewport.domNode.contains(e.evt.toElement)) {
            this.setState({
                blocks: [...this.state.blocks, this.state.newBlock],
                blockById: { ...this.state.blockById, [this.state.newBlock.id]: this.state.newBlock },
            });
        }
        this.setState({
            newBlock: null,
        });
    }
    handleBlockMouseEnter = () => {
        document.body.style.cursor = 'move';
    }
    handleBlockMouseLeave = () => {
        document.body.style.cursor = 'default';
    }
    handleBlockDrag = (e, blockComponent) => {
        if (this.refs.viewport.domNode.contains(e.evt.toElement)) {
            const transform = (block) => block && Object.assign({}, block,
                Wireframe.snapToWireframe(this.props.config.wireframeCellSize, {
                    x: e.evt.offsetX - this.state.viewportOffset.x - 25,
                    y: e.evt.offsetY - this.state.viewportOffset.y - 25,
                })
            );
            const transformedBlock = blockComponent.hasOwnProperty('id') &&
                transform(this.state.blockById[blockComponent.id]);
            if (transformedBlock) {
                this.setState({
                    blocks: this.state.blocks.map(b =>
                        b.id === transformedBlock.id ? transformedBlock : b),
                    blockById: {
                        ...this.state.blockById,
                        [transformedBlock.id]: transformedBlock
                    },
                });
            } else {
                this.setState({ newBlock: transform(this.state.newBlock) });
            }
        }
    }
    handleViewportDrag = (e) => {
        if (e.target.nodeType === 'Stage') {
            const { x, y } = e.target.attrs;
            this.setState({
                viewportOffset: Wireframe.snapToWireframe(
                    this.props.config.wireframeCellSize,
                    { x, y }
                ),
            });
        }
    }
    handleViewportMouseDown = (e) => {
        if (this.state.hoveringPortInfo) {
            const hpi = this.state.hoveringPortInfo;
            const startPosition = utils.geometry.center(hpi.port, this.state.blockById[hpi.blockId]);
            this.setState({
                idCounter: this.state.idCounter + 1,
                newWire: {
                    id: this.state.idCounter,
                    kind: 'wire',
                    active: true,
                    startPosition,
                    startPortInfo: hpi,
                    endPosition: startPosition,
                    endPortInfo: null,
                },
            });
        }
    }
    handleViewportMouseUp = (e) => {
        const newWire = this.state.newWire;
        if (
            newWire &&
            newWire.endPortInfo &&
            newWire.endPortInfo.blockId !== newWire.startPortInfo.blockId
        ) {
            delete newWire.startPosition;
            delete newWire.endPosition;
            this.setState({
                wires: [...this.state.wires, newWire],
                blocks: this.state.blocks.map(block => {
                    if (block.id === newWire.startPortInfo.blockId)
                        return update(block, { ports: { [newWire.startPortInfo.port.side]: { $set: 'out' } } });
                    else if (block.id === newWire.endPortInfo.blockId)
                        return update(block, { ports: { [newWire.endPortInfo.port.side]: { $set: 'in' } } });
                    else
                        return block;
                }),
            });
        }
        this.setState({
            newWire: null,
        });
    }
    handleViewportMouseMove = (e) => {
        if (this.state.newWire) {
            const hpi = this.state.hoveringPortInfo;
            const ep = hpi && utils.geometry.center(hpi.port, this.state.blockById[hpi.blockId]);
            this.setState({
                newWire: {
                    ...this.state.newWire,
                    endPosition: ep || {
                        x: e.evt.offsetX - this.state.viewportOffset.x,
                        y: e.evt.offsetY - this.state.viewportOffset.y,
                    },
                    endPortInfo: hpi,
                },
            });
        }
    }
    handleViewportClick = (e) => {
        if (!this.clickHandled) {
            this.setState({
                selectedObject: null,
            });
        }
        this.clickHandled = false;
    }
    handleOuterClick = () => {
        this.setState({ selectedObject: null });
    }
    handlePortClick = (e, block, port) => {
        const wire = this.state.wires.find(wire =>
            (wire.startPortInfo.blockId === block.id && wire.startPortInfo.port.side === port.side) ||
            (wire.endPortInfo.blockId === block.id && wire.endPortInfo.port.side === port.side)
        );
        const togglePort = (block, side) =>
            update(block, { ports: { [side]: { $set: block.ports[side] === 'in' ? 'out' : 'in' } } });
        this.setState({
            blocks: this.state.blocks.map(b => {
                if (b.id === block.id)
                    return togglePort(b, port.side);
                else if (wire && b.id === wire.startPortInfo.blockId)
                    return togglePort(b, wire.startPortInfo.port.side);
                else if (wire && b.id === wire.endPortInfo.blockId)
                    return togglePort(b, wire.endPortInfo.port.side);
                else return b;
            }),
        });
        this.clickHandled = true;
    }
    handlePortMouseEnter = (e, block, port) => {
        this.setState({
            hoveringPortInfo: { blockId: block.id, port },
        });
        document.body.style.cursor = 'pointer';
    }
    handlePortMouseLeave = (e, port) => {
        this.setState({
            hoveringPortInfo: null,
        });
        document.body.style.cursor = 'default';
    }
    handleObjectClick = (e, object) => {
        this.setState({
            selectedObject: object,
        });
        this.clickHandled = true;
    }
    handlePropertyChange = (e, object, propName, propValue) => {
        const mapper = (o) =>
            o.id !== object.id ? o
                : { ...o, [propName]: propValue };
        this.setState({
            blocks: this.state.blocks.map(mapper),
            wires: this.state.wires.map(mapper),
            selectedObject: mapper(this.state.selectedObject),
        });
    }
    handleBpmSelect = () => {

    }
    handleBpmChange = () => {

    }
    handlePlay = () => {
        this.circuit.start();
    }
    handlePause = () => {
        this.circuit.stop();
    }
    handleStop = () => {
        this.resetCircuit();
        this.invalidateCircuit();
    }
    handleCircuitSave = () => {
        const circuitData = {
            blocks: this.state.blocks,
            wires: this.state.wires,
            idCounter: this.state.idCounter,
        };
        localStorage.setItem(this.state.circuitName, JSON.stringify(circuitData, null, 0));
        this.setState({ circuits: Object.keys(localStorage) });
    }
    handleCircuitSelect = (e) => {
        const circuitName = e.target.value;
        const circuitData = JSON.parse(localStorage.getItem(circuitName));
        if (circuitData) {
            this.resetCircuit();
            this.setState({
                circuitName,
                selectedObject: null,
                blocks: circuitData.blocks.map(b => ({
                    ...b,
                    tick: blocks[b.name].tick
                })),
                wires: circuitData.wires,
                idCounter: circuitData.idCounter,
                blockById: circuitData.blocks.reduce((acc, b) => (acc[b.id] = b) && acc, {}),
            });
        }
    }
    handleCircuitNameChange = (e) => {
        this.setState({ circuitName: e.target.value });
    }
    handleMidiOutputChange = (e) => {
        this.setState({ midiOutput: this.midiManager.midiOutputs[e.target.value] });
    }
    renderBlock = (block) => {
        const blockType = block && blocks[block.name];
        return blockType &&
            <blockType.component {...block}
                key={`block_${block.id}`}
                theme={this.state.theme}
                isSelected={this.state.selectedObject &&
                    block.id === this.state.selectedObject.id}
                hoveringPort={
                    (
                        this.state.hoveringPortInfo &&
                        block.id === this.state.hoveringPortInfo.blockId
                    )
                        ? this.state.hoveringPortInfo.port
                        : null
                }
                onDragMove={this.handleBlockDrag}
                onMouseEnter={this.handleBlockMouseEnter}
                onMouseLeave={this.handleBlockMouseLeave}
                onClick={this.handleObjectClick}
            />;
    }
    renderWire = (wire) => {
        if (!wire) return;
        const spi = wire.startPortInfo;
        const epi = wire.endPortInfo;
        const startPosition = wire.startPosition || utils.geometry.center(spi.port, this.state.blockById[spi.blockId]);
        const endPosition = wire.endPosition || utils.geometry.center(epi.port, this.state.blockById[epi.blockId]);
        return (
            <Wire {...wire}
                key={`wire_${wire.id}`}
                startPosition={startPosition}
                endPosition={endPosition}
                theme={this.state.theme}
                isSelected={this.state.selectedObject &&
                    wire.id === this.state.selectedObject.id}
                onClick={this.handleObjectClick}
            />
        );
    }
    renderProps = (object) => {
        return (
            <Props {...(object || {}) }
                onPropertyChange={this.handlePropertyChange}
                onPropertyClick={utils.events.propagationStopper}
            />
        );
    }
    renderHoverZones = () => {
        return this.state.blocks.map(block =>
            <Block.HoverZones {...block}
                key={`hover_zones_${block.id}`}
                onPortMouseEnter={this.handlePortMouseEnter}
                onPortMouseLeave={this.handlePortMouseLeave}
                onPortClick={this.handlePortClick}
            />
        );
    }
    render() {
        return (
            <div
                className="app-container"
                onClick={this.handleOuterClick}
            >
                <div className="v-box app">
                    <div className="h-box block-buttons">
                        {Object.values(blocks).map(blockType =>
                            <BlockButton {...blockType}
                                key={blockType.name}
                                theme={this.state.theme}
                                onDragStart={this.handleNewBlockDragStart}
                                onDragEnd={this.handleNewBlockDragEnd}
                                onDragMove={this.handleBlockDrag}
                            />
                        )}
                        <div className="controls simulation-controls" style={{ flex: 1 }}>
                            <div className="row">
                                <span className="label">
                                    BPM:
                                </span>
                                <Dropdown
                                    className="entry"
                                    value={this.state.config.bpm}
                                    variants={[120, 125, 128, 130, 140, 170, 175]}
                                    spellCheck="false"
                                    onValueSelect={this.handleBpmSelect}
                                    onTextChange={this.handleBpmChange}
                                />
                            </div>
                            <div className="row">
                                <i
                                    className="button fa fa-play-circle-o"
                                    aria-hidden="true"
                                    onClick={this.handlePlay}>
                                </i>
                                <i
                                    className="button fa fa-pause-circle-o"
                                    aria-hidden="true"
                                    onClick={this.handlePause}>
                                </i>
                                <i
                                    className="button fa fa-stop-circle-o"
                                    aria-hidden="true"
                                    onClick={this.handleStop}>
                                </i>
                            </div>
                        </div>
                        <div className="controls circuit-controls">
                            <div className="row">
                                <span className="label">
                                    Circuit:
                                </span>
                                <Dropdown
                                    className="entry"
                                    value={this.state.circuitName}
                                    variants={this.state.circuits}
                                    spellCheck="false"
                                    onValueSelect={this.handleCircuitSelect}
                                    onTextChange={this.handleCircuitNameChange}
                                />
                                <i
                                    className="button save fa fa-save"
                                    aria-hidden="true"
                                    onClick={this.handleCircuitSave}>
                                </i>
                            </div>
                            <div className="row">
                                <span className="label">
                                    Send midi to:
                                </span>
                                <Dropdown
                                    className="entry"
                                    value={this.state.midiOutput.name}
                                    variants={this.state.midiOutputs}
                                    spellCheck="false"
                                    onValueSelect={this.handleMidiOutputChange}
                                />
                                <i className="button refresh fa fa-refresh" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                    {this.renderProps(this.state.selectedObject)}
                    <Stage ref="viewport"
                        x={this.state.viewportOffset.x}
                        y={this.state.viewportOffset.y}
                        width={952}
                        height={600}
                        draggable={this.state.hoveringPortInfo === null}
                        onDragMove={this.handleViewportDrag}
                        onContentMouseDown={this.handleViewportMouseDown}
                        onContentMouseUp={this.handleViewportMouseUp}
                        onContentMouseMove={this.handleViewportMouseMove}
                        onContentClick={this.handleViewportClick}
                    >
                        <Wireframe
                            theme={this.state.theme}
                            x={-this.state.viewportOffset.x}
                            y={-this.state.viewportOffset.y}
                            wireframeCellSize={this.props.config.wireframeCellSize}
                        />
                        <Layer>
                            {this.state.blocks.map(this.renderBlock)}
                            {this.renderBlock(this.state.newBlock)}
                            {this.state.wires.map(this.renderWire)}
                            {this.renderWire(this.state.newWire)}
                            {this.renderHoverZones()}
                        </Layer>
                    </Stage>
                </div>
            </div>
        );
    }
}