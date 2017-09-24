import React from 'react';
import { Stage, Layer } from 'react-konva';
import { defaultPortDirections } from '../data/PortDirection';
import { BlockDescriptor } from '../data/BlockDescriptor';
import { CircuitObjectVisuals } from '../data/CircuitObjectVisuals';

type EventListeners = {
    onDragStart: (event: Event, blockDescriptor: BlockDescriptor) => void;
};

type DefaultProps = EventListeners;
type Props = EventListeners & BlockDescriptor & CircuitObjectVisuals;

export class BlockButton extends React.Component<Props, any> {
    static width = 54;
    static height = 54;
    static defaultProps: DefaultProps = {
        onDragStart: () => { },
    };
    stage: any;
    imageDataUrl: string;
    handleDragStart = (event: any) => {
        this.props.onDragStart(event, this.props);
    }
    render() {
        if (this.stage) {
            this.imageDataUrl = this.stage.node.toDataURL();
            this.stage = null;
        }
        return this.imageDataUrl ? (
            <div
                draggable={true}
                onDragStart={this.handleDragStart}
                style={{
                    width: BlockButton.width,
                    height: BlockButton.height,
                    backgroundImage: `url(${this.imageDataUrl})`,
                }}
            />
        ) : (
                <Stage
                    className="block-type-button"
                    width={BlockButton.width}
                    height={BlockButton.height}
                    ref={elem => this.stage = elem}
                >
                    <Layer>
                        <this.props.component
                            kind="block"
                            name={this.props.name}
                            id={-1}
                            theme={this.props.theme}
                            active={true}
                            ports={defaultPortDirections}
                            x={2}
                            y={2}
                        />
                    </Layer>
                </Stage>
            );
    }
}