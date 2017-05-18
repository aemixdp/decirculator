import React from 'react';
import { Stage, Layer } from 'react-konva';
import Port from './Port';
import Wire from './Wire';
import Block from './Block';
import BlockButton from './BlockButton';
import Props from './Props';
import Wireframe from './Wireframe';
import blocks from '../data/blocks';

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            idCounter: 0,
            selectedObject: null,
            blocks: [],
            wires: [],
            newBlock: null,
            newWire: null,
            viewportOffset: { x: 0, y: 0 },
            hoveringPortInfo: null,
        };
    }
    componentWillMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    handleKeyDown = (e) => {
        if (e.keyCode === 46 /* delete */) {
            const id = this.state.selectedObject.id;
            this.setState({
                blocks: this.state.blocks.filter(b => b.id !== id),
                wires: this.state.wires.filter(w =>
                    w.id !== id &&
                    w.startPortInfo.block.id !== id &&
                    w.endPortInfo.block.id !== id
                ),
                selectedObject: null,
            });
        }
    }
    handleNewBlockDragStart = (e, blockType) => {
        this.setState({
            idCounter: this.state.idCounter + 1,
            newBlock: {
                id: this.state.idCounter,
                kind: 'block',
                active: true,
                gateLength: 50,
                blockType,
                x: -100,
                y: -100,
                ports: Block.DefaultPorts,
            },
        });
    }
    handleNewBlockDragEnd = (e) => {
        if (this.refs.viewport.domNode.contains(e.evt.toElement)) {
            this.setState({
                blocks: [...this.state.blocks, this.state.newBlock],
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
    handleBlockDrag = (e, block) => {
        if (this.refs.viewport.domNode.contains(e.evt.toElement)) {
            const transformBlock = (block) => block && Object.assign({}, block,
                Wireframe.snapToWireframe(this.props.config.wireframeCellSize, {
                    x: e.evt.offsetX - this.state.viewportOffset.x - 25,
                    y: e.evt.offsetY - this.state.viewportOffset.y - 25,
                })
            );
            const transformedBlock = transformBlock(block);
            this.setState({
                blocks: this.state.blocks.map(b =>
                    b.id === block.id ? transformedBlock : b),
                newBlock: transformBlock(this.state.newBlock),
                wires: this.state.wires.map(wire => {
                    const spi = wire.startPortInfo;
                    const epi = wire.endPortInfo;
                    if (spi.block.id === block.id) {
                        const transformedSpi = {
                            ...spi,
                            block: transformedBlock,
                        };
                        return {
                            ...wire,
                            startPortInfo: transformedSpi,
                            startPosition: Port.centerPoint(transformedSpi),
                        };
                    } else if (epi.block.id === block.id) {
                        const transformedEpi = {
                            ...epi,
                            block: transformedBlock,
                        };
                        return {
                            ...wire,
                            endPortInfo: transformedEpi,
                            endPosition: Port.centerPoint(transformedEpi),
                        };
                    } else {
                        return wire;
                    }
                }),
            });

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
            const startPosition = Port.centerPoint(hpi);
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
        if (
            this.state.newWire &&
            this.state.newWire.endPortInfo &&
            this.state.newWire.endPortInfo.block.id !== this.state.newWire.startPortInfo.block.id
        ) {
            this.setState({
                wires: [...this.state.wires, this.state.newWire],
            });
        }
        this.setState({
            newWire: null,
        });
    }
    handleViewportMouseMove = (e) => {
        if (this.state.newWire) {
            const w = this.state.newWire;
            const hpi = this.state.hoveringPortInfo;
            this.setState({
                newWire: {
                    ...w,
                    endPosition: hpi ? Port.centerPoint(hpi) : {
                        x: e.evt.offsetX - this.state.viewportOffset.x,
                        y: e.evt.offsetY - this.state.viewportOffset.y,
                    },
                    endPortInfo: hpi,
                },
            });
        }
    }
    handlePortClick = (e, block, side) => {
        this.setState({
            blocks: this.state.blocks.map(b =>
                b.id !== block.id ? b : {
                    ...b, ports: {
                        ...b.ports,
                        [side]: b.ports[side] === 'in' ? 'out' : 'in'
                    }
                }
            )
        });
    }
    handlePortMouseEnter = (e, block, side) => {
        this.setState({
            hoveringPortInfo: { block, side },
        });
        document.body.style.cursor = 'pointer';
    }
    handlePortMouseLeave = (e, side) => {
        this.setState({
            hoveringPortInfo: null,
        });
        document.body.style.cursor = 'default';
    }
    handleObjectClick = (e, object) => {
        this.setState({
            selectedObject: object,
        });
    }
    renderBlock = (block) => {
        return block &&
            <block.blockType.component {...block}
                key={`block_${block.id}`}
                isSelected={this.state.selectedObject &&
                    block.id === this.state.selectedObject.id}
                onDragMove={this.handleBlockDrag}
                onMouseEnter={this.handleBlockMouseEnter}
                onMouseLeave={this.handleBlockMouseLeave}
                onPortMouseEnter={this.handlePortMouseEnter}
                onPortMouseLeave={this.handlePortMouseLeave}
                onPortClick={this.handlePortClick}
                onClick={this.handleObjectClick}
            />;
    }
    renderWire = (wire) => {
        return wire &&
            <Wire {...wire}
                key={`wire_${wire.id}`}
                isSelected={this.state.selectedObject &&
                    wire.id === this.state.selectedObject.id}
                onClick={this.handleObjectClick}
            />;
    }
    renderProps = (object) => {
        return object &&
            <Props {...object} />;
    }
    render() {
        return (
            <div className="vbox">
                <header className="title">DECIRCULATOR</header>
                <div className="hbox">{
                    blocks.map(blockType =>
                        <BlockButton {...blockType}
                            key={blockType.label}
                            onDragStart={this.handleNewBlockDragStart}
                            onDragEnd={this.handleNewBlockDragEnd}
                            onDragMove={this.handleBlockDrag}
                        />
                    )
                }
                </div>
                {this.renderProps(this.state.selectedObject)}
                <Stage ref="viewport"
                    x={this.state.viewportOffset.x}
                    y={this.state.viewportOffset.y}
                    width={960}
                    height={600}
                    draggable={this.state.hoveringPortInfo === null}
                    onDragMove={this.handleViewportDrag}
                    onContentMouseDown={this.handleViewportMouseDown}
                    onContentMouseUp={this.handleViewportMouseUp}
                    onContentMouseMove={this.handleViewportMouseMove}
                >
                    <Wireframe
                        x={-this.state.viewportOffset.x}
                        y={-this.state.viewportOffset.y}
                        wireframeCellSize={this.props.config.wireframeCellSize}
                    />
                    <Layer>
                        {this.state.blocks.map(this.renderBlock)}
                        {this.renderBlock(this.state.newBlock)}
                        {this.state.wires.map(this.renderWire)}
                        {this.renderWire(this.state.newWire)}
                    </Layer>
                </Stage>
            </div>
        );
    }
}