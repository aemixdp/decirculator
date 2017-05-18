import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import Side from '../data/Side';
import Port from './Port';

export default class extends React.Component {
    static DefaultPorts = {
        [Side.Top]: 'in',
        [Side.Right]: 'in',
        [Side.Bottom]: 'in',
        [Side.Left]: 'in',
    };
    static defaultProps = {
        onPortMouseEnter: () => { },
        onPortMouseLeave: () => { },
        onPortClick: () => { },
        onDragStart: () => { },
        onDragEnd: () => { },
        onDragMove: () => { },
        onClick: () => { },
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