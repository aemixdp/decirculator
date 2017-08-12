import React from 'react';
import ReactKonva from 'react-konva';
import { PortHoverZone } from './PortHoverZone';
import { PortLocationInfo, portLocationInfos } from '../data/PortLocationInfo';
import { BlockCircuitObject } from "../data/CircuitObject/BlockCircuitObject";

const { Group }: any = ReactKonva;

type BlockHoverZoneEventListener =
    (event: Event, block: BlockCircuitObject, port: PortLocationInfo) => void;

type EventListeners = {
    onPortMouseEnter: BlockHoverZoneEventListener;
    onPortMouseLeave: BlockHoverZoneEventListener;
    onPortClick: BlockHoverZoneEventListener;
}

type DefaultProps = EventListeners
type Props = EventListeners & BlockCircuitObject;

export class BlockHoverZone extends React.Component<Props, any> {
    static defaultProps: DefaultProps = {
        onPortMouseEnter: () => { },
        onPortMouseLeave: () => { },
        onPortClick: () => { },
    }
    handlePortMouseEnter = (e: Event, port: PortLocationInfo) => {
        this.props.onPortMouseEnter(e, this.props, port);
    }
    handlePortMouseLeave = (e: Event, port: PortLocationInfo) => {
        this.props.onPortMouseLeave(e, this.props, port);
    }
    handlePortClick = (e: Event, port: PortLocationInfo) => {
        this.props.onPortClick(e, this.props, port);
    }
    render() {
        return (
            <Group
                x={this.props.x}
                y={this.props.y}
            >
                {portLocationInfos.map(pli =>
                    <PortHoverZone {...pli}
                        key={pli.side.name}
                        onClick={this.handlePortClick}
                        onMouseEnter={this.handlePortMouseEnter}
                        onMouseLeave={this.handlePortMouseLeave}
                    />
                )}
            </Group>
        );
    }
}
