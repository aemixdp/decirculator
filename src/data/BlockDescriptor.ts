import * as React from 'react';
import { BlockCircuitObject } from './CircuitObject/BlockCircuitObject';
import { CircuitObjectVisuals } from '../data/CircuitObjectVisuals';
import { TickProcessor } from '../circuitry/data/TickProcessor';

type EventListeners = {
    onDragStart?: (event: Event, ...args: any[]) => void;
    onDragEnd?: (event: Event, ...args: any[]) => void;
    onDragMove?: (event: Event, ...args: any[]) => void;
    onMouseEnter?: (event: Event, ...args: any[]) => void;
    onMouseLeave?: (event: Event, ...args: any[]) => void;
    onClick?: (event: Event, ...args: any[]) => void;
};

type Props = EventListeners & BlockCircuitObject & CircuitObjectVisuals;

export interface BlockDescriptor<S = any> {
    name: string;
    initialState: S;
    dynamicStateKeys: (keyof S)[];
    tick: TickProcessor;
    component: (props: Props & S) => React.ReactElement<any>;
}
