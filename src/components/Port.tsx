import React from 'react';
import { Group, Rect, Line } from 'react-konva';
import { shapeCenter } from '../utils/geometryUtils';
import { PortLocationInfo } from '../data/PortLocationInfo';

type Props = PortLocationInfo & {
    theme: any;
    direction: 'in' | 'out';
    isHovering: boolean;
};

export class Port extends React.Component<Props, any> {
    render() {
        const c = shapeCenter(this.props);
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
    }
}
