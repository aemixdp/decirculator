import { AnyCircuitObject } from './AnyCircuitObject';
import { PortDirection } from '../PortDirection';

export interface BlockCircuitObject extends AnyCircuitObject {
    kind: 'block';
    name: string;
    x: number;
    y: number;
    ports: { [_: string]: PortDirection };
}