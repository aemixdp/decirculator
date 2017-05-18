import React from 'react';
import ReactDOM from 'react-dom';
import { Stage, Layer, Group, Rect, Circle, Line, Text } from 'react-konva';
import './index.css';

const nop = () => { };

const config = {
    wireframeCellSize: 18,
};

const Side = {
    Top: { x: 0, y: -1, toString: () => 'Top' },
    Right: { x: 1, y: 0, toString: () => 'Right' },
    Bottom: { x: 0, y: 1, toString: () => 'Bottom' },
    Left: { x: -1, y: 0, toString: () => 'Left' },
};

class Port extends React.Component {
    static LocationInfo = {
        [Side.Right]: { x: 48, y: 23, width: 4, height: 6, side: Side.Right },
        [Side.Left]: { x: -2, y: 23, width: 4, height: 6, side: Side.Left },
        [Side.Top]: { x: 23, y: -2, width: 6, height: 4, side: Side.Top },
        [Side.Bottom]: { x: 23, y: 48, width: 6, height: 4, side: Side.Bottom },
    }
    static centerPoint = (portInfo) => {
        const pli = portInfo && Port.LocationInfo[portInfo.side];
        return {
            x: portInfo.block.x + pli.x + pli.width / 2,
            y: portInfo.block.y + pli.y + pli.height / 2,
        };
    }
    static defaultProps = {
        onClick: nop,
        onMouseEnter: nop,
        onMouseLeave: nop,
    }
    handleClick = (e) => {
        this.props.onClick(e, this.props.side);
    }
    handleMouseEnter = (e) => {
        this.props.onMouseEnter(e, this.props.side);
    }
    handleMouseLeave = (e) => {
        this.props.onMouseLeave(e, this.props.side);
    }
    render() {
        const cx = this.props.x + this.props.width / 2;
        const cy = this.props.y + this.props.height / 2;
        return (
            <Group>
                <Rect
                    x={this.props.x}
                    y={this.props.y}
                    width={this.props.width}
                    height={this.props.height}
                    fill={this.props.direction === 'in' ? 'red' : 'green'}
                />
                {this.props.isHovering &&
                    <Line
                        points={[cx, cy, cx + this.props.side.x * 6, cy + this.props.side.y * 6]}
                        strokeWidth={1}
                        stroke="black"
                    />
                }
                <Circle
                    x={cx}
                    y={cy}
                    radius={10}
                    onClick={this.handleClick}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                />
            </Group>
        );
    };
}

class Wire extends React.Component {
    static defaultProps = {
        onClick: nop,
    }
    handleClick = (e) => {
        this.props.onClick(e, this.props);
    }
    render() {
        const points = [
            this.props.startPosition.x,
            this.props.startPosition.y,
            this.props.endPosition.x,
            this.props.endPosition.y,
        ];
        return (
            <Group>
                <Line
                    points={points}
                    strokeWidth={1}
                    stroke={this.props.isSelected ? 'orange' : 'purple'}
                />
                <Line
                    points={points}
                    strokeWidth={8}
                    stroke="transparent"
                    onClick={this.handleClick}
                />
            </Group>
        );
    }
}

class Block extends React.Component {
    static DefaultPorts = {
        [Side.Top]: 'in',
        [Side.Right]: 'in',
        [Side.Bottom]: 'in',
        [Side.Left]: 'in',
    };
    static defaultProps = {
        onPortMouseEnter: nop,
        onPortMouseLeave: nop,
        onPortClick: nop,
        onDragStart: nop,
        onDragEnd: nop,
        onDragMove: nop,
        onClick: nop,
    }
    constructor() {
        super();
        this.state = {
            hoveringPortSide: null,
        };
    }
    handlePortMouseEnter = (e, side) => {
        this.setState({ hoveringPortSide: side });
        this.props.onPortMouseEnter(e, this.props, side);
    }
    handlePortMouseLeave = (e, side) => {
        this.setState({ hoveringPortSide: null });
        this.props.onPortMouseLeave(e, this.props, side);
    }
    handlePortClick = (e, side) => {
        this.props.onPortClick(e, this.props, side);
    }
    handleDragStart = (e) => {
        this.props.onDragStart(e, this.props);
    }
    handleDragEnd = (e) => {
        this.props.onDragEnd(e, this.props);
    }
    handleDragMove = (e) => {
        this.props.onDragMove(e, this.props);
    }
    handleClick = (e) => {
        this.props.onClick(e, this.props);
    }
    render() {
        return (
            <Group
                x={this.props.x}
                y={this.props.y}
                draggable={this.state.hoveringPortSide === null}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
                onDragMove={this.handleDragMove}
                onClick={this.handleClick}
            >
                <Group
                    onMouseEnter={this.props.onMouseEnter}
                    onMouseLeave={this.props.onMouseLeave}
                >
                    <Rect
                        width={50}
                        height={50}
                        strokeWidth={4}
                        stroke={this.props.isSelected ? 'orange' : 'black'}
                    />
                    <Text
                        x={4} y={11}
                        fontSize={30}
                        text={this.props.label}
                    />
                    {this.props.children}
                </Group>
                {Object.values(Port.LocationInfo).map(pli =>
                    <Port {...pli}
                        key={pli.side}
                        direction={this.props.ports[pli.side]}
                        isHovering={pli.side === this.state.hoveringPortSide}
                        onClick={this.handlePortClick}
                        onMouseEnter={this.handlePortMouseEnter}
                        onMouseLeave={this.handlePortMouseLeave}
                    />
                )}
            </Group>
        );
    }
}

class BlockButton extends React.Component {
    static defaultProps = {
        onDragStart: nop,
        onDragEnd: nop,
        onDragMove: nop,
    }
    handleDragStart = (e) => {
        this.props.onDragStart(e, this.props);
    }
    handleDragEnd = (e) => {
        this.props.onDragEnd(e, this.props);
    }
    handleDragMove = (e) => {
        this.props.onDragMove(e, this.props);
    }
    render() {
        return (
            <div className="vbox block-type-button">
                <Stage width={54} height={54}>
                    <Layer>
                        <this.props.component
                            ports={Block.DefaultPorts}
                            x={2}
                            y={2}
                            draggable="true"
                            onDragStart={this.handleDragStart}
                            onDragEnd={this.handleDragEnd}
                            onDragMove={this.handleDragMove}
                        />
                    </Layer>
                </Stage>
                <div>{this.props.label}</div>
            </div>
        );
    }
}

class Props extends React.Component {
    static defaultProps = {
        onPropertyChange: nop,
    }
    static ExcludedProps = {
        id: true,
        kind: true,
        blockType: true,
        x: true,
        y: true,
        ports: true,
        startPosition: true,
        startPortInfo: true,
        endPosition: true,
        endPortInfo: true,
        label: true,
        active: true,
        isSelected: true,
        children: true,
    }
    handlePropertyChange = (e) => {
        this.props.onPropertyChange(e,
            this.props,
            e.target.dataset.prop,
            e.target[e.target.dataset.value || 'value']
        );
    }
    render() {
        console.log(this.props);
        const filteredProps = Object.entries(this.props)
            .filter(([key, value]) =>
                key.indexOf('on') !== 0 &&
                !Props.ExcludedProps[key]
            );
        return (
            <div className="hbox">
                <input type="checkbox"
                    data-prop="active"
                    data-value="checked"
                    checked={this.props.active}
                    onChange={this.handlePropertyChange}
                />
                {this.props.kind === 'block' ? this.props.blockType.name : 'wire'}
                {filteredProps.map(([key, value]) =>
                    <div>
                        <span>{key}=</span>
                        <input data-prop={key}
                            value={value}
                            onChange={this.handlePropertyChange}
                        />
                    </div>
                )}
            </div>
        );
    }
}

const BLOCKS = [
    {
        name: 'start',
        label: 'Start',
        component: (props) =>
            <Block label="S" {...props} />,
        renderProps: (props) =>
            <div />
    },
    {
        name: 'pulse-relative',
        label: 'Pulse (rel)',
        component: (props) =>
            <Block label="P" {...props}>
                <Text key={1} text="1" x={25} y={11} />
                <Text key={2} text="4" x={25} y={27} />
            </Block>,
        renderProps: (props) =>
            <div />
    },
    {
        name: 'pulse-absolute',
        label: 'Pulse (abs)',
        component: (props) =>
            <Block label="P" {...props}>
                <Text key={1} text="ms" x={27} y={11} />
                <Text key={2} text="100" x={25} y={27} />
            </Block>,
        renderProps: (props) =>
            <div />
    },
    {
        name: 'delay-relative',
        label: 'Delay (rel)',
        component: (props) =>
            <Block label="D" {...props}>
                <Text key={1} text="1" x={25} y={11} />
                <Text key={2} text="4" x={25} y={27} />
            </Block>,
        renderProps: (props) =>
            <div />
    },
    {
        name: 'delay-absolute',
        label: 'Delay (abs)',
        component: (props) =>
            <Block label="D" {...props}>
                <Text key={1} text="ms" x={27} y={11} />
                <Text key={2} text="100" x={25} y={27} />
            </Block>,
        renderProps: (props) =>
            <div />
    },
    {
        name: 'midi-out',
        label: 'Midi out',
        component: (props) =>
            <Block label="M" {...props}>
                <Text key={1} text="1" x={28} y={11} />
                <Text key={2} text="64" x={28} y={27} />
            </Block>,
        renderProps: (props) =>
            <div />
    },
];

const Wireframe = (props) => {
    const c = config.wireframeCellSize;
    return (
        <Layer {...props}>
            {Array.from({ length: Math.floor(970 / c) }, (_, n) =>
                <Line key={+n} stroke="gray" strokeWidth={0.1} points={[c * n - 1, 0, c * n - 1, 600]} />)}
            {Array.from({ length: Math.floor(610 / c) }, (_, n) =>
                <Line key={-n} stroke="gray" strokeWidth={0.1} points={[0, c * n - 1, 960, c * n - 1]} />)}
        </Layer>
    );
}

const snapToWireframe = (props) => ({
    ...props,
    x: props.x - props.x % config.wireframeCellSize,
    y: props.y - props.y % config.wireframeCellSize,
})

class App extends React.Component {
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
                snapToWireframe({
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
                viewportOffset: snapToWireframe({ x, y }),
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
                    BLOCKS.map(blockType =>
                        <BlockButton {...blockType}
                            key={blockType.label}
                            onDragStart={this.handleNewBlockDragStart}
                            onDragEnd={this.handleNewBlockDragEnd}
                            onDragMove={this.handleBlockDrag}
                        />
                    )
                }
                </div>
                <div>{this.renderProps(this.state.selectedObject)}</div>
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

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
