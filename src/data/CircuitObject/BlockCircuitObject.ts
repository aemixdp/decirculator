import { AnyCircuitObject } from './AnyCircuitObject';
import { PortDirection } from '../PortDirection';

export interface BlockCircuitObject extends AnyCircuitObject {
    kind: 'block';
    name: string;
    x: number;
    y: number;
    ports: { [_: string]: PortDirection };
    // beats?: number;
    // noteFraction?: number;
    // current?: number;
    // steps?: number;
    // note?: number;
    // channel?: number;
    // velocity?: number;
    // skipFirstGate?: boolean;
}