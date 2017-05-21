import React from 'react';
import { Group, Line } from 'react-konva';

export default class Wire extends React.Component {
    static defaultProps = {
        onClick: () => { },
    }
    handleClick = (e) => {
        this.props.onClick(e, this.props);
    }
    render() {
        const sp = this.props.startPosition;
        const sd = this.props.startPortInfo.port.side;
        const ep = this.props.endPosition;
        const ed = this.props.endPortInfo && this.props.endPortInfo.port.side;
        const points = [
            sp.x, sp.y,
            sp.x + sd.x * 10, sp.y + sd.y * 10,
            ...(ed ? [ep.x + ed.x * 10, ep.y + ed.y * 10] : []),
            ep.x, ep.y,
        ];
        return (
            <Group>
                <Line
                    points={points}
                    strokeWidth={1}
                    stroke={this.props.isSelected ? 'orange' : 'yellow'}
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