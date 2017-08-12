import { Circuit } from '../Circuit';
import { CircuitConfig } from './CircuitConfig';

export type TickProcessor =
    (circuit: Circuit, blockId: number, delta: number, config: CircuitConfig) => void;