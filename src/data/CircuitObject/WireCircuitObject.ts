import { AnyCircuitObject } from './AnyCircuitObject';
import { PortInfo } from '../PortInfo';
import { Point } from '../Point';

export interface WireCircuitObject extends AnyCircuitObject {
    kind: 'wire';
    gate: boolean;
    startPosition?: Point;
    startPortInfo: PortInfo;
    endPosition?: Point;
    endPortInfo?: PortInfo;
}
