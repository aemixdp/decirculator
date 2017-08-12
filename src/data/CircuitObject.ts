import { WireCircuitObject } from './CircuitObject/WireCircuitObject';
import { BlockCircuitObject } from './CircuitObject/BlockCircuitObject';

export type CircuitObject = WireCircuitObject | BlockCircuitObject;
