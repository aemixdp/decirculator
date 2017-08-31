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
import { Circuit } from '../circuitry/Circuit';
import { shapeCenter } from '../utils/geometryUtils';
import { objectValues } from '../utils/objectUtils';
import { CircuitObject } from '../data/CircuitObject';
import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { Point } from '../data/Point';
import { BlockDescriptor } from '../data/BlockDescriptor';
import blockDescriptors from '../circuitry/blocks';
import { PortLocationInfo } from '../data/PortLocationInfo';
import { Dispatch, AnyAction } from 'redux';
import * as circuitObjectsActions from '../actions/CircuitObjectsAction';
import * as uiActions from '../actions/UiAction';
import * as globalActions from '../actions/GlobalAction';
import { wireframeCellSize } from '../config';
import { PortInfo } from '../data/PortInfo';
import * as configActions from '../actions/ConfigAction';
import * as simulationActions from '../actions/SimulationAction';
import { SimulationState } from '../reducers/simulationState';

const { Stage, Layer }: any = ReactKonva;

type Props = {
    dispatch: Dispatch<AnyAction>;
    theme: any;
    viewportOffset: Point;
    selectedObject?: CircuitObject;
    newBlock?: BlockCircuitObject;
    newWire?: WireCircuitObject;
    hoveringPortInfo?: PortInfo;
    isHoveringPort: boolean;
    blocks: BlockCircuitObject[];
    wires: WireCircuitObject[];
    circuitName: string;
    blockById: { [id: number]: BlockCircuitObject };
    bpm: number;
    simulationState: SimulationState;
    circuits: string[];
    midiOutputName: string;
    midiOutputs: string[];
};

export class App extends React.Component<Props, {}> {
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
    handleCircuitVisibleChanges = () => {
        const newBlocks = this.props.blocks.map(b =>
            (this.circuit.changed[b.id] && b.name === 'Counter')
                ? { ...b, current: this.circuit.counterValue[b.id] }
                : b
        );
        this.setState({
            blocks: newBlocks,
            wires: this.props.wires.map(w =>
                this.circuit.changed[w.id]
                    ? { ...w, gate: this.circuit.gate[w.id] }
                    : w
            ),
            blockById: newBlocks.reduce((acc, b) => (acc[b.id] = b) && acc, {}),
        });
    }
    handleMidiOut = (toggleState: boolean, channel: number, note: number, velocity: number) => {
        if (this.props.midiOutputName) {
            this.midiManager.note(this.props.midiOutputName, toggleState, channel, note, velocity);
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
            if (this.props.selectedObject) {
                this.props.dispatch(circuitObjectsActions.deleteObject(this.props.selectedObject.id));
            }
        } else if (e.keyCode === 27 /* esc */) {
            this.props.dispatch(uiActions.deselectObject());
        }
    }
    handleNewBlockDragStart = (e: Event, blockDescriptor: BlockDescriptor<any>) => {
        this.props.dispatch(uiActions.drawBlock(blockDescriptor));
    }
    handleNewBlockDragEnd = (event: any) => {
        if (
            this.props.newBlock &&
            this.refs.viewport.domNode.contains(event.evt.toElement)
        ) {
            this.props.dispatch(circuitObjectsActions.createBlock(this.props.newBlock));
        }
    }
    handleBlockMouseEnter = () => {
        document.body.style.cursor = 'move';
    }
    handleBlockMouseLeave = () => {
        document.body.style.cursor = 'default';
    }
    handleBlockDrag = (event: any, block: any) => {
        if (this.refs.viewport.domNode.contains(event.evt.toElement)) {
            this.props.dispatch(uiActions.dragBlock(block.id,
                snapToWireframe(wireframeCellSize, {
                    x: event.evt.offsetX - this.props.viewportOffset.x - 25,
                    y: event.evt.offsetY - this.props.viewportOffset.y - 25,
                })
            ));
        }
    }
    handleViewportDrag = (event: any) => {
        if (event.target.nodeType === 'Stage') {
            const { x, y } = event.target.attrs;
            this.props.dispatch(uiActions.dragViewport(
                snapToWireframe(wireframeCellSize, { x, y })
            ));
        }
    }
    handleViewportMouseDown = (e: Event) => {
        if (this.props.isHoveringPort) {
            this.props.dispatch(uiActions.drawWire());
        }
    }
    handleViewportMouseUp = (event: any) => {
        const newWire = this.props.newWire;
        if (newWire) {
            if (newWire.endPortInfo &&
                newWire.endPortInfo.blockId !== newWire.startPortInfo.blockId
            ) {
                this.props.dispatch(circuitObjectsActions.createWire(newWire));
            } else {
                this.props.dispatch(uiActions.cancelDrawingWire());
            }
        }
    }
    handleViewportMouseMove = (event: any) => {
        if (this.props.newWire) {
            this.props.dispatch(uiActions.drawWire({
                x: event.evt.offsetX - this.props.viewportOffset.x,
                y: event.evt.offsetY - this.props.viewportOffset.y,
            }));
        }
    }
    handleViewportClick = (event: any) => {
        if (!this.clickHandled && this.props.selectedObject) {
            this.props.dispatch(uiActions.deselectObject());
        }
        this.clickHandled = false;
    }
    handleOuterClick = () => {
        if (this.props.selectedObject) {
            this.props.dispatch(uiActions.deselectObject());
        }
    }
    handlePortClick = (event: any, block: BlockCircuitObject, port: PortLocationInfo) => {
        this.props.dispatch(circuitObjectsActions.togglePort(block.id, port.side));
        this.clickHandled = true;
    }
    handlePortMouseEnter = (event: any, block: BlockCircuitObject, port: PortLocationInfo) => {
        this.props.dispatch(uiActions.hoverPort({ blockId: block.id, port }));
        document.body.style.cursor = 'pointer';
    }
    handlePortMouseLeave = (event: any, block: BlockCircuitObject, port: PortLocationInfo) => {
        this.props.dispatch(uiActions.unhoverPort());
        document.body.style.cursor = 'default';
    }
    handleObjectClick = (event: any, object: CircuitObject) => {
        this.props.dispatch(uiActions.selectObject(object));
        this.clickHandled = true;
    }
    handlePropertyChange = (event: any, object: CircuitObject, propName: string, propValue: any) => {
        this.props.dispatch(circuitObjectsActions.editObject(object.id, propName, propValue));
    }
    handleBpmChange = (event: any) => {
        this.props.dispatch(configActions.setBpm(parseInt(event.target.value, 10)));
    }
    handlePlay = () => {
        this.props.dispatch(simulationActions.start);
    }
    handlePause = () => {
        this.props.dispatch(simulationActions.pause);
    }
    handleStop = () => {
        this.props.dispatch(simulationActions.stop);
    }
    handleCircuitSave = () => {
        this.props.dispatch(globalActions.save(this.props.circuitName));
    }
    handleCircuitSelect = (event: any) => {
        this.props.dispatch(globalActions.load(event.target.value));
    }
    handleCircuitNameChange = (event: any) => {
        this.props.dispatch(configActions.setCircuitName(event.target.value));
    }
    handleMidiOutputChange = (event: any) => {
        this.props.dispatch(configActions.setMidiOutput(event.target.value));
    }
    renderBlock = (block: BlockCircuitObject) => {
        const blockDescriptor = blockDescriptors[block.name];
        return (
            <blockDescriptor.component
                {...block}
                key={`block_${block.id}`}
                theme={this.props.theme}
                isSelected={this.props.selectedObject
                    ? block.id === this.props.selectedObject.id
                    : false
                }
                hoveringPort={
                    (
                        this.props.hoveringPortInfo &&
                        block.id === this.props.hoveringPortInfo.blockId
                    )
                        ? this.props.hoveringPortInfo.port
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
        const startPosition = wire.startPosition || shapeCenter(spi.port, this.props.blockById[spi.blockId]);
        const endPosition = wire.endPosition || epi && shapeCenter(epi.port, this.props.blockById[epi.blockId]);
        return (
            <Wire
                {...wire}
                key={`wire_${wire.id}`}
                startPosition={startPosition}
                endPosition={endPosition}
                theme={this.props.theme}
                isSelected={this.props.selectedObject &&
                    wire.id === this.props.selectedObject.id}
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
        return this.props.blocks.map(block =>
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
                                theme={this.props.theme}
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
                                    value={this.props.bpm.toString()}
                                    variants={['120', '125', '128', '130', '140', '170', '175']}
                                    spellCheck={false}
                                    onValueSelect={this.handleBpmChange}
                                    onTextChange={this.handleBpmChange}
                                />
                            </div>
                            <div className="row">
                                <IconButton
                                    className="fa fa-play-circle-o"
                                    enabled={this.props.simulationState !== 'STARTED'}
                                    onClick={this.handlePlay}
                                />
                                <IconButton
                                    className="fa fa-pause-circle-o"
                                    enabled={this.props.simulationState === 'STARTED'}
                                    onClick={this.handlePause}
                                />
                                <IconButton
                                    className="fa fa-stop-circle-o"
                                    enabled={this.props.simulationState !== 'STOPPED'}
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
                                    value={this.props.circuitName}
                                    variants={this.props.circuits}
                                    spellCheck={false}
                                    onValueSelect={this.handleCircuitSelect}
                                    onTextChange={this.handleCircuitNameChange}
                                />
                                <IconButton
                                    className="save fa fa-save"
                                    enabled={this.props.simulationState === 'STOPPED'}
                                    onClick={this.handleCircuitSave}
                                />
                            </div>
                            <div className="row">
                                <span className="label">
                                    Midi to:
                                </span>
                                <Dropdown
                                    className="entry"
                                    value={this.props.midiOutputName}
                                    variants={this.props.midiOutputs}
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
                    {this.renderProps(this.props.selectedObject)}
                    <Stage
                        ref="viewport"
                        x={this.props.viewportOffset.x}
                        y={this.props.viewportOffset.y}
                        width={952}
                        height={600}
                        draggable={!this.props.hoveringPortInfo}
                        onDragMove={this.handleViewportDrag}
                        onContentMouseDown={this.handleViewportMouseDown}
                        onContentMouseUp={this.handleViewportMouseUp}
                        onContentMouseMove={this.handleViewportMouseMove}
                        onContentClick={this.handleViewportClick}
                    >
                        <Wireframe
                            theme={this.props.theme}
                            x={-this.props.viewportOffset.x}
                            y={-this.props.viewportOffset.y}
                            wireframeCellSize={wireframeCellSize}
                        />
                        <Layer>
                            {this.props.blocks.map(this.renderBlock)}
                            {this.props.newBlock && this.renderBlock(this.props.newBlock)}
                            {this.props.wires.map(this.renderWire)}
                            {this.props.newWire && this.renderWire(this.props.newWire)}
                            {this.renderHoverZones()}
                        </Layer>
                    </Stage>
                </div>
            </div>
        );
    }
}