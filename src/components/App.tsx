import update from 'immutability-helper';
import React from 'react';
import ReactKonva from 'react-konva';
import { Wire } from './Wire';
import { BlockHoverZone } from './BlockHoverZone';
import { BlockButton } from './BlockButton';
import { IconButton } from './IconButton';
import { Properties } from './Properties';
import { Wireframe, snapToWireframe } from './Wireframe';
import { Dropdown } from './Dropdown';
import { ThemeManager } from '../utils/ThemeManager';
import { MidiManager } from '../utils/MidiManager';
import { propagationStopper } from '../utils/eventUtils';
import { defaultPortDirections } from '../data/PortDirection';
import { Circuit } from '../circuitry/Circuit';
import { shapeCenter } from '../utils/geometryUtils';
import { objectValues } from '../utils/objectUtils';
import { CircuitObject } from '../data/CircuitObject';
import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { Point } from '../data/Point';
import { PortInfo } from '../data/PortInfo';
import { BlockDescriptor } from '../data/BlockDescriptor';
import blockDescriptors from '../circuitry/blocks';
import { PortLocationInfo } from '../data/PortLocationInfo';
import { AnyCircuitObject } from '../data/CircuitObject/AnyCircuitObject';

const { Stage, Layer }: any = ReactKonva;

type Props = {
    wireframeCellSize: number;
};

type State = {
    theme: any;
    idCounter: number;
    selectedObject?: CircuitObject;
    blocks: BlockCircuitObject[];
    wires: WireCircuitObject[];
    newBlock?: BlockCircuitObject;
    newWire?: WireCircuitObject;
    blockById: { [id: number]: BlockCircuitObject };
    blocksBeforeSimulation: { [id: number]: BlockCircuitObject };
    viewportOffset: Point;
    hoveringPortInfo?: PortInfo;
    midiOutput: { name: string };
    midiOutputs: string[];
    circuitName: string;
    circuits: string[];
    simulationState: 'started' | 'paused' | 'stopped';
    config: { bpm: number, gateLength: number };
};

export class App extends React.Component<Props, State> {
    clickHandled: boolean;
    themeManager: ThemeManager;
    midiManager: MidiManager;
    circuit: Circuit;
    refs: {
        viewport: any;
    };
    constructor() {
        super();
        this.clickHandled = false;
        this.themeManager = new ThemeManager({
            pollInterval: 500,
            onThemeChanged: this.handleThemeChanged,
        });
        this.midiManager = new MidiManager({
            onDevicesChange: this.handleDevicesChange,
        });
        this.state = {
            theme: this.themeManager.theme,
            idCounter: 0,
            selectedObject: undefined,
            blocks: [],
            wires: [],
            newBlock: undefined,
            newWire: undefined,
            blockById: {},
            blocksBeforeSimulation: [],
            viewportOffset: { x: 0, y: 0 },
            hoveringPortInfo: undefined,
            midiOutput: { name: '' },
            midiOutputs: [],
            circuitName: 'New circuit',
            circuits: Object.keys(localStorage),
            simulationState: 'stopped',
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
            onVisibleChanges: this.handleCircuitVisibleChanges,
            onMidiOut: this.handleMidiOut,
        });
    }
    invalidateCircuit() {
        this.circuit.update(this.state.blocks, this.state.wires, this.state.config);
    }
    componentWillMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }
    componentDidMount() {
        this.refs.viewport.domNode.addEventListener('click', propagationStopper);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    componentDidUpdate(prevProps: Props, prevState: State) {
        if (
            this.state.blocks !== prevState.blocks ||
            this.state.wires !== prevState.wires
        ) {
            this.invalidateCircuit();
        }
    }
    handleCircuitVisibleChanges = () => {
        const newBlocks = this.state.blocks.map(b =>
            (this.circuit.changed[b.id] && b.name === 'Counter')
                ? { ...b, current: this.circuit.counterValue[b.id] }
                : b
        );
        this.setState({
            blocks: newBlocks,
            wires: this.state.wires.map(w =>
                this.circuit.changed[w.id]
                    ? { ...w, gate: this.circuit.gate[w.id] }
                    : w
            ),
            blockById: newBlocks.reduce((acc, b) => (acc[b.id] = b) && acc, {}),
        });
    }
    handleMidiOut = (toggleState: boolean, channel: number, note: number, velocity: number) => {
        if (this.state.midiOutput.name) {
            this.midiManager.note(this.state.midiOutput.name, toggleState, channel, note, velocity);
        }
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
    handleKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode === 46 /* delete */) {
            if (!this.state.selectedObject) return;
            const id = this.state.selectedObject.id;
            this.setState({
                blocks: this.state.blocks.filter(b => b.id !== id),
                wires: this.state.wires.filter(w =>
                    w.id !== id &&
                    w.startPortInfo.blockId !== id &&
                    w.endPortInfo &&
                    w.endPortInfo.blockId !== id
                ),
                selectedObject: undefined,
            });
        } else if (e.keyCode === 27 /* esc */) {
            this.setState({ selectedObject: undefined });
        }
    }
    handleNewBlockDragStart = (e: Event, blockDescriptor: BlockDescriptor<any>) => {
        this.setState({
            idCounter: this.state.idCounter + 1,
            newBlock: {
                id: this.state.idCounter,
                kind: 'block',
                name: blockDescriptor.name,
                active: true,
                gateLength: 50,
                x: -100,
                y: -100,
                ports: defaultPortDirections,
                ...blockDescriptor.initialState,
            },
        });
    }
    handleNewBlockDragEnd = (event: any) => {
        if (
            this.state.newBlock &&
            this.refs.viewport.domNode.contains(event.evt.toElement)
        ) {
            this.setState({
                blocks: [...this.state.blocks, this.state.newBlock],
                blockById: { ...this.state.blockById, [this.state.newBlock.id]: this.state.newBlock },
            });
        }
        this.setState({
            newBlock: undefined,
        });
    }
    handleBlockMouseEnter = () => {
        document.body.style.cursor = 'move';
    }
    handleBlockMouseLeave = () => {
        document.body.style.cursor = 'default';
    }
    handleBlockDrag = (event: any, block: any) => {
        if (this.refs.viewport.domNode.contains(event.evt.toElement)) {
            const transform = (blk: BlockCircuitObject) => blk && Object.assign({}, blk,
                snapToWireframe(this.props.wireframeCellSize, {
                    x: event.evt.offsetX - this.state.viewportOffset.x - 25,
                    y: event.evt.offsetY - this.state.viewportOffset.y - 25,
                })
            );
            const transformedBlock = block.hasOwnProperty('id') &&
                transform(this.state.blockById[block.id]);
            if (transformedBlock) {
                this.setState({
                    blocks: this.state.blocks.map(b =>
                        b.id === transformedBlock.id ? transformedBlock : b),
                    blockById: {
                        ...this.state.blockById,
                        [transformedBlock.id]: transformedBlock
                    },
                });
            } else if (this.state.newBlock) {
                this.setState({ newBlock: transform(this.state.newBlock) });
            }
        }
    }
    handleViewportDrag = (event: any) => {
        if (event.target.nodeType === 'Stage') {
            const { x, y } = event.target.attrs;
            this.setState({
                viewportOffset: snapToWireframe(
                    this.props.wireframeCellSize,
                    { x, y }
                ),
            });
        }
    }
    handleViewportMouseDown = (e: Event) => {
        if (this.state.hoveringPortInfo) {
            const hpi = this.state.hoveringPortInfo;
            const startPosition = shapeCenter(hpi.port, this.state.blockById[hpi.blockId]);
            this.setState({
                idCounter: this.state.idCounter + 1,
                newWire: {
                    id: this.state.idCounter,
                    kind: 'wire',
                    active: true,
                    startPosition,
                    startPortInfo: hpi,
                    endPosition: startPosition,
                    endPortInfo: undefined,
                    gate: false,
                },
            });
        }
    }
    handleViewportMouseUp = (event: any) => {
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
                    if (newWire.startPortInfo.blockId === block.id) {
                        return update(block, {
                            ports: { [newWire.startPortInfo.port.side.name]: { $set: 'out' } }
                        });
                    } else if (
                        newWire.endPortInfo &&
                        newWire.endPortInfo.blockId === block.id
                    ) {
                        return update(block, {
                            ports: { [newWire.endPortInfo.port.side.name]: { $set: 'in' } }
                        });
                    } else {
                        return block;
                    }
                }),
            });
        }
        this.setState({
            newWire: undefined,
        });
    }
    handleViewportMouseMove = (event: any) => {
        if (this.state.newWire) {
            const hpi = this.state.hoveringPortInfo;
            const ep = hpi && shapeCenter(hpi.port, this.state.blockById[hpi.blockId]);
            this.setState({
                newWire: {
                    ...this.state.newWire,
                    endPosition: ep || {
                        x: event.evt.offsetX - this.state.viewportOffset.x,
                        y: event.evt.offsetY - this.state.viewportOffset.y,
                    },
                    endPortInfo: hpi,
                },
            });
        }
    }
    handleViewportClick = (event: any) => {
        if (!this.clickHandled) {
            this.setState({
                selectedObject: undefined,
            });
        }
        this.clickHandled = false;
    }
    handleOuterClick = () => {
        this.setState({ selectedObject: undefined });
    }
    handlePortClick = (event: any, block: BlockCircuitObject, port: PortLocationInfo) => {
        const wire = this.state.wires.find(w =>
            (w.startPortInfo.blockId === block.id && w.startPortInfo.port.side === port.side) ||
            (w.endPortInfo !== undefined && w.endPortInfo.blockId === block.id && w.endPortInfo.port.side === port.side)
        );
        const togglePort = (blk: BlockCircuitObject, sideName: string) =>
            update(blk, { ports: { [sideName]: { $set: blk.ports[sideName] === 'in' ? 'out' : 'in' } } });
        this.setState({
            blocks: this.state.blocks.map(b => {
                if (b.id === block.id) {
                    return togglePort(b, port.side.name);
                } else if (wire && b.id === wire.startPortInfo.blockId) {
                    return togglePort(b, wire.startPortInfo.port.side.name);
                } else if (wire && wire.endPortInfo && b.id === wire.endPortInfo.blockId) {
                    return togglePort(b, wire.endPortInfo.port.side.name);
                } else {
                    return b;
                }
            }),
        });
        this.clickHandled = true;
    }
    handlePortMouseEnter = (event: any, block: BlockCircuitObject, port: PortLocationInfo) => {
        this.setState({
            hoveringPortInfo: { blockId: block.id, port },
        });
        document.body.style.cursor = 'pointer';
    }
    handlePortMouseLeave = (event: any, block: BlockCircuitObject, port: PortLocationInfo) => {
        this.setState({
            hoveringPortInfo: undefined,
        });
        document.body.style.cursor = 'default';
    }
    handleObjectClick = (event: any, object: CircuitObject) => {
        this.setState({
            selectedObject: object,
        });
        this.clickHandled = true;
    }
    handlePropertyChange = (event: any, object: CircuitObject, propName: string, propValue: any) => {
        function mapper<T extends AnyCircuitObject>(o: T): T {
            return o.id !== object.id ? o
                : { ...o as any, [propName]: propValue };
        }
        const newBlocks = this.state.blocks.map(mapper);
        this.setState({
            blocks: newBlocks,
            wires: this.state.wires.map(mapper),
            selectedObject: this.state.selectedObject && mapper(this.state.selectedObject),
            blockById: newBlocks.reduce((acc, b) => (acc[b.id] = b) && acc, {}),
        });
    }
    handleBpmChange = (event: any) => {
        this.setState({
            config: {
                ...this.state.config,
                bpm: parseInt(event.target.value, 10),
            }
        });
    }
    handlePlay = () => {
        this.setState({
            blocksBeforeSimulation: this.state.blockById,
            simulationState: 'started',
        }, () => {
            this.circuit.start();
        });

    }
    handlePause = () => {
        this.setState({
            simulationState: 'paused',
        }, () => {
            this.circuit.stop();
        });
    }
    handleStop = () => {
        this.resetCircuit();
        this.invalidateCircuit();
        const blocks = this.state.blocks.map(block => {
            let bbs = this.state.blocksBeforeSimulation[block.id];
            if (bbs) {
                bbs = Object.assign({}, bbs);
                delete bbs.x;
                delete bbs.y;
                delete bbs.ports;
                return Object.assign({}, block, bbs);
            } else {
                return block;
            }
        });
        this.setState({
            wires: this.state.wires.map(w => ({ ...w, gate: false })),
            blocks,
            blockById: blocks.reduce((acc, b) => (acc[b.id] = b) && acc, {}),
            simulationState: 'stopped',
        });
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
    handleCircuitSelect = (event: any) => {
        const circuitName = event.target.value;
        const rawCircuitData = localStorage.getItem(circuitName);
        const circuitData = rawCircuitData && JSON.parse(rawCircuitData);
        if (circuitData) {
            this.resetCircuit();
            this.setState({
                circuitName,
                selectedObject: undefined,
                blocks: circuitData.blocks,
                wires: circuitData.wires,
                idCounter: circuitData.idCounter,
                blockById: circuitData.blocks.reduce(
                    (acc: { [id: number]: BlockCircuitObject }, block: BlockCircuitObject) =>
                        (acc[block.id] = block) && acc,
                    {}
                ),
                simulationState: 'stopped',
            });
        }
    }
    handleCircuitNameChange = (event: any) => {
        this.setState({ circuitName: event.target.value });
    }
    handleMidiOutputChange = (event: any) => {
        this.setState({ midiOutput: this.midiManager.midiOutputs[event.target.value] });
    }
    renderBlock = (block: BlockCircuitObject) => {
        const blockDescriptor = blockDescriptors[block.name];
        return (
            <blockDescriptor.component
                {...block}
                key={`block_${block.id}`}
                theme={this.state.theme}
                isSelected={this.state.selectedObject
                    ? block.id === this.state.selectedObject.id
                    : false
                }
                hoveringPort={
                    (
                        this.state.hoveringPortInfo &&
                        block.id === this.state.hoveringPortInfo.blockId
                    )
                        ? this.state.hoveringPortInfo.port
                        : undefined
                }
                onDragMove={this.handleBlockDrag}
                onMouseEnter={this.handleBlockMouseEnter}
                onMouseLeave={this.handleBlockMouseLeave}
                onClick={this.handleObjectClick}
            />
        );
    }
    renderWire = (wire: WireCircuitObject) => {
        const spi = wire.startPortInfo;
        const epi = wire.endPortInfo;
        const startPosition = wire.startPosition || shapeCenter(spi.port, this.state.blockById[spi.blockId]);
        const endPosition = wire.endPosition || epi && shapeCenter(epi.port, this.state.blockById[epi.blockId]);
        return (
            <Wire
                {...wire}
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
    renderProps = (object: any) => {
        return (
            <Properties
                {...(object || {}) }
                onPropertyChange={this.handlePropertyChange}
                onPropertyClick={propagationStopper}
            />
        );
    }
    renderHoverZones = () => {
        return this.state.blocks.map(block =>
            <BlockHoverZone
                {...block}
                key={`hover_zones_${block.id}`}
                x={block.x}
                y={block.y}
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
                        {objectValues(blockDescriptors).map(blockDescriptor =>
                            <BlockButton
                                {...blockDescriptor}
                                key={blockDescriptor.name}
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
                                    value={this.state.config.bpm.toString()}
                                    variants={['120', '125', '128', '130', '140', '170', '175']}
                                    spellCheck={false}
                                    onValueSelect={this.handleBpmChange}
                                    onTextChange={this.handleBpmChange}
                                />
                            </div>
                            <div className="row">
                                <IconButton
                                    className="fa fa-play-circle-o"
                                    enabled={this.state.simulationState !== 'started'}
                                    onClick={this.handlePlay}
                                />
                                <IconButton
                                    className="fa fa-pause-circle-o"
                                    enabled={this.state.simulationState === 'started'}
                                    onClick={this.handlePause}
                                />
                                <IconButton
                                    className="fa fa-stop-circle-o"
                                    enabled={this.state.simulationState !== 'stopped'}
                                    onClick={this.handleStop}
                                />
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
                                    spellCheck={false}
                                    onValueSelect={this.handleCircuitSelect}
                                    onTextChange={this.handleCircuitNameChange}
                                />
                                <IconButton
                                    className="save fa fa-save"
                                    enabled={this.state.simulationState === 'stopped'}
                                    onClick={this.handleCircuitSave}
                                />
                            </div>
                            <div className="row">
                                <span className="label">
                                    Midi to:
                                </span>
                                <Dropdown
                                    className="entry"
                                    value={this.state.midiOutput.name}
                                    variants={this.state.midiOutputs}
                                    spellCheck={false}
                                    onValueSelect={this.handleMidiOutputChange}
                                />
                                <IconButton
                                    className="refresh fa fa-refresh"
                                    enabled={true}
                                    onClick={() => console.log('hi')}
                                />
                            </div>
                        </div>
                    </div>
                    {this.renderProps(this.state.selectedObject)}
                    <Stage
                        ref="viewport"
                        x={this.state.viewportOffset.x}
                        y={this.state.viewportOffset.y}
                        width={952}
                        height={600}
                        draggable={!this.state.hoveringPortInfo}
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
                            wireframeCellSize={this.props.wireframeCellSize}
                        />
                        <Layer>
                            {this.state.blocks.map(this.renderBlock)}
                            {this.state.newBlock && this.renderBlock(this.state.newBlock)}
                            {this.state.wires.map(this.renderWire)}
                            {this.state.newWire && this.renderWire(this.state.newWire)}
                            {this.renderHoverZones()}
                        </Layer>
                    </Stage>
                </div>
            </div>
        );
    }
}