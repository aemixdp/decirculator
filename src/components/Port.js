import React from 'react';
import { Group, Rect, Circle, Line } from 'react-konva';
import Side from '../data/Side';

export default class Port extends React.Component {
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
        onClick: () => { },
        onMouseEnter: () => { },
        onMouseLeave: () => { },
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