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