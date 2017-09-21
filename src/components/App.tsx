import React from 'react';
import ReactKonva, { Rect } from 'react-konva';
import { ActionCreators as reduxUndoActions } from 'redux-undo';
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
import { shapeCenter, normalizeRectangle } from '../utils/geometryUtils';
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
import { SimulationState } from '../reducers/simulationStateReducer';
import { IdMap } from '../data/IdMap';

const { Stage, Layer }: any = ReactKonva;

type Props = {
    dispatch: Dispatch<AnyAction>;
    theme: any;
    viewportOffset: Point;
    selectedObjectIds: Set<number>;
    newBlock?: BlockCircuitObject;
    newWire?: WireCircuitObject;
    hoveringPortInfo?: PortInfo;
    isHoveringPort: boolean;
    blocks: BlockCircuitObject[];
    wires: WireCircuitObject[];
    circuitName: string;
    blockById: IdMap<BlockCircuitObject>;
    bpm: number;
    simulationState: SimulationState;
    circuits: string[];
    midiOutputName: string;
    midiOutputs: string[];
    pivotPosition: Point;
};

type State = {
    selectionStart?: Point,
    selectionEnd?: Point,
    isCtrlPressed: boolean,
    isHoveringBlock: boolean,
    isDraggingBlocks: boolean,
    isDraggingViewport: boolean,
    pivotBlockId?: number,
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
        this.state = {
            isCtrlPressed: false,
            isHoveringBlock: false,
            isDraggingBlocks: false,
            isDraggingViewport: false,
        };
    }
    componentWillMount() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }
    componentDidMount() {
        this.refs.viewport.domNode.addEventListener('click', propagationStopper);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
    handleKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode === 46 /* delete */) {
            if (this.props.selectedObjectIds.size > 0) {
                this.props.dispatch(circuitObjectsActions.deleteObjects(this.props.selectedObjectIds));
            }
        } else if (e.keyCode === 27 /* esc */) {
            this.props.dispatch(uiActions.deselectObjects());
        } else if (e.keyCode === 90 && e.ctrlKey /* ctrl-z */) {
            this.props.dispatch(reduxUndoActions.undo());
            if (this.props.newWire) {
                this.props.dispatch(uiActions.cancelDrawingWire());
            }
            if (this.props.isHoveringPort) {
                this.props.dispatch(uiActions.unhoverPort());
            }
        } else if (e.keyCode === 89 && e.ctrlKey /* ctrl-y */) {
            this.props.dispatch(reduxUndoActions.redo());
        } else if (e.keyCode === 67 && e.ctrlKey /* ctrl-c */) {
            this.props.dispatch(circuitObjectsActions.copyObjects(this.props.selectedObjectIds));
        } else if (e.keyCode === 86 && e.ctrlKey /* ctrl-v */) {
            this.props.dispatch(circuitObjectsActions.pasteObjects(this.props.pivotPosition));
        }
        if (e.ctrlKey) {
            this.setState({ isCtrlPressed: true });
        }
    }
    handleKeyUp = (e: KeyboardEvent) => {
        if (!e.ctrlKey) {
            this.setState({
                isCtrlPressed: false,
                isDraggingViewport: false,
            });
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
    handleBlockMouseEnter = (event: any, block: BlockCircuitObject) => {
        if (this.state.isDraggingBlocks) return;
        document.body.style.cursor = 'move';
        this.setState({
            isHoveringBlock: true,
            pivotBlockId: block.id,
        });
    }
    handleBlockMouseLeave = () => {
        if (this.state.isDraggingBlocks) return;
        document.body.style.cursor = 'default';
        this.setState({ isHoveringBlock: false });
    }
    handleViewportDrag = (event: any) => {
        if (this.state.isDraggingViewport && event.target.nodeType === 'Stage') {
            const { x, y } = event.target.attrs;
            this.props.dispatch(uiActions.dragViewport(
                snapToWireframe(wireframeCellSize, { x, y })
            ));
        }
    }
    handleViewportMouseDown = (event: any) => {
        if (this.props.isHoveringPort) {
            this.props.dispatch(uiActions.drawWire());
        } else if (this.state.isCtrlPressed) {
            this.setState({ isDraggingViewport: true });
        } else if (this.state.isHoveringBlock) {
            this.setState({ isDraggingBlocks: true });
        } else {
            this.setState({
                selectionStart: {
                    x: event.evt.offsetX - this.props.viewportOffset.x,
                    y: event.evt.offsetY - this.props.viewportOffset.y,
                }
            });
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
        } else if (this.state.selectionStart) {
            this.setState({
                selectionStart: undefined,
                selectionEnd: undefined,
            });
        } else if (this.state.isDraggingViewport) {
            this.setState({ isDraggingViewport: false });
        } else if (this.state.isDraggingBlocks) {
            this.setState({ isDraggingBlocks: false });
        }
        this.props.dispatch(uiActions.placePivot({
            x: event.evt.offsetX - this.props.viewportOffset.x,
            y: event.evt.offsetY - this.props.viewportOffset.y,
        }));
    }
    handleViewportMouseMove = (event: any) => {
        if (this.props.newWire) {
            this.props.dispatch(uiActions.drawWire({
                x: event.evt.offsetX - this.props.viewportOffset.x,
                y: event.evt.offsetY - this.props.viewportOffset.y,
            }));
        } else if (this.state.isDraggingBlocks && this.state.pivotBlockId !== undefined) {
            const block = this.props.blockById[this.state.pivotBlockId];
            if (!this.props.selectedObjectIds.has(block.id)) {
                this.props.dispatch(uiActions.selectObjects(new Set([block.id])));
            }
            this.props.dispatch(uiActions.dragBlocks(this.props.selectedObjectIds,
                snapToWireframe(wireframeCellSize, {
                    x: event.evt.offsetX - this.props.viewportOffset.x - 25 - block.x,
                    y: event.evt.offsetY - this.props.viewportOffset.y - 25 - block.y,
                })
            ));
        } else if (this.state.selectionStart) {
            const selectionEnd = {
                x: event.evt.offsetX - this.props.viewportOffset.x,
                y: event.evt.offsetY - this.props.viewportOffset.y,
            };
            this.setState({ selectionEnd });
            const selectionArea = normalizeRectangle(this.state.selectionStart, selectionEnd);
            const blocksInsideSelectionArea: Set<number> = new Set();
            for (const block of this.props.blocks) {
                if (
                    block.x > selectionArea.start.x && block.x < selectionArea.end.x &&
                    block.y > selectionArea.start.y && block.y < selectionArea.end.y
                ) {
                    blocksInsideSelectionArea.add(block.id);
                }
            }
            if (this.props.selectedObjectIds.size !== blocksInsideSelectionArea.size) {
                this.props.dispatch(uiActions.selectObjects(blocksInsideSelectionArea));
            }
            this.clickHandled = true;
        }
    }
    handleViewportClick = (event: any) => {
        if (!this.clickHandled && this.props.selectedObjectIds.size > 0) {
            this.props.dispatch(uiActions.deselectObjects());
        }
        this.clickHandled = false;
    }
    handleOuterClick = () => {
        if (this.props.selectedObjectIds.size > 0) {
            this.props.dispatch(uiActions.deselectObjects());
        }
    }
    handlePortClick = (event: any, block: BlockCircuitObject, port: PortLocationInfo) => {
        this.props.dispatch(circuitObjectsActions.togglePort(block.id, port.side));
        this.clickHandled = true;
    }
    handlePortMouseEnter = (event: any, block: BlockCircuitObject, port: PortLocationInfo) => {
        if (this.state.isDraggingBlocks) return;
        this.props.dispatch(uiActions.hoverPort({ blockId: block.id, port }));
        document.body.style.cursor = 'pointer';
    }
    handlePortMouseLeave = (event: any, block: BlockCircuitObject, port: PortLocationInfo) => {
        if (this.state.isDraggingBlocks) return;
        this.props.dispatch(uiActions.unhoverPort());
        document.body.style.cursor = 'default';
    }
    handleObjectClick = (event: any, object: CircuitObject) => {
        this.props.dispatch(uiActions.selectObjects(new Set([object.id])));
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
                isSelected={this.props.selectedObjectIds.has(block.id)}
                hoveringPort={
                    (
                        this.props.hoveringPortInfo &&
                        block.id === this.props.hoveringPortInfo.blockId
                    )
                        ? this.props.hoveringPortInfo.port
                        : undefined
                }
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
                isSelected={this.props.selectedObjectIds.has(wire.id)}
                onClick={this.handleObjectClick}
            />
        );
    }
    renderProps = () => {
        const object: any = this.props.selectedObjectIds.size === 1 &&
            this.props.blockById[this.props.selectedObjectIds.values().next().value];
        return (
            <Properties
                {...object || {}}
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
    renderSelectionRectangle = () => {
        if (this.state.selectionStart && this.state.selectionEnd) {
            const selectionArea = normalizeRectangle(this.state.selectionStart, this.state.selectionEnd);
            return (
                <Rect
                    x={selectionArea.start.x}
                    y={selectionArea.start.y}
                    width={selectionArea.end.x - selectionArea.start.x}
                    height={selectionArea.end.y - selectionArea.start.y}
                    stroke={this.props.theme.selectionColor}
                />
            );
        } else {
            return null;
        }
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
                    {this.renderProps()}
                    <Stage
                        ref="viewport"
                        x={this.props.viewportOffset.x}
                        y={this.props.viewportOffset.y}
                        width={952}
                        height={600}
                        draggable={this.state.isDraggingViewport}
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
                            {this.renderSelectionRectangle()}
                        </Layer>
                    </Stage>
                </div>
            </div>
        );
    }
}