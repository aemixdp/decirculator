import React from 'react';
import { Stage, Layer } from 'react-konva';
import { defaultPortDirections } from '../data/PortDirection';
import { BlockDescriptor } from '../data/BlockDescriptor';
import { CircuitObjectVisuals } from '../data/CircuitObjectVisuals';

type BlockButtonEventListener =
    (event: Event, blockDescriptor: BlockDescriptor) => void;

type EventListeners = {
    onDragStart: BlockButtonEventListener;
    onDragEnd: BlockButtonEventListener;
};

type DefaultProps = EventListeners;
type Props = EventListeners & BlockDescriptor & CircuitObjectVisuals;

export class BlockButton extends React.Component<Props, any> {
    static defaultProps: DefaultProps = {
        onDragStart: () => { },
        onDragEnd: () => { },
    };
    handleDragStart = (e: Event) => {
        this.props.onDragStart(e, this.props);
    }
    handleDragEnd = (e: Event) => {
        this.props.onDragEnd(e, this.props);
    }
    render() {
        return (
            <Stage
                className="block-type-button"
                width={54}
                height={54}
            >
                <Layer>
                    <this.props.component
                        kind="block"
                        name={this.props.name}
                        id={-1}
                        theme={this.props.theme}
                        active={true}
                        draggable={false}
                        ports={defaultPortDirections}
                        x={2}
                        y={2}
                        onDragStart={this.handleDragStart}
                        onDragEnd={this.handleDragEnd}
                    />
                </Layer>
            </Stage>
        );
    }
}
