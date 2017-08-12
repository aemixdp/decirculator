import React from 'react';
import { Circle } from 'react-konva';
import { PortLocationInfo } from '../data/PortLocationInfo';
import { shapeCenter } from '../utils/geometryUtils';

declare module 'Konva' {
    interface NodeConfig {
        onClick?: (e: Event) => void;
        onMouseEnter?: (e: Event) => void;
        onMouseLeave?: (e: Event) => void;
    }
}

type PortHoverZoneEventListener =
    (e: Event, pli: PortLocationInfo) => void;

type EventListeners = {
    onClick: PortHoverZoneEventListener;
    onMouseEnter: PortHoverZoneEventListener;
    onMouseLeave: PortHoverZoneEventListener;
}

type DefaultProps = EventListeners;
type Props = EventListeners & PortLocationInfo;

export class PortHoverZone extends React.Component<Props, any>  {
    static defaultProps: DefaultProps = {
        onClick: () => { },
        onMouseEnter: () => { },
        onMouseLeave: () => { },
    };
    handleClick = (e: Event) => {
        this.props.onClick(e, this.props);
    }
    handleMouseEnter = (e: Event) => {
        this.props.onMouseEnter(e, this.props);
    }
    handleMouseLeave = (e: Event) => {
        this.props.onMouseLeave(e, this.props);
    }
    render() {
        const c = shapeCenter(this.props);
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
