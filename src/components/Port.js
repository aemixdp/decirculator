import React from 'react';
import { Group, Rect, Circle, Line } from 'react-konva';
import Side from '../data/Side';
import utils from '../utils';

export default class Port extends React.Component {
    static LocationInfo = {
        [Side.Right]: { x: 49, y: 23, width: 2, height: 6, side: Side.Right },
        [Side.Left]: { x: -1, y: 23, width: 2, height: 6, side: Side.Left },
        [Side.Top]: { x: 22, y: -1, width: 6, height: 2, side: Side.Top },
        [Side.Bottom]: { x: 22, y: 49, width: 6, height: 2, side: Side.Bottom },
    }
    static HoverZones = class extends React.Component {
        static defaultProps = {
            onClick: () => { },
            onMouseEnter: () => { },
            onMouseLeave: () => { },
        }
        handleClick = (e) => {
            this.props.onClick(e, this.props);
        }
        handleMouseEnter = (e) => {
            this.props.onMouseEnter(e, this.props);
        }
        handleMouseLeave = (e) => {
            this.props.onMouseLeave(e, this.props);
        }
        render() {
            const c = utils.geometry.center(this.props);
            return (
                <Circle
                    x={c.x}
                    y={c.y}
                    radius={10}
                    onClick={this.handleClick}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                />
            );
        }
    }
    render() {
        const c = utils.geometry.center(this.props);
        return (
            <Group>
                <Rect
                    x={this.props.x}
                    y={this.props.y}
                    width={this.props.width}
                    height={this.props.height}
                    fill={this.props.direction === 'in'
                        ? this.props.theme.inPortColor
                        : this.props.theme.outPortColor
                    }
                />
                {this.props.isHovering &&
                    <Line
                        points={[c.x, c.y, c.x + this.props.side.x * 6, c.y + this.props.side.y * 6]}
                        strokeWidth={1}
                        stroke="black"
                    />
                }
            </Group>
        );
    };
}