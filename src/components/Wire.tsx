import React from 'react';
import { Group, Line } from 'react-konva';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { CircuitObjectVisuals } from '../data/CircuitObjectVisuals';

type EventListeners = {
    onClick: (event: Event, wire: WireCircuitObject) => void;
};

type Props = EventListeners & WireCircuitObject & CircuitObjectVisuals;

export class Wire extends React.Component<Props, any> {
    static defaultProps = {
        onClick: () => { },
    };
    handleClick = (e: Event) => {
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
                    stroke={
                        this.props.isSelected
                            ? this.props.theme.selectionColor
                            : this.props.gate
                                ? this.props.theme.gateColor
                                : this.props.active
                                    ? this.props.theme.wireColor
                                    : this.props.theme.inactiveColor
                    }
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
